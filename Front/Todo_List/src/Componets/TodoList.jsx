import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdDeleteForever, MdModeEdit } from "react-icons/md";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({ titulo: "", descripcion: "" });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/task");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (todo.titulo && todo.descripcion) {
      try {
        await axios.post("http://localhost:5000/task", todo);
        setTodo({ titulo: "", descripcion: "" });
        fetchTodos();
        setAlertMessage("Tarea guardada con éxito");
        setAlertType("success");
        setTimeout(() => clearAlert(), 3000); 
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const removeTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/task/${id}`);
      fetchTodos();
      setAlertMessage("Tarea eliminada con éxito");
        setAlertType("danger");
      setTimeout(() => clearAlert(), 3000);
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  };

  const modifyTodo = async (id, modifiedTodo) => {
    try {
      await axios.put(`http://localhost:5000/task/${id}`, modifiedTodo);
      fetchTodos();
      setTodo({ titulo: "", descripcion: "" });
      setAlertMessage("Tarea modificada con éxito");
      setAlertType("success");
      setTimeout(() => clearAlert(), 3000);
    } catch (error) {
      console.error("Error modifying todo:", error);
    }
  };

  const clearAlert = () => {
    setAlertMessage(null);
    setAlertType(null);
  };

  return (
    <div>
      <label className="m-2">
        Nombre de Tarea:
        <input className="ms-2 rounded"
          type="text"
          value={todo.titulo}
          onChange={(e) => setTodo({ ...todo, titulo: e.target.value })}
        />
      </label>
      <label className="m-2">
        Descripción:
        <input className="ms-2 rounded"
          type="text"
          value={todo.descripcion}
          onChange={(e) => setTodo({ ...todo, descripcion: e.target.value })}
        />
      </label>
      <button className="m-2 rounded" onClick={addTodo}>Agregar Tarea</button>
      <ul className="list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.titulo}</strong>: {todo.descripcion}
            <button className="m-2 rounded" onClick={() => removeTodo(todo.id)}>
              <MdDeleteForever />
            </button>
            <button className="m-2 rounded" onClick={() => modifyTodo(todo.id, { titulo: todo.titulo, descripcion: todo.descripcion })}>
              <MdModeEdit />
            </button>
          </li>
        ))}
      </ul>
      {alertMessage && (
        <div className={`alert alert-${alertType}`} role="alert">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default TodoList;
