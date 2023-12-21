// src/App.js
import React from 'react';
import Terminal from './components/Terminal';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Web-based Linux Terminal</h1>
      <Terminal />
    </div>
  );
}

export default App;
