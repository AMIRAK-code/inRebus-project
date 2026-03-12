# inRebus-project
test project doing for inRebus company,all branding rights remain in their hands

inRebus Digital Learning Hub (MVP)

An AI-powered Learning Experience Platform (LXP) and Skill Analyzer built for the Turin/Piedmont region. This platform maps user skills against regional taxonomies using NLP, identifies skill gaps, and recommends personalized training paths.

Core Features

AI Skill Analyzer: Extracts skills from pasted CVs or interactive questionnaires using scikit-learn (TF-IDF & Cosine Similarity).

Target Role Matching: Mathematically compares user skills to target careers (e.g., Mechatronics Technician) to calculate a precise match percentage.

Smart LXP Dashboard: A zero-build frontend that dynamically renders personalized learning recommendations (Courses, VR Experiences, Micro-learning).

Tech Stack

Frontend: Vanilla HTML5, Tailwind CSS (CDN), Lucide Icons, Fetch API.

Backend: Python 3.x, FastAPI, Scikit-Learn, Numpy, Uvicorn.

Quick Start

1. Boot the Backend (FastAPI)
Install the required Python libraries and start the server:

pip install fastapi uvicorn scikit-learn numpy pydantic
python api.py


The API will be live at http://localhost:8000

2. Boot the Frontend
Simply double-click index.html to open it in any modern web browser. No build steps, Webpack, or Node.js required!

Repository Structure

index.html - The complete, self-contained frontend dashboard and onboarding flow.

skill_analyzer.py - The core NLP math engine (can also be run directly as an interactive CLI).

api.py - The FastAPI wrapper that bridges the HTML frontend with the Python AI engine.
