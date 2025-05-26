import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <title>Fourkids - Wholesale Indian Clothing</title>
      <meta name="description" content="Fourkids is a premium wholesale clothing business for Indian market offering high quality trendy designs at competitive prices." />
      <meta property="og:title" content="Fourkids - Wholesale Indian Clothing" />
      <meta property="og:description" content="Discover our premium wholesale clothing collection for the Indian market with free shipping across India." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://fourkids.com" />
      <meta property="og:image" content="https://pixabay.com/get/g052aac6748570b1bfbeb2af06756ccb689fa8668bd09ef124c4752790f66024dc0d8fb9cc1fb6712cfdded25f34d1f0449685876b7e6a4bab211998f3ae7dc82_1280.jpg" />
    </Helmet>
    <App />
  </HelmetProvider>
);
