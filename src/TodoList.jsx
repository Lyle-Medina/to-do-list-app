// TodoList.jsx
import { useState, useEffect } from "react";
import "./index.css";

export default function TodoList() {
  // Load tasks from localStorage if available
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  
  const [tasks, setTasks] = useState(savedTasks);
  const [task, setTask] = useState("");
  const [darkMode, setDarkMode] = useState(savedDarkMode);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;
    const newTasks = [...tasks];
    newTasks[editIndex].text = editText;
    setTasks(newTasks);
    setEditIndex(null);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // "all" filter
  });

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className={`todo-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="header-container">
        <h2>To-Do List</h2>
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="filter-container">
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={filter === "active" ? "active" : ""} 
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button 
          className={filter === "completed" ? "active" : ""} 
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map((t, index) => {
          const actualIndex = tasks.findIndex((task) => task === t);
          return editIndex === actualIndex ? (
            <li key={actualIndex} className="edit-mode">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyPress}
                autoFocus
              />
              <div className="edit-buttons">
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            </li>
          ) : (
            <li key={actualIndex} className={t.completed ? "completed" : ""}>
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(actualIndex)}
                />
                <span className="task-text">{t.text}</span>
              </div>
              <div className="task-actions">
                <button 
                  className="edit-button"
                  onClick={() => startEdit(actualIndex)}
                  disabled={t.completed}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => removeTask(actualIndex)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="stats">
        <p>{tasks.filter(t => !t.completed).length} tasks left</p>
      </div>
    </div>
  );
}