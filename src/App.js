
import { Routes,Route } from 'react-router';

import {Register, Signin, AfterSignin} from "./pages";
import './App.css';

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/home" element={<AfterSignin/>}/>
        
      </Routes>
    </main>
  );
}

export default App;
