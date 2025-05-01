# The Witcher: API REST with Node/Express and MongoDB
## Description
This **API** allows managing hunters, merchants, goods, and transactions in the *Witcher* universe. The main routes allow you to create, read, update, and delete information about hunters, merchants, goods, and transactions using the corresponding HTTP methods.

## Routes and Functionality
### Hunters
The `/hunters`route provides the ability to:


### Merchants

### Goods (items)
The `/goods` route provides the ability to:
- **Create a new good**
- **Read all goods**
- **Read a good by ID**
- **Update a good by ID**
- **Delete a good by ID**
- **Search for goods by type**

### Transactions


## Requirements
- Node.js
- pnpm 

## Examples
Examples of **JSON files** for each route type can be found in the `/JSON-Examples` directory.
```bash
JSON-Examples/
    ├── hunters
    ├── items
    ├── merchants
    └── transactions
```
## Installation


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iigoPlD8)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=19273657)


### Badges
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph?branch=main)
[![CI Tests](https://github.com/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph/actions/workflows/ci.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2425/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-grouph/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-grouph&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-grouph)

## TO DO:
- Revisar el modelo de transacciones con owners
- Añadir manejadores (son 7 recordar) de Merchant y Transaction 
- Añadir tests para todo
- Añadir documentación para todo
- Añadir ejemplos de transaccion JSON 
- Terminar el README
