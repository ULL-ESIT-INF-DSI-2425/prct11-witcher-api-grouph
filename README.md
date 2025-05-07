# 🧙‍♂️ The Witcher: API REST with Node/Express and MongoDB
## 📜 Description
This **API** allows managing hunters, merchants, goods, and transactions in the *Witcher* universe. The main routes allow you to create, read, update, and delete information about hunters, merchants, goods, and transactions using the corresponding HTTP methods.

## 🧭 Routes and Functionality
### 🧝‍♂️ Hunters
The `/hunters`route provides the ability to:
- **Create a new hunter**
- **Read all hunters** and filtered by:
    - Name
    - Race
    - Profession

    📌 **Example:** `/hunters?name=Geralt&race=Human`

- **Read a hunter by ID**
- **Partial update a hunter by ID**
- **Update a hunter by ID**
- **Delete a hunter by ID**
- **Delete all hunters**

### 🏪 Merchants
The `/merchants` route provides the ability to:
- **Create a new merchant**
- **Read all merchants** and filtered by:
    - **Name**
    - **Profession**
    - **Location**
    
    📌 **Example:** `/merchants?name=Ciri&location=Novigrado`

- **Read a merchant by ID**
- **Partial Update a merchant by ID**
- **Update a merchant by ID**
- **Delete a merchant by ID**
- **Delete all merchants**

### ⚔️ Goods (items)
The `/goods` route provides the ability to:
- **Create a new good**
- **Read all goods** filtered by:
    - **Name**
    - **Description**
    - **Material**
    - **Weight**
    - **Price**
    - **Quantity**
    - **Example:** `/goods?name=SilverSword&material=Silver`
- **Read a good by ID**
- **Update a good by ID**
- **Delete a good by ID**
- **Search for goods by type:**
    - Potions
    - Weapons
    - Armor
    
    📌 **Example**: `/goods/Potions`

### 📑 Transactions
The `/transactions` route provides the ability to:
- **Create a new transaction**
- **Read all transactions** filtered by:
    - **Type**
    - **Good**
    - **Merchant** or **Hunter**
- **Read a transaction by ID**
- **Update a transaction by ID**
- **Delete a transaction by ID**
- **Delete all transactions** 

## 📂 JSON Examples
Examples of **JSON files** for each route type can be found in the `/JSON-Examples` directory.
```bash
JSON-Examples/
    ├── hunters
    ├── goods
    ├── merchants
    └── transactions
```

## 📦 Requirements
- Node.js
- npm
- pnpm 

## ⚙️ Installation
1. Clone the repository:
```bash
git clone https://github.com/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph.git
```

2. Navigate to the project directory:
```bash
cd prct11-witcher-api-grouph
```
3. Install the dependencies:
```bash
pnpm install
```
4. Compile the TypeScript code:
```bash
tsc
```
5. Run the server:
```bash
node dist/index.js
```

## 🌐 Access to the API
The **API is accessible** at the following URL:

[https://prct11-witcher-api-grouph.onrender.com](https://prct11-witcher-api-grouph.onrender.com)

### ✅ Testing Badges
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph?branch=main)
[![CI Tests](https://github.com/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph/actions/workflows/ci.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2425/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-grouph&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-grouph)

---

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iigoPlD8)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=19273657)