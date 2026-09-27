import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

// Sin StrictMode, como en planos-web-ai: su doble montaje hace que drei <Html> pierda etiquetas del lienzo 3D.
createRoot(document.getElementById('root')!).render(<App />);
