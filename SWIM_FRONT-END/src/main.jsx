import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/AuthContext.jsx";

// Load the Google Maps JavaScript API script asynchronously
const script = document.createElement("script");
const googleMapsApiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
script.defer = true;
script.async = true;

// Once the script is loaded, render the React app
script.onload = () => {
  ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

// Append the script to the document body
document.body.appendChild(script);
