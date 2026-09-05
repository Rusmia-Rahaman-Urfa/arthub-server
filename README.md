# 🎨 ArtHub Server — Backend API & Microservices

[![Server Status](https://img.shields.io/badge/Server-Active-success?style=for-the-badge&logo=express)](https://your-backend-server.vercel.app)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📌 Overview

**ArtHub Server** is the core backend RESTful API powering the ArtHub marketplace. Built using **Node.js**, **Express.js**, and **MongoDB**, it handles role-based authorization, multi-tier user subscriptions, catalog operations, Stripe transaction webhooks, and verified user comments.

---

## 🚀 Key Responsibilities & Features

### 🔑 1. Authentication & Role-Based Access Control (RBAC)
* **JWT Token Service:** Generates and verifies secure JSON Web Tokens expiring in 7 days.
* **Role Management:** Enforces role-level permissions across routes for **User (Buyer)**, **Artist**, and **Admin**.
* **Credentials & OAuth:** Works alongside client auth mechanisms for email/password validation and Google login support.

### 🛒 2. Marketplace & Catalog APIs
* **Artwork Management:** CRUD operations for artworks (Artists can publish/edit/delete their own works; Admin can remove any work).
* **Search & Filter Pipeline:** Server-side search by title/artist, category filtering, price range queries, and multi-field sorting.
* **Automated Unpublish on Purchase:** Automatically marks artwork as **"Sold"** and disables future purchases upon completion of a sale.

### 💳 3. Stripe Payments & Tier Limits
* **Stripe Checkout Integration:** Creates secure checkout sessions for both artwork sales and subscription upgrades.
* **Quota Verification:** Validates user subscription tiers (**Free**, **Pro**, **Premium**) and purchase limits prior to session creation.
* **Stripe Webhooks:** Listens for payment events to record transactions and update database records automatically.

### 💬 4. Post-Purchase Comments & Feedback
* **Purchase Verification:** Ensures users can only post or modify comments on artworks they have explicitly purchased.
* **Comment Management:** Full CRUD operations allowing buyers to edit or delete their verified review comments.

### 📊 5. Analytics & Platform Dashboard
* **Admin Analytics:** Provides aggregate pipeline metrics for total revenue, active users, artist counts, and category sales breakdowns.
* **Transaction Histories:** Generates individual logs for buyer purchases, artist sales, and overall platform ledger history.

---

## 🛠️ Tech Stack & Dependencies

* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database & ODM:** MongoDB & Mongoose
* **Authentication:** `jsonwebtoken`, `bcryptjs`
* **Payments:** Stripe SDK (`stripe`)
* **Utilities & Security:** `dotenv`, `cors`

---




