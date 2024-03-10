import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Login/>}/>
      <Route path={"/dashboard"} element={<Home/>}/>
    </Routes>
    );
}

export default App;
