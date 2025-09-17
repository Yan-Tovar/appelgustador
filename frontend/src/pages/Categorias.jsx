import { useEffect, useState } from "react";
import axios from "axios";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("access");

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/productos/categorias/", config);
    setCategorias(res.data);
  };

  const handleCrear = async () => {
    await axios.post("http://127.0.0.1:8000/api/productos/categorias/", 
      { nombre, descripcion }, config);
    setNombre(""); setDescripcion("");
    fetchCategorias();
  };

  const handleEditar = (cat) => {
    setEditingId(cat.id);
    setNombre(cat.nombre);
    setDescripcion(cat.descripcion);
  };

  const handleActualizar = async () => {
    await axios.put(`http://127.0.0.1:8000/api/productos/categorias/${editingId}/`, 
      { nombre, descripcion }, config);
    setEditingId(null);
    setNombre(""); setDescripcion("");
    fetchCategorias();
  };

  const handleEliminar = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/api/productos/categorias/${id}/`, config);
    fetchCategorias();
  };

  return (
    <div>
      <h2>Categorías</h2>
      <input placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} />
      <input placeholder="Descripción" value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} />
      {editingId ? (
        <button onClick={handleActualizar}>Actualizar</button>
      ) : (
        <button onClick={handleCrear}>Crear</button>
      )}

      <ul>
        {categorias.map(cat => (
          <li key={cat.id}>
            {cat.nombre} - {cat.descripcion} 
            <button onClick={()=>handleEditar(cat)}>Editar</button>
            <button onClick={()=>handleEliminar(cat.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}