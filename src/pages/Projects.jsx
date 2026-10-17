
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/tasks";

export default function Projects() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("Loading tasks...");
  const [title, setTitle] = useState("");

  async function loadTasks() {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Log in through your API client and add your JWT token to localStorage to load protected tasks.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
      setMessage("");
    } catch (error) {
      setMessage(`Could not load tasks: ${error.message}`);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token || !title.trim()) {
      setMessage("A JWT token and a task title are required.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      setTitle("");
      setMessage("");
      await loadTasks();
    } catch (error) {
      setMessage(`Could not create task: ${error.message}`);
    }
  }

  return (
    <section>
      <p className="eyebrow">YOUR WORKSPACE</p>
      <h1>Projects & Tasks</h1>
      <p className="muted">Your protected task-management workspace.</p>

      <form className="task-form" onSubmit={addTask}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter a new task"
          aria-label="New task title"
          maxLength={200}
        />
        <button type="submit">Add task</button>
      </form>

      {message && <p role="status" className="notice">{message}</p>}

      <div className="task-list">
        {tasks.map((task) => (
          <article className="task" key={task._id || task.id}>
            <span className={task.completed ? "dot done" : "dot"} />
            <div>
              <strong>{task.title}</strong>
              <p className="muted">{task.description || "No description"}</p>
            </div>
            <span className="priority">{task.priority || "normal"}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
