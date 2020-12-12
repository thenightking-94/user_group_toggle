import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';


function App() {
  const [force, setforceRender] = useState(0);
  useEffect(() => {
    window.addEventListener('resize', forceRender);

    return () => {
      window.removeEventListener('resize', forceRender);
    }

  }, [])

  const forceRender = () => {
    setforceRender(force => force + 1);
  }

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default App;
