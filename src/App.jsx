import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Profil from "./pages/Profil";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Etablissment from "./pages/Etablissment";
import AddEtablissment from "./pages/AddEtablissment";
import DashboardGarant from "./pages/DashboardGarant";
import DashboardAdmin from "./pages/DashboardAdmin";
import AllEtablissment from "./pages/AllEtablissment";

function App() {
 
  return (
   <Router>
    <Navbar/>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword/>} />
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/allEtablissments" element={<AllEtablissment/>}/>
      <Route path="/dashboardGarant" element={<DashboardGarant/>}/>
      <Route path="/dashboardAdmin" element={<DashboardAdmin/>}/>
      <Route path="/addEtablissment" element={<AddEtablissment/>}/>
      <Route path="/etablissment/:id" element={<Etablissment/>}/>
      <Route path="/profil" element={<Profil/>}/>

    </Routes>
   </Router>
  )
}

export default App
