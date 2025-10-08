# 🎓 School Management

A secure and scalable backend built with Node.js, TypeScript, MongoDB, and Socket.IO.
It handles user authentication, real-time communication, and school data management.
Ideal for modern educational platforms that need speed, security, and flexibility.

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
├── app.ts                  # Express app config
├── server.ts               # Entry point with HTTP & Socket.IO server
├── config/
│   ├── env.ts              # ENV loader
│   └── db.ts               # MongoDB connection
├── middleware/
│   ├── auth.middleware.ts  # JWT protect/auth
│   └── socketAuth.middleware.ts # Socket.IO auth
├── models/
│   └── user.model.ts       # Mongoose model
├── routes/
│   ├── index.ts            # Root router
│   ├── user.routes.ts      # /users routes
│   └── school.routes.ts    # /schools routes
├── socket/
│   └── events/
│   └── connection.handler.ts # Socket events
└── types/
    └── express.d.ts        # Custom Request types


## 🔐 Role-Based Access

| Role    | Permissions                      |
|---------|----------------------------------|
| ADMIN   | Full access                      |
| TEACHER | View + manage schools            |


## API PAYLOADS

=> STOCK: [
    {
        "name": "Pressure Pump",
        "type": "PUMP",
        "scale": "pieces",
        "cost": 2300,
        "available": 30
    },
    {
        "name": "TABLE MOTOR",
        "type": "MOTOR",
        "scale": "pieces",
        "cost": 1200,
        "available": 30
    }
]

=> CLIENT: [
    {
        "name": "CLIENT 1",
        "company": "COMPANY 1",
        "dialCode": "+91",
        "gst": "23423421412",
        "prev": 1000,
        "mobile": "9990009090"
    }
]

=> TRANSACTION: [
    {
        "client": "|#CLIENT_ID#|",
        "items": [
            { "id": "|#ITEM_ID#|", "qty": 5, "rate": 2900 }
        ],
        "gst": 18,
        "mode": "CASH",
        "millie": "1758479400000",
        "remark": "Payment will be made till 1 December 2025"
    },
    {
        "client": "|#CLIENT_ID#|",
        "items": [
            { "id": "|#ITEM_ID#|", "qty": 5, "rate": 2500 },
            { "id": "|#ITEM_ID#|", "qty": 5, "rate": 1500 }
        ],
        "gst": 18,
        "mode": "PENDING",
        "millie": 1756665000000,
        "remark": "Payment will be made in 15 days after delivery",
        "isDelete": false,
        "id": "6d4943f5-ed62-4ea3-a3a7-c338afa867d3",
        "createdAt": 1759921367848,
        "updatedAt": 1759921367850
    },
    {
        "client": "|#CLIENT_ID#|",
        "items": [
            { "id": "|#ITEM_ID#|", "qty": 5, "rate": 2700 },
            { "id": "|#ITEM_ID#|", "qty": 5, "rate": 1700 }
        ],
        "gst": 18,
        "mode": "PENDING",
        "millie": 1757183400000,
        "remark": "Payment will be made in 22 days after delivery",
        "isDelete": false,
        "id": "58e33f50-7ac3-44dd-82e1-bd1d360be435",
        "createdAt": 1759921434186,
        "updatedAt": 1759921434190
    }
]
