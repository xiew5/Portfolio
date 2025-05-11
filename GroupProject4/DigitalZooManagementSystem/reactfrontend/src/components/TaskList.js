import React, { useEffect, useState } from "react";
import { getTasks } from "../services/api";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      console.log("Task Data from API:", data);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.length === 0 ? <p>No tasks available.</p> : null}
        {tasks.map((task, index) => (
          <li key={index}>
            No.{task.id} - <strong>{task.task_type}</strong> - {task.animal_species || "Unknown Animal"} 
            ({task.zookeeper_name || "Unknown Zookeeper"})
            <br />
            <small>{task.description} | Scheduled: {new Date(task.scheduled_time).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

