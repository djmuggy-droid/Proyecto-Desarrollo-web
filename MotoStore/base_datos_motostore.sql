DROP DATABASE IF EXISTS MotoStore;
CREATE DATABASE MotoStore;
USE MotoStore;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    rol ENUM('user', 'admin') DEFAULT 'user',
    estado_activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    estado_activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),
    modelo_compatible VARCHAR(150),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    imagen_url TEXT,
    id_categoria INT NOT NULL,
    estado_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE carrito (
    id_carrito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE detalle_pedido (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

INSERT INTO usuarios (nombre, correo, password, telefono, direccion, rol) VALUES
('Administrador MotoStore', 'admin@motostore.com', '$2b$10$TwSiwXRmnmc10kJYV9Fu1.f.Zzb1NoPQERDiHVSqEv.fBXFF9xDsm', '0999999999', 'Quito', 'admin'),
('Usuario Cliente', 'usuario@motostore.com', '$2b$10$TwSiwXRmnmc10kJYV9Fu1.f.Zzb1NoPQERDiHVSqEv.fBXFF9xDsm', '0988888888', 'La Magdalena, Quito', 'user');

INSERT INTO categorias (nombre, descripcion) VALUES
('Cascos', 'Cascos de seguridad para motociclistas'),
('Aceites', 'Aceites para motor de motocicletas'),
('Repuestos', 'Repuestos compatibles con diferentes modelos de motos'),
('Accesorios', 'Accesorios para conducción, protección y personalización'),
('Llantas', 'Llantas para motos urbanas y deportivas');

INSERT INTO productos (nombre, descripcion, marca, modelo_compatible, precio, stock, imagen_url, id_categoria) VALUES
('Casco Integral LS2 Negro', 'Casco integral resistente para uso urbano y carretera.', 'LS2', 'Universal', 89.99, 15, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=900', 1),
('Aceite Motul 5100 15W50', 'Aceite semisintético para motos de 4 tiempos.', 'Motul', 'Pulsar NS 125, Yamaha, Honda, Suzuki', 14.50, 40, 'https://images.unsplash.com/photo-1635437536607-b8572f443763?q=80&w=900', 2),
('Pastillas de Freno Pulsar NS 125', 'Pastillas delanteras compatibles con Pulsar NS 125.', 'Bajaj', 'Pulsar NS 125', 18.00, 20, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=900', 3),
('Guantes Racing Negros', 'Guantes deportivos con protección en nudillos.', 'Racing Pro', 'Universal', 24.99, 30, 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=900', 4),
('Llanta Michelin Pilot Street', 'Llanta para moto urbana con buen agarre y durabilidad.', 'Michelin', 'Pulsar, Yamaha FZ, Honda CB', 75.00, 12, 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=900', 5),
('Bujía NGK Iridium', 'Bujía de alto rendimiento para mejor encendido del motor.', 'NGK', 'Pulsar NS 125, Honda, Yamaha', 12.99, 35, 'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=900', 3),
('Cadena Reforzada 428H', 'Cadena reforzada para motocicletas de uso diario.', 'DID', 'Pulsar NS 125, Suzuki GN, Yamaha SZ', 32.50, 18, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=900', 3),
('Impermeable Motociclista', 'Traje impermeable para lluvia, ideal para motociclistas.', 'MotoRain', 'Universal', 28.00, 25, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=900', 4);
