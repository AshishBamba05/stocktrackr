# 📈 StockTrackr ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**Real-time portfolio tracking platform**

This project is licensed under the [MIT License](./LICENSE) © 2025 Ashish Bamba.

---

## 📌 Overview

**Stocktrackr** is a platform where users 

with live P/L calculations, watchlists, and instant WebSocket alerts.** 

**Built for speed and reliability — sub-200 ms price streaming with Redis caching and polling.**

## 🎯 Core Features

- **Real-time price streaming** via WebSockets (sub-200 ms latency)
- **Live P/L calculations** with auto-updating portfolio values
- **Watchlists** for tracking multiple assets
- **Alert engine** for price thresholds and duplicate trigger prevention
- **PostgreSQL persistence** with structured schema for users, assets, and trades

---

## 🛠️ Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| **Backend**  | NodeJS, ExpressJS, TypeScript, WebSockets |
| **Database:** | PostgreSQL  |
| **Caching:** | Redis  |
| **Containerization** | Docker, Docker Compose |
| **Deployment:** | |

---

## ⚡ Architecture Overview

[ Client (React + TS) ] <--> [ Express API ] <--> [ PostgreSQL ]
↑
| WebSockets (real-time updates)
↓
[ Redis Cache ]


- Prices cached in Redis to reduce redundant API calls  
- Alerts & portfolio updates pushed via WebSockets  
- PostgreSQL stores persistent user data, trades, and watchlists  

---

## 📸 Screenshots / Demo

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AshishBamba05/stocktrackr.git
   cd stocktrackr


