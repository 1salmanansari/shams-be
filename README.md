# 🚀 Node.js Backend Boilerplate

A production-ready backend boilerplate built with **Node.js**, **TypeScript**, **MongoDB**, and **Socket.IO**. Includes JWT authentication, API routing, WebSocket communication, and environment-specific security.

---

## ✨ Features

- ⚙️ **Express.js** with TypeScript
- 🔐 **JWT Authentication** (with Bearer token)
- 🧑‍🤝‍🧑 **User & School APIs** (CRUD-ready)
- 🌐 **CORS + Helmet** for security
- 🧾 MongoDB with Mongoose (Cloud-ready)
- 📦 Environment-based config (`.env`)
- 🔌 Real-time **Socket.IO** support with token-based auth
- 📛 Custom error handling (401, 403, 404)
- 🆔 UUID-based IDs for uniqueness
- 🛡️ Secure origin filtering in production

---

## 📁 Folder Structure

src/
├── app.ts # Express app config
├── server.ts # Entry point with HTTP & Socket.IO server
├── config/
│ ├── env.ts # ENV loader
│ └── db.ts # MongoDB connection
├── middleware/
│ ├── auth.middleware.ts # JWT protect/auth
│ └── socketAuth.middleware.ts # Socket.IO auth
├── models/
│ └── user.model.ts # Mongoose model
├── routes/
│ ├── index.ts # Root router
│ ├── user.routes.ts # /users routes
│ └── school.routes.ts # /schools routes
├── socket/
│ └── events/
│ └── connection.handler.ts # Socket events
└── types/
└── express.d.ts # Custom Request types