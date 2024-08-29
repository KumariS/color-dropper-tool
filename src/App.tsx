import React from 'react';
import Canvas from './components/Canvas';

/**Set up React Router for navigating between the tabs and the country details page.**/
const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Color Dropper Tool</h1>
      <Canvas />
    </div>
  );
};

export default App;

