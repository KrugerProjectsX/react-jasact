
import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddFlat from "./pages/AddFlat";
import Flats from "./pages/Flats";
import Profile from "./pages/Profile";
import ProfileUpdate from "./pages/ProfileUpdate";
import Register from "./pages/Register";
import MyFlats from "./pages/MyFlats";
import Users from "./pages/Users";
import FlatsFavorites from "./pages/FlatsFavorites";
import Flat from "./pages/Flat";
import FlatEdit from "./pages/FlatEdit";

function App() {
  return (
      
      <Routes>
          <Route path={"/"} element={<Login/>}  />
          <Route path={"/dashboard"} element={<Home/>}  />
          <Route path={"/flats"} element={<Flats/>}  />
          <Route path={"/flats/new"} element={<AddFlat/>}  />
          <Route path={"/profile"} element={<Profile/>}/>
          <Route path={"/profile/:userId"} element={<Profile/>}/>
          <Route path={"/profile/edit"} element={<ProfileUpdate/>}/>
          <Route path={"/profile/edit/:userId"} element={<ProfileUpdate/>}/>
          <Route path={"/register"} element={<Register/>}/>
          <Route path={"/my-flats"} element={<MyFlats/>}/>
          <Route path={"/users"} element={<Users/>}/>
          <Route path={"/my-favorites-flats"} element={<FlatsFavorites/>}/>
          <Route path={"/flat/:id"} element={<Flat/>} />
          <Route path={"/flat/edit/:id"} element={<FlatEdit/>} />
          
      </Routes>
  );
}

export default App;