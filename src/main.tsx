import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Add error boundary and debugging
console.log("🚀 App starting...");

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found!");
  }
  
  console.log("✅ Root element found, creating React root...");
  const root = createRoot(rootElement);
  
  console.log("✅ Rendering App...");
  root.render(<App />);
  
  console.log("✅ App rendered successfully!");
} catch (error) {
  console.error("❌ Error starting app:", error);
  
  // Fallback: try to show error message
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2>App Error</h2>
        <p>There was an error loading the application:</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error.message}</pre>
        <p>Check the browser console for more details.</p>
      </div>
    `;
  }
}
