// src/components/Terminal.js
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import io from 'socket.io-client';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const xtermRef = useRef(null);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    const xterm = new XTerm();
    const fitAddon = new FitAddon();

    xterm.loadAddon(fitAddon);
    xterm.open(xtermRef.current);
    fitAddon.fit();

    // Handle terminal events and socket communication
    xterm.onData((data) => {
      setInput((prevInput) => prevInput + data);
    });

    xterm.onKey((event) => {
      if (event.domEvent.key === 'Enter') {
        socket.emit('execute', input);
        setCommandHistory((history) => [...history, input]);
        setInput('');
      }
    });

    socket.on('output', (data) => {
      xterm.write(data);
    });

    return () => {
      // Cleanup logic
      xterm.dispose();
    };
  }, [socket, input]);

  const handleClear = () => {
    socket.emit('clear');
  };

  return (
    <div className="flex flex-col">
      <div ref={xtermRef} className="bg-black p-4" />
      <div className="flex mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-l-md bg-gray-800 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleClear}
          className="p-2 bg-blue-600 text-white rounded-r-md"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Terminal;
