import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Profil from "./pages/Profil";

function App() {
 
  return (
   <Router>
    <Navbar/>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/profil" element={<Profil/>}/>

    </Routes>
   </Router>
  )
}

export default App
