import React, { useState } from "react";

const ToDoForm = ({ addTask }) => {
  const [userInput, setUserInput] = useState("");

  const handleChange = e => setUserInput(e.currentTarget.value);

  const handleSubmit = e => {
    e.preventDefault();
    addTask(userInput.trim());
    setUserInput("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
      <input
        value={userInput}
        type="text"
        onChange={handleChange}
        placeholder="Новая задача..."
        style={{
          flex: 1,
          padding: '9px 14px',
          borderRadius: 6,
          border: '1.5px solid #d1d5db',
          fontSize: 15,
          outline: 'none',
          background: '#f9fafb'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '9px 20px',
          borderRadius: 6,
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          fontSize: 15,
          cursor: 'pointer',
          fontWeight: 500,
          transition: 'background .13s'
        }}
      >
        Добавить
      </button>
    </form>
  );
};

export default ToDoForm;