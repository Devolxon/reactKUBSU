import React from "react";

const ToDo = ({ todo, toggleTask, removeTask }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      background: todo.complete ? '#e0e7ef' : '#f1f5f9',
      borderRadius: 8,
      padding: '8px 14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      transition: 'background .15s'
    }}
  >
    <span
      onClick={() => toggleTask(todo.id)}
      style={{
        flex: 1,
        fontSize: 16,
        color: todo.complete ? '#7c7c7c' : '#222',
        textDecoration: todo.complete ? 'line-through' : 'none',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      {todo.task}
    </span>
    <button
      onClick={() => removeTask(todo.id)}
      style={{
        marginLeft: 12,
        background: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '5px 13px',
        fontSize: 15,
        cursor: 'pointer',
        transition: 'background .15s'
      }}
      title="Удалить"
    >
      ×
    </button>
  </div>
);

export default ToDo;