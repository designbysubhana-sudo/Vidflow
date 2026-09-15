# VidFlow - Creator Content Planning & Dashboard

**VidFlow** is a modern, dark-themed YouTube content planning, video management, and channel growth analytics web application built with **Node.js, Express, HTML5, CSS3, and Vanilla JavaScript**.

---

## 🚀 Features

- **Home Page**: Live video statistics (Published, Scheduled, Drafts counts), next scheduled video card, and recent uploads summary.
- **Dashboard**: Channel growth analytics, viewer metrics, retention indicators, and performance trends.
- **Upload Engine**: 
  - Drag-and-drop video file selection.
  - **Publish Now**: Saves with current timestamp and auto-refreshes Planner.
  - **Schedule for Later**: Sets future date and time with validation.
  - **Save Draft**: Saves video ideas directly into the planner.
- **Dynamic Content Planner**:
  - Full interactive monthly calendar dynamically calculating all dates, months, and years.
  - Status indicators:
    - 🟢 **Published**
    - 🔴 **Scheduled**
    - ⚪ **Draft**
  - Month navigation (Previous / Next / Current).
  - Day-click filtering & status category tabs (**All, Published, Scheduled, Drafts**).
  - One-click deletion with automatic server synchronization.
- **Settings**: Creator profile management (Name & Email) with live UI synchronization, and modular YouTube API connection prototype.
- **Persistent Backend Storage**: RESTful API persistence via `data/videos.json` (easily swappable with PostgreSQL, MongoDB, or Supabase).

---

## 📁 Project Structure

```
VidFlow/
│
├── server.js               # Express application entrypoint
├── package.json            # Node.js dependencies & scripts
├── package-lock.json       # Dependency lockfile
├── .gitignore              # Ignores node_modules/ and .env
├── README.md               # Project documentation
│
├── data/
│   └── videos.json         # Persistent JSON database for video records
│
├── routes/
│   ├── videos.js           # REST API routes for video CRUD & stats
│   └── youtube.js          # Modular YouTube API service routes
│
└── public/
    ├── index.html          # VidFlow main dashboard HTML
    ├── style.css           # Pure dark theme CSS stylesheet
    ├── script.js           # Frontend client connected to Express API
    └── assets/             # Screenshot references & media assets
```

---

## 🛠️ Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (version 8 or higher)

### Installation & Run

1. Clone the repository (or navigate to the project directory):
   ```bash
   cd VidFlow
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the VidFlow server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🔌 Backend REST API Endpoints

### Videos API (`/api/videos`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/videos` | Retrieve all videos (supports `?status=published\|scheduled\|draft` and `?date=YYYY-MM-DD`) |
| **GET** | `/api/videos/stats` | Retrieve video counts (`published`, `scheduled`, `draft`, `total`) |
| **GET** | `/api/videos/:id` | Retrieve a single video by ID |
| **POST** | `/api/videos` | Create a new video record (Draft, Published, or Scheduled) |
| **PUT** | `/api/videos/:id` | Update an existing video record |
| **DELETE** | `/api/videos/:id` | Delete a video record by ID |

### YouTube Service API (`/api/youtube`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/youtube/status` | Check channel connection status and OAuth configuration |
| **POST** | `/api/youtube/connect` | Connect channel (Prototype mode or OAuth token exchange) |
| **POST** | `/api/youtube/disconnect` | Disconnect channel |
| **GET** | `/api/youtube/stats` | Fetch channel views, subscribers, and watch time |

---

## 🔐 Future YouTube API Configuration

To enable real Google OAuth2 & YouTube Data API v3 integration:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **YouTube Data API v3** and **YouTube Analytics API**.
3. Create OAuth 2.0 Client Credentials and generate an API key.
4. Create a `.env` file in the project root:
   ```env
   PORT=3000
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   YOUTUBE_API_KEY=your_api_key_here
   ```
5. The backend routes in `routes/youtube.js` will automatically detect these credentials and handle authorized token exchanges.

---

## ☁️ Deployment Guide

Because VidFlow is now a full Node.js + Express web application, it can be deployed on any Node.js hosting platform:

- **Render**: Connect your GitHub repository, choose **Web Service**, set Build Command to `npm install` and Start Command to `npm start`.
- **Railway**: Deploy directly from GitHub repository; Railway automatically runs `npm install` and `npm start`.
- **Fly.io / Heroku / DigitalOcean**: Deploy using standard Node.js runtime.

---

## 📄 License

ISC License. Built with ❤️ for creators.
