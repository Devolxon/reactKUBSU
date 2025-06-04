import React, { useState, useEffect } from 'react';
import './App.css';
import ToDoForm from './AddTask';
import ToDo from './Task';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


const GEO_API_KEY = import.meta.env.VITE_GEO_API_KEY;
const TASKS_STORAGE_KEY = 'tasks-list-project-web';

// Настройка иконки маркера
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Список доступных стилей карты
const TILE_LAYERS = [
  {
    label: 'Esri WorldStreetMap (Цветная, Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
  },
  {
    label: 'CartoDB Positron (Светлая)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
  },
  {
    label: 'CartoDB Dark Matter (Тёмная)',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  },
  {
    label: 'OpenTopoMap (Топографическая)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  },
  {
    label: 'Esri WorldImagery (Спутник, Esri)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  }
];

function App() {
  // 1. Загружаем задачи сразу из localStorage
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [rates, setRates] = useState({});
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tileUrl, setTileUrl] = useState(TILE_LAYERS[0].url);

  // 2. Сохраняем задачи при каждом изменении
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      console.error(err);
      setError('Ошибка загрузки данных.');
      setLoading(false);
    }
  }, [todos]);

  // 3. Валюта и геолокация
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        // Валюта
        const currencyResponse = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
        if (!currencyResponse.data || !currencyResponse.data.Valute) throw new Error('Нет данных о валюте.');
        const USDrate = currencyResponse.data.Valute.USD.Value.toFixed(2);
        const EURrate = currencyResponse.data.Valute.EUR.Value.toFixed(2);
        setRates({ USDrate, EURrate });

        // Геолокация
        const geoResponse = await axios.get(`https://ipinfo.io/json?token=${GEO_API_KEY}`);
        if (!geoResponse.data || !geoResponse.data.loc) throw new Error('Нет данных о местоположении.');
        setGeo(geoResponse.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки данных.');
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // 4. Список задач — логика добавления, удаления, toggle
  const addTask = userInput => {
    if (userInput) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        task: userInput,
        complete: false
      };
      setTodos([...todos, newItem]);
    }
  };

  const removeTask = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggle = id => {
    setTodos(
      todos.map(task =>
        task.id === id ? { ...task, complete: !task.complete } : task
      )
    );
  };

  // 5. Оформление, стили
  return (
    <div style={{ minHeight: '100vh', background: '#242424', fontFamily: 'Segoe UI, Arial, sans-serif', paddingBottom: 40 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        {loading && <p>Загрузка...</p>}
        {!loading && error && <p style={{ color: 'red', marginBottom: 20 }}>{error}</p>}
        {!loading && !error && (
          <div style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 32
          }}>
            {/* Курсы валют */}
            <div style={{
              background: '#000',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              padding: '30px 22px',
              flex: '1 1 220px',
              minWidth: 200
            }}>
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>💵 Курсы валют</div>
              <div style={{ marginBottom: 6 }}>Доллар США: <b>{rates.USDrate}₽</b></div>
              <div>Евро: <b>{rates.EURrate}₽</b></div>
            </div>
            {/* Гео+карта */}
            {geo && (
              <div style={{
                background: '#000',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '18px 22px',
                flex: '1 1 320px',
                minWidth: 240
              }}>
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, color: '#fff' }}>📍 Местоположение</div>
                <ul style={{ fontSize: 16, marginBottom: 12, paddingLeft: 0, listStyle: 'none' }}>
                  <li style={{ color: '#fffde', marginBottom: 6 }}>
                    <b>IP:</b> {geo.ip}
                  </li>
                  <li style={{ color: '#fffde', marginBottom: 6 }}>
                    <b>Город:</b> {geo.city}
                  </li>
                  <li style={{ color: '#fffde', marginBottom: 6 }}>
                    <b>Страна:</b> {geo.country}
                  </li>
                  <li style={{ color: '#fffde', marginBottom: 6 }}>
                    <b>Провайдер:</b> {geo.org}
                  </li>
                </ul>
                <div style={{ marginBottom: 8 }}>
                  <label>
                    <span style={{ fontSize: 14, color: '#fff' }}>Стиль карты:&nbsp;</span>
                    <select
                      value={tileUrl}
                      onChange={e => setTileUrl(e.target.value)}
                      style={{
                        padding: '4px 8px',
                        fontSize: 14,
                        borderRadius: 4,
                        border: '1px solid #e5e7eb',
                        background: '#23272f',
                        color: '#fff'
                      }}
                    >
                      {TILE_LAYERS.map(t => (
                        <option value={t.url} key={t.url}>{t.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <MapContainer
                  center={geo.loc.split(',').map(Number)}
                  zoom={10}
                  style={{ height: '180px', width: '100%', borderRadius: 10 }}
                  attributionControl={false}
                >
                  <TileLayer url={tileUrl} />
                  <Marker position={geo.loc.split(',').map(Number)}>
                    <Popup>
                      {geo.city}, {geo.country}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        )}
        {/* Список задач */}
        <div style={{
          background: '#000',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: '22px 24px',
          maxWidth: 520,
          margin: '0 auto'
        }}>
          <h2 style={{
            marginBottom: 14,
            fontWeight: 600,
            fontSize: 22,
            color: '#fffde'
          }}>📝 Список задач{todos.length > 0 ? `: ${todos.length}` : ''}</h2>
          <ToDoForm addTask={addTask}/>
          <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
            {todos.length === 0 && (
                <li style={{color: '#94a3b8', textAlign: 'center', marginTop: 14}}>Нет задач</li>
            )}
            {todos.map(todo => (
                <li key={todo.id} style={{marginBottom: 10}}>
                  <ToDo
                      todo={todo}
                      toggleTask={handleToggle}
                      removeTask={removeTask}
                  />
                </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;