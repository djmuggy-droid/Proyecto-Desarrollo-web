import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <section className="hero heroPro">
        <div className="heroCopy">
          <span className="pill">Tienda especializada en motos</span>
          <h1>Equipa tu moto con repuestos y accesorios de alto impacto</h1>
          <p>Catálogo de cascos, aceites, llantas, frenos y accesorios para motociclistas en Quito y Ecuador.</p>
          <div className="heroActions">
            <Link className="btn" to="/productos">Ver catálogo</Link>
            <Link className="btn secondary" to="/login">Ingresar</Link>
          </div>
        </div>
        <div className="moto3d" aria-label="Moto 3D decorativa">
          <div className="motoCard3d">
            <div className="motoEmoji">🏍️</div>
            <h3>MotoStore 3D</h3>
            <p>Inventario dinámico · compra online · panel admin</p>
          </div>
        </div>
      </section>

      <section className="statsBand">
        <article><b>+40</b><span>productos disponibles</span></article>
        <article><b>5</b><span>categorías de inventario</span></article>
        <article><b>24/7</b><span>catálogo en línea</span></article>
        <article><b>Admin</b><span>gestión protegida por rol</span></article>
      </section>

      <section className="container sectionBlock">
        <div className="sectionTitle">
          <span className="pill dark">Categorías</span>
          <h2>Todo lo que necesita una moto en un solo lugar</h2>
        </div>
        <div className="categoryGrid">
          <article className="categoryCard"><span>🪖</span><h3>Cascos</h3><p>Seguridad para ciudad y carretera.</p></article>
          <article className="categoryCard"><span>🛢️</span><h3>Aceites</h3><p>Lubricantes para mayor vida útil del motor.</p></article>
          <article className="categoryCard"><span>🛞</span><h3>Llantas</h3><p>Agarre, durabilidad y control.</p></article>
          <article className="categoryCard"><span>🔧</span><h3>Repuestos</h3><p>Frenos, bujías, cadenas y más.</p></article>
        </div>
      </section>

      <section className="experience">
        <div>
          <span className="pill">Experiencia de compra</span>
          <h2>Carrito visual, contador en tiempo real y pedidos conectados a MySQL</h2>
          <p>El usuario agrega productos, revisa cantidades, calcula el total y genera su pedido. El administrador gestiona el inventario desde un panel protegido.</p>
          <Link className="btn" to="/productos">Comprar ahora</Link>
        </div>
      </section>
    </main>
  );
}
