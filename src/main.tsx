import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ErrorBoundary from './ErrorBoundary';

const App = lazy(() => import('./App'));

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
}
