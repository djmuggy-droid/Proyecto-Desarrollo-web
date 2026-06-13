import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Productos() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);

      const respuestaCategorias = await api.get("/categorias");
      const respuestaProductos = await api.get("/productos");

      setCategorias(respuestaCategorias.data);
      setProductos(respuestaProductos.data);
    } catch (error) {
      console.error("Error al cargar catálogo:", error);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria.id_categoria);
    setNombreCategoria(categoria.nombre);
  };

  const volverCategorias = () => {
    setCategoriaSeleccionada(null);
    setNombreCategoria("");
  };

  const productosFiltrados = productos.filter(
    (producto) => producto.id_categoria === categoriaSeleccionada
  );

  if (cargando) {
    return (
      <main className="catalogo-page">
        <h2>Cargando catálogo...</h2>
      </main>
    );
  }

  return (
    <main className="catalogo-page">
      <section className="catalogo-header">
        <span className="badge">MotoStore Ecuador</span>

        {!categoriaSeleccionada ? (
          <>
            <h1>Elige una categoría</h1>
            <p>
              Selecciona qué necesitas para tu moto: cascos, aceites, repuestos,
              accesorios o llantas.
            </p>
          </>
        ) : (
          <>
            <h1>{nombreCategoria}</h1>
            <p>Estos son los productos disponibles en esta categoría.</p>

            <button className="btn-volver-categorias" onClick={volverCategorias}>
              ← Volver a categorías
            </button>
          </>
        )}
      </section>

      {!categoriaSeleccionada && (
        <section className="categorias-grid">
          {categorias.map((categoria) => (
            <button
              key={categoria.id_categoria}
              className="categoria-card"
              onClick={() => seleccionarCategoria(categoria)}
            >
              <div className="categoria-icono">
                {categoria.nombre === "Cascos" && "🪖"}
                {categoria.nombre === "Aceites" && "🛢️"}
                {categoria.nombre === "Repuestos" && "⚙️"}
                {categoria.nombre === "Accesorios" && "🧤"}
                {categoria.nombre === "Llantas" && "🛞"}
              </div>

              <h3>{categoria.nombre}</h3>
              <p>{categoria.descripcion}</p>

              <span>Ver productos →</span>
            </button>
          ))}
        </section>
      )}

      {categoriaSeleccionada && (
        <section className="productos-grid">
          {productosFiltrados.length === 0 ? (
            <div className="sin-productos">
              <h3>No hay productos disponibles</h3>
              <p>
                Esta categoría no tiene productos activos por el momento.
              </p>
            </div>
          ) : (
            productosFiltrados.map((producto) => (
              <article className="producto-card" key={producto.id_producto}>
                <img src={producto.imagen_url} alt={producto.nombre} />

                <div className="producto-info">
                  <span className="producto-categoria">
                    {producto.categoria}
                  </span>

                  <h3>{producto.nombre}</h3>

                  <p>
                    <strong>Marca:</strong> {producto.marca}
                  </p>

                  <p>
                    <strong>Compatible:</strong>{" "}
                    {producto.modelo_compatible}
                  </p>

                  <strong className="precio">
                    ${Number(producto.precio).toFixed(2)}
                  </strong>

                  <Link
                    className="btn-detalle"
                    to={`/productos/${producto.id_producto}`}
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}

export default Productos;
