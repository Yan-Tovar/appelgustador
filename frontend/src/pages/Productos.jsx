// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const token = localStorage.getItem("access");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/productos/productos/", config);
    setProductos(res.data);
  };

  const fetchCategorias = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/productos/categorias/", config);
    setCategorias(res.data);
  };

  const handleCrear = async () => {
    await axios.post("http://127.0.0.1:8000/api/productos/productos/",
      { nombre, precio, stock, categoria }, config);
    resetForm();
    fetchProductos();
  };

  const handleEditar = (prod) => {
    setEditingId(prod.id);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setStock(prod.stock);
    setCategoria(prod.categoria);
  };

  const handleActualizar = async () => {
    await axios.put(`http://127.0.0.1:8000/api/productos/productos/${editingId}/`,
      { nombre, precio, stock, categoria }, config);
    resetForm();
    fetchProductos();
  };

  const handleEliminar = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/productos/productos/${id}/`, config);
    fetchProductos();
  };

  const resetForm = () => {
    setEditingId(null);
    setNombre(""); setPrecio(""); setStock(""); setCategoria("");
  };

  return (
    <div>
      <h2>Productos</h2>
      <input placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} />
      <input placeholder="Precio" value={precio} onChange={(e)=>setPrecio(e.target.value)} />
      <input placeholder="Stock" value={stock} onChange={(e)=>setStock(e.target.value)} />
      <select value={categoria} onChange={(e)=>setCategoria(e.target.value)}>
        <option value="">Selecciona categoría</option>
        {categorias.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.nombre}</option>
        ))}
      </select>

      {editingId ? (
        <button onClick={handleActualizar}>Actualizar</button>
      ) : (
        <button onClick={handleCrear}>Crear</button>
      )}

      <ul>
        {productos.map(prod => (
          <li key={prod.id}>
            {prod.nombre} - ${prod.precio} - Stock: {prod.stock} - Categoría: {prod.categoria}
            <button onClick={()=>handleEditar(prod)}>Editar</button>
            <button onClick={()=>handleEliminar(prod.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}