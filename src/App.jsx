import { useState, useEffect } from "react";
import "./App.css";

function App() {
  function loadFromStorage(key, fallback) {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return fallback;
  }

  const [todoTasks, setTodoTasks] = useState(() =>
    loadFromStorage("todoTasks", [
      { id: 1, text: "Design homepage", priority: "Medium" },
    ])
  );
  const [progressTasks, setProgressTasks] = useState(() =>
    loadFromStorage("progressTasks", [])
  );
  const [doneTasks, setDoneTasks] = useState(() =>
    loadFromStorage("doneTasks", [])
  );

  const [inputValue, setInputValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("Medium");
  const [searchText, setSearchText] = useState(""); // search filter ke liye

  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
  }, [todoTasks]);

  useEffect(() => {
    localStorage.setItem("progressTasks", JSON.stringify(progressTasks));
  }, [progressTasks]);

  useEffect(() => {
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
  }, [doneTasks]);

  function handleAddTask() {
    if (inputValue === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue,
      priority: priorityValue,
      isEditing: false,
    };

    const updatedList = [...todoTasks, newTask];
    setTodoTasks(updatedList);

    setInputValue("");
    setPriorityValue("Medium");
  }

  function handleDelete(id, column) {
    if (column === "todo") {
      setTodoTasks(todoTasks.filter((task) => task.id !== id));
    }
    if (column === "progress") {
      setProgressTasks(progressTasks.filter((task) => task.id !== id));
    }
    if (column === "done") {
      setDoneTasks(doneTasks.filter((task) => task.id !== id));
    }
  }

  function handleMove(task, from, to) {
    if (from === "todo") {
      setTodoTasks(todoTasks.filter((t) => t.id !== task.id));
    }
    if (from === "progress") {
      setProgressTasks(progressTasks.filter((t) => t.id !== task.id));
    }
    if (from === "done") {
      setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
    }

    if (to === "todo") {
      setTodoTasks((prev) => [...prev, task]);
    }
    if (to === "progress") {
      setProgressTasks((prev) => [...prev, task]);
    }
    if (to === "done") {
      setDoneTasks((prev) => [...prev, task]);
    }
  }

  function toggleEdit(id, column) {
    if (column === "todo") {
      setTodoTasks(
        todoTasks.map((task) =>
          task.id === id ? { ...task, isEditing: !task.isEditing } : task
        )
      );
    }
    if (column === "progress") {
      setProgressTasks(
        progressTasks.map((task) =>
          task.id === id ? { ...task, isEditing: !task.isEditing } : task
        )
      );
    }
    if (column === "done") {
      setDoneTasks(
        doneTasks.map((task) =>
          task.id === id ? { ...task, isEditing: !task.isEditing } : task
        )
      );
    }
  }

  function handleEditChange(id, column, newText) {
    if (column === "todo") {
      setTodoTasks(
        todoTasks.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    }
    if (column === "progress") {
      setProgressTasks(
        progressTasks.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    }
    if (column === "done") {
      setDoneTasks(
        doneTasks.map((task) =>
          task.id === id ? { ...task, text: newText } : task
        )
      );
    }
  }

  function getPriorityClass(priority) {
    if (priority === "High") return "priority-high";
    if (priority === "Medium") return "priority-medium";
    return "priority-low";
  }

  // ===== DRAG AND DROP LOGIC =====
  // jab drag start hota hai, task ki details temporarily store kar lete hain
  function handleDragStart(e, task, column) {
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromColumn", column);
  }

  // column ke upar drag hote waqt default behavior rokna padta hai
  // warna drop event fire hi nahi hota
  function handleDragOver(e) {
    e.preventDefault();
  }

  // jab card ko column par drop karte hain, wahi handleMove wala logic chalayenge
  function handleDrop(e, toColumn) {
    e.preventDefault();
    const taskId = Number(e.dataTransfer.getData("taskId"));
    const fromColumn = e.dataTransfer.getData("fromColumn");

    if (fromColumn === toColumn) {
      return; // same column me drop kiya to kuch mat karo
    }

    let taskObj = null;

    if (fromColumn === "todo") {
      taskObj = todoTasks.find((t) => t.id === taskId);
    }
    if (fromColumn === "progress") {
      taskObj = progressTasks.find((t) => t.id === taskId);
    }
    if (fromColumn === "done") {
      taskObj = doneTasks.find((t) => t.id === taskId);
    }

    if (taskObj) {
      handleMove(taskObj, fromColumn, toColumn);
    }
  }

  // ===== SEARCH FILTER LOGIC =====
  // search box me jo bhi type ho, usse match karne wale tasks hi dikhayenge
  function filterTasks(taskList) {
    return taskList.filter((task) =>
      task.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  return (
    <div className="app-wrapper">
      <h1 className="app-title">My Task Board</h1>

      <div className="add-task-bar">
        <input
          type="text"
          placeholder="Enter new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <select
          value={priorityValue}
          onChange={(e) => setPriorityValue(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="board">

        <div
          className="column column-todo"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          <h2>To Do</h2>
          {filterTasks(todoTasks).map((task) => (
            <div
              key={task.id}
              className={`card ${getPriorityClass(task.priority)}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, task, "todo")}
            >
              <div className="card-top">
                {task.isEditing ? (
                  <input
                    className="edit-input"
                    value={task.text}
                    onChange={(e) =>
                      handleEditChange(task.id, "todo", e.target.value)
                    }
                    onBlur={() => toggleEdit(task.id, "todo")}
                    autoFocus
                  />
                ) : (
                  <p onClick={() => toggleEdit(task.id, "todo")}>
                    {task.text}
                  </p>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task.id, "todo")}
                >
                  ✕
                </button>
              </div>
              <span className="priority-tag">{task.priority}</span>
              <div className="card-actions">
                <button
                  className="move-btn"
                  onClick={() => handleMove(task, "todo", "progress")}
                >
                  Move →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="column column-progress"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "progress")}
        >
          <h2>In Progress</h2>
          {filterTasks(progressTasks).map((task) => (
            <div
              key={task.id}
              className={`card ${getPriorityClass(task.priority)}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, task, "progress")}
            >
              <div className="card-top">
                {task.isEditing ? (
                  <input
                    className="edit-input"
                    value={task.text}
                    onChange={(e) =>
                      handleEditChange(task.id, "progress", e.target.value)
                    }
                    onBlur={() => toggleEdit(task.id, "progress")}
                    autoFocus
                  />
                ) : (
                  <p onClick={() => toggleEdit(task.id, "progress")}>
                    {task.text}
                  </p>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task.id, "progress")}
                >
                  ✕
                </button>
              </div>
              <span className="priority-tag">{task.priority}</span>
              <div className="card-actions">
                <button
                  className="move-btn"
                  onClick={() => handleMove(task, "progress", "todo")}
                >
                  ← Back
                </button>
                <button
                  className="move-btn"
                  onClick={() => handleMove(task, "progress", "done")}
                >
                  Move →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className="column column-done"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
        >
          <h2>Done</h2>
          {filterTasks(doneTasks).map((task) => (
            <div
              key={task.id}
              className={`card ${getPriorityClass(task.priority)}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, task, "done")}
            >
              <div className="card-top">
                {task.isEditing ? (
                  <input
                    className="edit-input"
                    value={task.text}
                    onChange={(e) =>
                      handleEditChange(task.id, "done", e.target.value)
                    }
                    onBlur={() => toggleEdit(task.id, "done")}
                    autoFocus
                  />
                ) : (
                  <p onClick={() => toggleEdit(task.id, "done")}>
                    {task.text}
                  </p>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task.id, "done")}
                >
                  ✕
                </button>
              </div>
              <span className="priority-tag">{task.priority}</span>
              <div className="card-actions">
                <button
                  className="move-btn"
                  onClick={() => handleMove(task, "done", "progress")}
                >
                  ← Back
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;