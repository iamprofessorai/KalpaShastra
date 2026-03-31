# Again India - Cybernetic Veda v2.0

A high-fidelity cosmic dashboard integrating Vedic astrology, numerology, and real-time celestial data with AI-driven insights.

## Features

- **Real-Time Ephemeris**: 3D Orrery with live planetary positions.
- **Astrology Engine**: AI-powered birth chart analysis and Mahadasha tracking.
- **Numerology Matrix**: Deep numerical resonance analysis.
- **AI Vision**: Spatial cosmic scanning and aura visualization.
- **Cosmic Panjika**: Traditional Hindu almanac with a cybernetic interface.
- **Oracle ChatBot**: Real-time spiritual guidance using Gemini AI.
- **Live Oracle Session**: Voice-activated real-time conversation with the Oracle.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion.
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei.
- **AI**: Google Gemini API (@google/genai).
- **Backend**: Firebase (Auth, Firestore).
- **Calculations**: Astronomy-engine.

## Deployment on Vercel

1. **Push to GitHub**: Upload your code to a GitHub repository.
2. **Connect to Vercel**: Import the repository into Vercel.
3. **Environment Variables**: Add the following variables in the Vercel project settings:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API Key.
   - `VITE_FIREBASE_API_KEY`: Your Firebase API Key.
   - `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth Domain.
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID.
   - `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase Storage Bucket.
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase Messaging Sender ID.
   - `VITE_FIREBASE_APP_ID`: Your Firebase App ID.
   - `VITE_FIREBASE_DATABASE_ID`: Your Firestore Database ID.
4. **Deploy**: Vercel will automatically detect the Vite project and deploy it.

## Local Development

1. Install dependencies: `npm install`
2. Create a `.env` file based on `.env.example`.
3. Start the dev server: `npm run dev`
