import React from "react";
import ReactDOM from "react-dom/client"; // React 18+ uses 'react-dom/client'
import App from "./App"; // Import the main App component
import "./style.css"; // Import the global CSS for styling

// Create a root element that React will use to render the app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component inside the 'root' element
root.render(
  <React.StrictMode>
    <App /> {/* This renders your main App component */}
  </React.StrictMode>
);
