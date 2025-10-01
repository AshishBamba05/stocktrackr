# 📈 StockTrackr

Real-time portfolio tracking platform with user authentication, watchlists, live P/L calculations, and instant WebSocket alerts.  
Built for speed and reliability — sub-200 ms price streaming with Redis caching and polling.

---

## 🚀 Features

- **Real-time price streaming** via WebSockets (sub-200 ms latency)
- **User authentication** and secure session management
- **Watchlists** for tracking multiple assets
- **Live P/L calculations** with auto-updating portfolio values
- **Alert engine** for price thresholds and duplicate trigger prevention
- **PostgreSQL persistence** with structured schema for users, assets, and trades

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript, WebSockets 
- **Database:** PostgreSQL  
- **Caching:** Redis  
- **Deployment:** (Add here if deployed — e.g., Render, Vercel, Heroku, etc.)

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

*(Add screenshots, GIFs, or a demo link here if available)*

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AshishBamba05/stocktrackr.git
   cd stocktrackr


