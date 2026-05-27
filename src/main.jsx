import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './Components/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary
          fallbackTitle="تعذر تشغيل التطبيق بالكامل"
          fallbackDescription="حدث خطأ غير متوقع أثناء تحميل الموقع. حاول تحديث الصفحة، وإذا استمرت المشكلة يمكنك العودة لاحقًا."
        >
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
