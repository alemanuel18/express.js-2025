# 🚀 API de Reservas y Citas (Express.js & Prisma)

Esta es una API RESTful premium construida con **Node.js**, **Express.js (v5)** y **Prisma ORM** con **PostgreSQL**. El sistema implementa un servicio robusto para la gestión de usuarios, roles (Admin/User), bloques horarios de atención, y un sistema dual de citas y reservas con autenticación segura por tokens JWT.

---

## 🛠️ Tecnologías y Herramientas

*   **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (ES Modules)
*   **Framework Web:** [Express.js (v5)](https://expressjs.com/)
*   **ORM:** [Prisma](https://www.prisma.io/) (con la extensión `@prisma/extension-accelerate`)
*   **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
*   **Seguridad y Autenticación:** [JWT (JSON Web Tokens)](https://jwt.io/) & [bcrypt / bcryptjs](https://github.com/kelektiv/node.bcrypt.js)
*   **Logs y Monitoreo:** Middleware personalizado de logging con marcas de tiempo y tiempos de respuesta.

---

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura limpia basada en capas (Rutas -> Controladores -> Servicios -> Base de datos):

```text
├── prisma/
│   ├── migrations/          # Historial de migraciones de base de datos
│   └── schema.prisma        # Definición del esquema de Prisma (Modelos y relaciones)
├── src/
│   ├── controllers/         # Controladores encargados de recibir las peticiones HTTP
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   └── reservationController.js
│   ├── middlewares/         # Middlewares de Express (Autenticación, logs, errores)
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── routes/              # Definición de rutas y su enrutador principal
│   │   ├── admin.js
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   ├── index.js
│   │   └── reservations.js
│   ├── services/            # Lógica de negocio (Interacción con Prisma)
│   │   ├── adminService.js
│   │   ├── appointmentService.js
│   │   ├── authService.js
│   │   └── reservationService.js
│   ├── app.js               # Configuración inicial de Express
│   ├── seed.js              # Script para poblar la base de datos con datos de prueba
│   └── server.js            # Punto de entrada para levantar el servidor
├── .env.example             # Plantilla de variables de entorno
├── package.json             # Dependencias y scripts de npm
└── README.md                # Documentación del proyecto
```

---

## 📊 Modelo de Datos (Base de Datos)

El esquema de la base de datos cuenta con tres entidades principales. A continuación se presenta el modelo relacional en formato **Mermaid**:

```mermaid
erDiagram
    USER ||--o{ APPOINTMENT : "has"
    TIMEBLOCK ||--o{ APPOINTMENT : "contains"

    USER {
        Int id PK
        String name
        String email UK
        String password
        Role role "ADMIN | USER"
    }

    TIMEBLOCK {
        Int id PK
        DateTime startTime
        DateTime endTime
    }

    APPOINTMENT {
        Int id PK
        DateTime date
        Int userId FK
        Int timeBlockId FK
    }
```

### Roles (`Role`)
*   `ADMIN`: Usuarios administradores con acceso a la gestión global de bloques horarios y revisión general de reservas.
*   `USER`: Usuarios estándar con permisos para reservar y gestionar sus propias citas.

---

## ⚙️ Instalación y Configuración

### 1. Clonar o descargar el repositorio
Asegúrate de que estás en la raíz del proyecto.

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`:

```bash
cp .env.example .env
```

Define los valores correspondientes en tu archivo `.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_secreto_super_seguro_para_jwt
CLIENT_URL=http://localhost:5173

# URL de conexión a tu base de datos PostgreSQL (requerido por Prisma)
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db?schema=public"
```

### 3. Instalar Dependencias
Ejecuta el siguiente comando para instalar todos los paquetes necesarios:

```bash
npm install
```

### 4. Ejecutar Migraciones de Base de Datos (Prisma)
Genera el cliente de Prisma y ejecuta las migraciones para crear las tablas en PostgreSQL:

```bash
# Ejecutar migraciones en desarrollo
npx prisma migrate dev --name init
```

### 5. Sembrar la Base de Datos (Seed)
Puedes poblar tu base de datos local con datos de ejemplo (usuarios iniciales con roles, bloques horarios y algunas citas):

```bash
node src/seed.js
```

> [!NOTE]
> Esto creará por defecto dos usuarios:
> *   **Usuario Admin:** `admin1@example.com` con contraseña `admin123` (Rol: `ADMIN`)
> *   **Usuario Estándar:** `user12@example.com` con contraseña `password123` (Rol: `USER`)

### 6. Iniciar Servidor de Desarrollo
Para arrancar la aplicación con recarga automática en cambios (utilizando el watch incorporado de Node.js):

```bash
npm run dev
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🔒 Seguridad y Autenticación

Todas las rutas privadas requieren que el cliente envíe un token JWT válido en las cabeceras HTTP:

```http
Authorization: Bearer <TOKEN_JWT>
```

*   **Emisión:** Los tokens son emitidos al iniciar sesión exitosamente (`POST /api/auth/login`).
*   **Expiración:** El token tiene una validez de **4 horas**.
*   **Carga útil (Payload):** El token incluye `{ id: usuarioId, role: usuarioRol }`.

---

## 🧠 Lógica de Conflicto de Citas vs. Reservas

La API implementa dos enrutamientos distintos para agendar citas/reservas sobre la tabla `Appointment`, y cada una maneja los conflictos de forma diferente:

1.  **Reservas Globales (`/api/reservations`)**:
    *   Trata las reservas como **exclusivas**.
    *   No permite que dos personas agenden citas en el mismo bloque horario (`timeBlockId`) en la misma fecha (`date`).
    *   *Uso recomendado:* Para citas 1 a 1 donde el profesional o el recurso sólo puede atender a una persona a la vez.

2.  **Citas de Usuario (`/api/users/:id/appointments`)**:
    *   Trata los conflictos a nivel de **usuario individual**.
    *   Permite que diferentes usuarios agenden citas en el mismo bloque horario y fecha, pero **evita que el mismo usuario** duplique su propia agenda (no puede tener más de una cita asignada en el mismo bloque y fecha).
    *   *Uso recomendado:* Para eventos grupales, clases o consultas donde múltiples usuarios pueden coincidir en el mismo bloque, pero el usuario no puede estar en dos citas a la vez.

---

## 📡 Referencia de la API

Todas las rutas principales de la API están prefijadas por `/api`.

| Método | Endpoint | Autenticación | Roles | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| **POST** | `/api/auth/register` | ❌ No | Todos | Registra un nuevo usuario (`USER`). |
| **POST** | `/api/auth/login` | ❌ No | Todos | Autentica un usuario y devuelve un token JWT. |
| **GET** | `/api/auth/protected-route` | 🔑 Sí | Todos | Verifica si un token es válido. |
| **POST** | `/api/admin/time-block` | 🔑 Sí | `ADMIN` | Crea un nuevo bloque de tiempo disponible. |
| **GET** | `/api/admin/reservations` | 🔑 Sí | `ADMIN` | Lista todas las citas existentes con detalles del usuario y bloque de tiempo. |
| **POST** | `/api/reservations` | 🔑 Sí | Todos | Crea una reserva exclusiva (sin permitir solapamientos globales). |
| **GET** | `/api/reservations/:id` | 🔑 Sí | Todos | Obtiene los detalles de una reserva específica. |
| **PUT** | `/api/reservations/:id` | 🔑 Sí | Todos | Actualiza la fecha o bloque de una reserva específica. |
| **DELETE** | `/api/reservations/:id` | 🔑 Sí | Todos | Cancela / elimina una reserva. |
| **GET** | `/api/users/:id/appointments` | 🔑 Sí | Todos | Obtiene todas las citas asociadas a un usuario específico. |
| **POST** | `/api/users/:id/appointments` | 🔑 Sí | Todos | Crea una cita para un usuario específico (evita solapamiento propio). |
| **PUT** | `/api/users/:id/appointments/:appointmentId` | 🔑 Sí | Todos | Modifica una cita específica asociada al usuario. |
| **DELETE** | `/api/users/:id/appointments/:appointmentId` | 🔑 Sí | Todos | Elimina/cancela una cita de usuario. |

---

### Detalle de Endpoints

#### 🔑 1. Autenticación (`/api/auth`)

##### **POST `/api/auth/register`**
Registra una cuenta de usuario nueva con el rol predeterminado `USER`.
*   **Body (JSON):**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "mySecurePassword"
    }
    ```
*   **Respuestas:**
    *   `201 Created`:
        ```json
        {
          "message": "User registered successfully"
        }
        ```
    *   `400 Bad Request` (si el email ya está en uso o faltan datos).

##### **POST `/api/auth/login`**
Autentica a un usuario y genera su token JWT de sesión.
*   **Body (JSON):**
    ```json
    {
      "email": "john@example.com",
      "password": "mySecurePassword"
    }
    ```
*   **Respuestas:**
    *   `200 OK`:
        ```json
        {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```
    *   `401 Unauthorized` (credenciales inválidas).

##### **GET `/api/auth/protected-route`**
Ruta de prueba para verificar la cabecera de autenticación.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Respuestas:**
    *   `200 OK`:
        ```json
        {
          "message": "This is a protected route"
        }
        ```
    *   `401 Unauthorized` (si falta el token).
    *   `403 Forbidden` (token inválido o expirado).

---

#### 👑 2. Administración (`/api/admin`)

##### **POST `/api/admin/time-block`**
Permite crear un bloque de tiempo de atención.
*   **Headers:** `Authorization: Bearer <TOKEN>` (Sólo `ADMIN`)
*   **Body (JSON):**
    ```json
    {
      "startTime": "2026-06-25T09:00:00.000Z",
      "endTime": "2026-06-25T10:00:00.000Z"
    }
    ```
*   **Respuestas:**
    *   `201 Created`:
        ```json
        {
          "id": 3,
          "startTime": "2026-06-25T09:00:00.000Z",
          "endTime": "2026-06-25T10:00:00.000Z"
        }
        ```
    *   `403 Forbidden` (si el usuario logueado no es administrador).

##### **GET `/api/admin/reservations`**
Obtiene un listado completo de todas las reservas y citas registradas en el sistema.
*   **Headers:** `Authorization: Bearer <TOKEN>` (Sólo `ADMIN`)
*   **Respuestas:**
    *   `200 OK`:
        ```json
        [
          {
            "id": 1,
            "date": "2026-06-25T00:00:00.000Z",
            "userId": 1,
            "timeBlockId": 1,
            "user": {
              "id": 1,
              "name": "User One",
              "email": "user12@example.com",
              "role": "USER"
            },
            "timeBlock": {
              "id": 1,
              "startTime": "2026-06-25T09:00:00.000Z",
              "endTime": "2026-06-25T10:00:00.000Z"
            }
          }
        ]
        ```

---

#### 🗓️ 3. Reservas Exclusivas (`/api/reservations`)

##### **POST `/api/reservations`**
Crea una reserva única. Valida que nadie más haya reservado ese bloque en esa fecha.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Body (JSON):**
    ```json
    {
      "date": "2026-06-25T00:00:00.000Z",
      "timeBlockId": 1,
      "userId": 1
    }
    ```
*   **Respuestas:**
    *   `201 Created` (Devuelve el objeto de la reserva creada).
    *   `400 Bad Request` (si el bloque ya está ocupado: `"message": "Time slot already booked"`).

##### **GET `/api/reservations/:id`**
Retorna la información de una reserva específica por su ID.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Respuestas:**
    *   `200 OK` (objeto de la reserva).
    *   `404 Not Found` (`"message": "Reservation not found"`).

##### **PUT `/api/reservations/:id`**
Modifica una reserva específica (por ejemplo, cambia la fecha o el bloque).
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Body (JSON):**
    ```json
    {
      "date": "2026-06-26T00:00:00.000Z",
      "timeBlockId": 2
    }
    ```
*   **Respuestas:**
    *   `200 OK` (objeto actualizado).
    *   `400 Bad Request` (si el nuevo bloque de tiempo o fecha elegida ya se encuentra reservado).

##### **DELETE `/api/reservations/:id`**
Elimina una reserva del sistema.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Respuestas:**
    *   `204 No Content` (eliminación exitosa).
    *   `404 Not Found` (si la reserva no existe).

---

#### 👤 4. Citas del Usuario (`/api/users/:id/appointments`)

##### **GET `/api/users/:id/appointments`**
Obtiene todas las citas de un usuario determinado.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Respuestas:**
    *   `200 OK`:
        ```json
        [
          {
            "id": 5,
            "date": "2026-06-25T00:00:00.000Z",
            "userId": 2,
            "timeBlockId": 1,
            "timeBlock": {
              "id": 1,
              "startTime": "2026-06-25T09:00:00.000Z",
              "endTime": "2026-06-25T10:00:00.000Z"
            }
          }
        ]
        ```

##### **POST `/api/users/:id/appointments`**
Crea una cita para un usuario en específico. Valida que **este usuario** no tenga otra cita al mismo tiempo.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Body (JSON):**
    ```json
    {
      "date": "2026-06-25T00:00:00.000Z",
      "timeBlockId": 1
    }
    ```
*   **Respuestas:**
    *   `201 Created` (Devuelve el objeto de la cita).
    *   `500 Internal Server Error` (si hay colisión de citas para el propio usuario: `"message": "Error creating appointment"`).

##### **PUT `/api/users/:id/appointments/:appointmentId`**
Modifica los datos de una cita particular del usuario.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Body (JSON):**
    ```json
    {
      "date": "2026-06-26T00:00:00.000Z",
      "timeBlockId": 2
    }
    ```
*   **Respuestas:**
    *   `200 OK` (objeto de la cita editada).
    *   `500 Internal Server Error` (si choca con otra cita existente del propio usuario).

##### **DELETE `/api/users/:id/appointments/:appointmentId`**
Cancela y elimina una cita específica de un usuario.
*   **Headers:** `Authorization: Bearer <TOKEN>`
*   **Respuestas:**
    *   `204 No Content` (eliminación exitosa).

---

## ⚡ Middlewares Globales

1.  **Logger Middleware (`src/middlewares/logger.js`):**
    Imprime en consola cada petición HTTP entrante con el método, ruta, dirección IP de origen, y al finalizar la petición registra el código de estado HTTP resultante y la duración de procesamiento en milisegundos.
    ```text
    [24/6/2026, 12:00:00 PM GET /api/admin/reservations] - IP: ::1
    [24/6/2026, 12:00:00 PM GET /api/admin/reservations] - Status: 200 - Duration: 45ms
    ```

2.  **Error Handler Middleware (`src/middlewares/errorHandler.js`):**
    Atrapa todas las excepciones que son lanzadas o propagadas en los controladores. Retorna un formato JSON limpio y estructurado. En caso de que `NODE_ENV` sea igual a `development`, incluye también el `stack` de la traza del error para facilitar la depuración.
    ```json
    {
      "status": "error",
      "statusCode": 500,
      "message": "Error al procesar la cita"
    }
    ```

---

## 👥 Contribuciones y Autoría

*   **Desarrollador / Autor del Curso:** Miguel Reyes (miguelreyesmoreno@hotmail.com)
*   **Licencia:** MIT
