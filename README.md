# 🌀 A0 – AI-Powered Animation Studio

**A0** is an end-to-end AI-powered animation generation platform. It uses **Google Gemini AI** to convert text prompts into Python animation code, which is then rendered using **ManimCE** (Mathematical Animation Engine). This app includes a React-based frontend, an Express backend, and a job queue system to manage multiple animation requests efficiently.

---

## 📽️ Demo Preview

**Prompt → Code → Rendered Video**  
Write what you imagine and watch it animate!
[![Watch the demo](https://img.youtube.com/vi/OPpAr8HI3S4/0.jpg)](https://youtu.be/OPpAr8HI3S4)


---

## ✨ Features

- ✅ Generate Python animation scripts from natural language
- 🧠 Uses Gemini 2.5 Flash model from Google GenAI
- 🔁 Queued job processing system to prevent overload
- 🎬 ManimCE-based rendering engine
- 🎥 Play rendered MP4 video in-browser
- 🌐 React + TailwindCSS frontend
- 📦 Docker & Render deployment ready

---

## 🧠 How it Works

1. User enters a prompt like “Animate a bouncing red ball moving left to right.”
2. Gemini AI generates valid Python animation code for Manim.
3. The code is submitted as a job to the backend.
4. Backend queues and runs Manim rendering jobs.
5. A rendered video is returned and previewed in the frontend.

---

## 📁 Folder Structure

```
A0/
├── backend/
│   ├── api/                       # Main backend logic
│   │   ├── server.js              # Express server
│   │   ├── jobManager.js          # Job queue manager
│   │   ├── job.js                 # Job creation & execution logic
│   │   ├── manimPrompt.js         # Static prompt to assist Gemini
│   │   └── .env                   # Contains your GEMINI API key
│   │
│   ├── execution/                 # Temporary directory for rendering jobs
│   └── Dockerfile                 # Backend Dockerfile
│
├── frontend/
│   ├── App.tsx                    # Main React app entry
│   ├── components/                # Reusable UI components
│   │   ├── Studio.tsx            # Animation studio interface
│   │   └── LandingPage.tsx       # Intro / landing screen
│   └── package.json               # Frontend dependencies
│
├── .gitignore
├── README.md                      # You're here!
└── package.json                   # Root project metadata (if monorepo)
```

---


---

## ⚙️ Tech Stack

| Layer      | Tech                                |
|------------|--------------------------------------|
| Frontend   | React, TailwindCSS, Framer Motion    |
| Backend    | Node.js, Express.js, Axios           |
| AI Model   | Google Gemini 2.5 Flash              |
| Renderer   | Manim Community Edition              |
| DevOps     | Docker, Render                       |

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/saishmungase/A0
cd A0
```

---

### 2️⃣ Setup Backend

```bash
cd backend
cd api
npm install
```

Create a `.env` file with your Google Gemini API Key:

```env
GEMINI=your_google_api_key_here
```

Run backend:

```bash
node server.js
```

> The backend runs at `http://localhost:3000`

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

> The frontend runs at `http://localhost:5173`

---

## 📦 Docker Deployment

To build and run the entire app using Docker:

```bash
docker build -t a0-app .
docker run -p 3000:3000 a0-app
```

Ensure:
- `execution/` is included in `.dockerignore` if not needed
- Your Dockerfile correctly copies backend and frontend folders

---

## 🌐 API Endpoints

These endpoints are provided by the Express backend running on port `3000`.

| Method | Endpoint         | Description                                                                 |
|--------|------------------|-----------------------------------------------------------------------------|
| POST   | `/generate`      | Accepts a user prompt and generates Python code using Google Gemini AI.     |
| POST   | `/submit`        | Submits generated Manim code and scene name as a job to be rendered.        |
| GET    | `/status/:id`    | Checks the status of a job using its job ID as a URL parameter.             |
| POST   | `/status`        | Checks the job status using a job ID sent in the request body.              |
| GET    | `/result/:id`    | Returns the final rendered MP4 video file for the given job ID.             |

---

### 📥 Request Examples

#### 🔹 `POST /generate`

Generates animation code from a text prompt using Gemini.

**Request Body:**

```json
{
  "prompt": "Animate a red ball bouncing across the screen."
}
```

**Response:**

```json
{
  "type": "success",
  "code": "class MyScene(Scene): ...",
  "message": "Code generated successfully!"
}
```

---

#### 🔹 `POST /submit`

Submits Manim code and scene name for rendering.

**Request Body:**

```json
{
  "name": "BouncingBall",
  "code": "```python\nclass BouncingBall(Scene):\n  def construct(self): ...\n```"
}
```

**Response:**

```json
{
  "type": "created",
  "jobId": "abc123",
  "message": "Job is added successfully!"
}
```

---

#### 🔹 `GET /status/:id`

Checks the current status of a job.

**Response:**

```json
{
  "status": "pending" // or "running", "completed", "failed"
}
```

---

#### 🔹 `POST /status`

Alternative to the GET version using body-based job ID.

**Request Body:**

```json
{
  "id": "abc123"
}
```

---

#### 🔹 `GET /result/:id`

Fetches the final video once rendering is complete.

- Returns the `.mp4` video as a stream.
- If the video isn’t ready or was deleted, it returns HTTP `410 Gone`.

---


## 🎨 Sample Prompt

```text
Animate a circle that grows from size 0.5 to 2, then fades out.
```

Gemini generates a Python script, which Manim renders into a video clip you can watch in the browser.

---

## ⚠️ Notes & Recommendations

- **Prompt Limit**: Max 500 characters (enforced in frontend)
- **Sanitization**: Python code is cleaned before writing to disk
- **Security**: Avoid exposing this API publicly without validation
- **Job Cleanup**: Rendered files auto-delete after 60s to save space

---

## 🔐 Environment Variables

Set your environment variables in `.env`:

```env
GEMINI=your_google_genai_api_key
```

---

## 🧪 Manim Test

To test rendering without Gemini:

```bash
manim my_animation.py MyScene -pql
```

Ensure Manim is installed locally:

```bash
pip install manim
```

---

## 📄 License

MIT License © [Saish Mungase](https://github.com/saishmungase)

---

## 👏 Acknowledgements

- [ManimCE](https://www.manim.community/)
- [Google Generative AI](https://makersuite.google.com/app)
- [Render.com](https://render.com/)

---

## 🙌 Contribute

Pull requests, issues, and suggestions are welcome.  
If you’d like to help improve or extend the project, feel free to fork or message me.

---

## 💡 Future Roadmap

- [ ] User accounts & dashboard
- [ ] Export to GIF/WebM formats
- [ ] AI model switcher (Gemini, GPT, Claude)
- [ ] Video hosting via CDN
- [ ] Full prompt history saving
