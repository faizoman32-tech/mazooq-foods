import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initAnalytics } from './utils/analytics';

initAnalytics();

// Any photo that fails to load (deleted, renamed, offline link…) is replaced by a
// branded "photo coming soon" image instead of a broken-image icon.
const PHOTO_FALLBACK = '/photos/photo-coming-soon.svg';
document.addEventListener(
  'error',
  (e) => {
    const img = e.target;
    if (img instanceof HTMLImageElement && !img.src.endsWith(PHOTO_FALLBACK)) {
      img.srcset = '';
      img.src = PHOTO_FALLBACK;
    }
  },
  true, // image errors don't bubble, so listen in the capture phase
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
