# 📦 API REST -- Sistema de Reservas

## 📌 Descripción

Esta API REST fue desarrollada en TypeScript utilizando Express y
MongoDB.\
Permite gestionar reservas de servicios o productos, incluyendo
autenticación de usuarios, protección de rutas y filtrado avanzado
mediante query params.

Cada usuario autenticado puede:

-   Crear reservas
-   Consultar sus reservas
-   Actualizarlas
-   Eliminarlas
-   Filtrar, ordenar y paginar resultados

------------------------------------------------------------------------

## 🧠 Tecnologías utilizadas

-   TypeScript
-   Express
-   MongoDB
-   Mongoose (ODM)
-   Zod (validación de datos)
-   bcryptjs (hash de contraseñas)
-   jsonwebtoken (JWT)
-   dotenv
-   cors

MongoDB es la base de datos, mientras que Mongoose permite modelar y
consultar los datos desde Node.js de manera estructurada.

------------------------------------------------------------------------

## 🏗 Arquitectura

Se utilizó patrón MVC (Model -- Controller -- Routes).

src/ ├── config/ ├── models/ ├── controllers/ ├── routes/ ├──
middlewares/ ├── validators/ ├── app.ts └── server.ts

------------------------------------------------------------------------

## 🚀 Proceso de desarrollo

1.  Definición de la entidad principal (Reservation).
2.  Configuración inicial del proyecto con TypeScript.
3.  Instalación de dependencias y tipos.
4.  Configuración de conexión a MongoDB.
5.  Creación de modelos Mongoose.
6.  Implementación de validaciones con Zod.
7.  Desarrollo de controladores CRUD.
8.  Implementación de autenticación con JWT.
9.  Protección de rutas mediante middleware.
10. Implementación de filtros dinámicos, paginación y ordenamiento.

------------------------------------------------------------------------

## 🔐 Autenticación

La API utiliza JWT.

Flujo: 1. Registro de usuario. 2. Login. 3. Generación de token. 4.
Envío del token en el header:

Authorization: Bearer `<token>`{=html}

------------------------------------------------------------------------

## 📌 Endpoints principales

Auth: - POST /auth/register - POST /auth/login

Reservations: - GET /reservations - GET /reservations/:id - POST
/reservations - PUT /reservations/:id - DELETE /reservations/:id

------------------------------------------------------------------------

## 🔎 Query Params disponibles

Filtros: - status - email - q (búsqueda textual) - from / to (rango por
fecha de inicio) - endFrom / endTo (rango por fecha de finalización)

Paginación: ?page=1&limit=10

Ordenamiento: ?sort=startAt ?sort=-startAt

------------------------------------------------------------------------

## 📂 Variables de entorno

PORT=5000 MONGO_URI=mongodb://127.0.0.1:27017/api_reservas
JWT_SECRET=super_secret_cambiame JWT_EXPIRES_IN=2h

------------------------------------------------------------------------

## ▶️ Instalación

npm install npm run dev

Servidor: http://localhost:5000

------------------------------------------------------------------------

## 📌 Conclusión

La API implementa CRUD completo, autenticación JWT, validación robusta,
filtros dinámicos, paginación, ordenamiento y arquitectura modular
escalable.
