const CONFIG = {

    API_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:8000/api/analyze"
        : "https://inrebus-backendlms.onrender.com/api/analyze",
    
    APP_NAME: "inRebus Edu",
    VERSION: "1.0.0"
};