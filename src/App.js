import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import AddFlats from './Pages/AddFlats';
import Flats from './Pages/Flats';
import Profile from './Pages/Profile';

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Login/>}/>
      <Route path={"/dashboard"} element={<Home/>}/>
      <Route path={"/flats"} element={<Flats/>}/>
      <Route path={"/flats/new"} element={<AddFlats/>}/>
      <Route path={"/profile"} element={<Profile/>}/>
      <Route path={"/profile/edit"} element={<Profile/>}/>
    </Routes>
    );
}

export default App;
