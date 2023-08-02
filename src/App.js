
import { Routes,Route } from 'react-router';

import Register from './components/Register';
import './App.css';

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Register/>}/>
      </Routes>
    </main>
  );
}

export default App;
