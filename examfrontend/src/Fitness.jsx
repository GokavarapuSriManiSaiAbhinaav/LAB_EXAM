// src/components/Fitness.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import './Fitness.css';
import { API_BASE_URL } from "./config";

const Fitness = () => {
  const [fitnessList, setFitnessList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: ""
  });
  const [editId, setEditId] = useState(null);

  // Fetch all fitness records
  const fetchFitness = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setFitnessList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFitness();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update fitness
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(API_BASE_URL, form);
      }
      setForm({ name: "", age: "", height: "", weight: "" });
      fetchFitness();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit record
  const handleEdit = (fitness) => {
    setForm({
      name: fitness.name,
      age: fitness.age,
      height: fitness.height,
      weight: fitness.weight,
    });
    setEditId(fitness.id);
  };

  // Delete record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchFitness();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Fitness Records</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={form.height}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {/* Table */}
      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Height (cm)</th>
            <th>Weight (kg)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fitnessList.map((fitness) => (
            <tr key={fitness.id}>
              <td>{fitness.name}</td>
              <td>{fitness.age}</td>
              <td>{fitness.height}</td>
              <td>{fitness.weight}</td>
              <td>
                <button onClick={() => handleEdit(fitness)}>Edit</button>
                <button onClick={() => handleDelete(fitness.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {fitnessList.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Fitness;
