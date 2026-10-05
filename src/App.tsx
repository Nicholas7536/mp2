import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { GalleryView } from './views/GalleryView';
import { ListView } from './views/ListView';
import { DetailsView } from './views/DetailsView';

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/gallery" replace />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/characters/:id" element={<DetailsView />} />
            <Route path="*" element={<Navigate to="/gallery" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
