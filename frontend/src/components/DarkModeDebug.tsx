import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const DarkModeDebug: React.FC = () => {
  const { darkMode } = useApp();
  const [htmlClasses, setHtmlClasses] = useState('');
  const [dataTheme, setDataTheme] = useState('');
  
  useEffect(() => {
    const updateInfo = () => {
      const htmlElement = document.querySelector('html');
      if (htmlElement) {
        setHtmlClasses(htmlElement.className);
        setDataTheme(htmlElement.getAttribute('data-theme') || 'none');
      }
    };
    
    updateInfo();
    const interval = setInterval(updateInfo, 100);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white p-3 rounded text-xs max-w-xs">
      <div><strong>Dark Mode State:</strong> {darkMode ? 'ON' : 'OFF'}</div>
      <div><strong>HTML Classes:</strong> "{htmlClasses}"</div>
      <div><strong>Data Theme:</strong> "{dataTheme}"</div>
      <div><strong>Browser Prefers:</strong> {window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}</div>
      
      {/* Test element to see if CSS is working */}
      <div className="mt-2 p-2 border">
        <div className="test-element bg-white text-black p-1 mb-1 text-xs">
          Light Test: This should be white bg, black text
        </div>
        <div className="test-element-dark bg-gray-800 text-white p-1 text-xs">
          Dark Test: This should be dark bg, white text  
        </div>
      </div>
    </div>
  );
};

export default DarkModeDebug;
