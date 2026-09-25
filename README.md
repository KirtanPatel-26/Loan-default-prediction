# LoanShield AI - Loan Default Risk Prediction Platform

An enterprise loan default risk assessment platform featuring an ML backend (FastAPI + Scikit-Learn) and an interactive 3D frontend (React 19 + Three.js + Tailwind CSS).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/KirtanPatel-26/Loan-default-prediction)

---

## 🌟 Key Features

- **Real-Time ML Default Prediction**: Logistic regression model with calibrated probability scoring and risk tier categorization.
- **Explainable Risk Insights**: Automatic factor breakdown analyzing DTI ratio, credit score, employment tenure, and loan amount.
- **Model Evaluation & Analytics**: Confusion matrix, cross-validation metrics, train-test generalization gap, and comparison with ensemble methods (Random Forest, AdaBoost, Gradient Boosting).
- **Modern Interactive UI**: 3D Risk Core visualization built with Three.js / React Three Fiber, Framer Motion animations, and custom interactions.

---

## 🏗️ Architecture

```
Loan-default-prediction/
├── backend/                  # FastAPI REST API & ML Inference
│   ├── server.py             # API routes & model prediction endpoints
│   ├── ml_evaluation_data.json # Task 5 model evaluation metrics & benchmarking
│   ├── loan_default_model.pkl# Pre-trained Logistic Regression model
│   ├── feature_columns.pkl   # 24 model feature column definitions
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React + Vite + Tailwind 3D Dashboard
│   ├── src/                  # React components & UI logic
│   ├── vercel.json           # Vercel SPA routing configuration
│   └── package.json          # Node dependencies
├── Loan_default_streamlit/   # Standalone Streamlit application
│   └── app.py
├── render.yaml               # Render Blueprint definition
└── requirements.txt          # Root Python dependencies
```

---

## 🚀 Live Deployment Guide

### 1. Backend on Render (FastAPI)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect this repository: `https://github.com/KirtanPatel-26/Loan-default-prediction`.
3. Set the following configuration:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Environment Variable**: `PYTHON_VERSION` = `3.11.9`
4. Deploy the service and copy your public URL:
   > `https://<YOUR-RENDER-NAME>.onrender.com`

### 2. Frontend on Vercel (React + Vite)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import this repository: `Loan-default-prediction`.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. Add an **Environment Variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://<YOUR-RENDER-NAME>.onrender.com/api`
5. Click **Deploy**.

---

## 💻 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```
API runs at `http://127.0.0.1:8000` (docs at `http://127.0.0.1:8000/docs`).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
UI runs at `http://localhost:5173`.
