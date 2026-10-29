import { createRoot, hydrateRoot } from 'react-dom/client';
import { RendererProvider, createDOMRenderer } from '@griffel/react';
import { App } from './App';
import './styles/site.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing portfolio root');
const app = <RendererProvider renderer={createDOMRenderer()}><App /></RendererProvider>;
if (root.querySelector('main')) hydrateRoot(root, app);
else createRoot(root).render(app);