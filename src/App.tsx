// src/App.tsx
import React, { useState, lazy, Suspense } from 'react';
import './App.css'; // Assuming you have some global styles
import ErrorBoundary from './ErrorBoundary';

type Show = {
  id: number; // Example property
  title: string; // Example property
  image: string; // Added property
  description: string; // Added property
  genres: string[]; // Added property
  seasons: Season[]; // Added property
};

const ShowList = lazy(() => import('./components/ShowList'));
const Modal = lazy(() => import('./components/Modal')); // Lazy load Modal

const App: React.FC = () => {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleShowSelect = (show: Show) => {
    setSelectedShow(show);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedShow(null);
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <ShowList onShowSelect={handleShowSelect} />
        {modalVisible && selectedShow && (
          <Modal show={modalVisible} onClose={closeModal} showData={selectedShow} />
        )}
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
