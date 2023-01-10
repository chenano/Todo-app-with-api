import React, { useState, useEffect } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, status: false }),
    })
      .then(response => response.json())
      .then(data => setTasks([...tasks, data]));
    setName('');
    window.location.reload(false);

  };

  const toggleTaskStatus = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === id) {
        return { ...task, status: !task.status };
      }
      return task;
    });
    setTasks(updatedTasks);
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: !tasks.find(task => task._id === id).status }),
    });
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task._id !== id);
    setTasks(updatedTasks);
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });
  };

  return (
    <div>
      <h1>TODO List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Task name:</label>
        <input type="text" id="name" value={name} onChange={handleChange} />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id}> {task.name}
            <input type="checkbox" checked={task.status} onChange={() => toggleTaskStatus(task._id)} />
            
            <button type="button" onClick={() => deleteTask(task._id)}> Delete </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
