import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import MudarSenha from './pages/Login/LoginMudarSenha';
import MedicoDashboard from './pages/Medico/MedicoDashboard';
import MedicoEmitirAtestado from './pages/MedicoAtestado/MedicoEmitirAtestado'
import MedicoEmitirAtestadoVer from './pages/MedicoAtestado/MedicoEmitirAtestadoVer';
import GestorDashboard from './pages/Gestor/GestorDashboard';
import GestorPaciente from './pages/GestorPaciente/GestorPaciente';
import GestorVerAtestado from './pages/Gestor/GestorVerAtestado.jsx';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import GestorMedico from './pages/GestorMedico/GestorMedico';
import AuthService from "./services/AuthService";


export default function App() {
  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <Router>
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route index path='/login' element={<Login />} />
        <Route index path='/mudarSenha' element={<MudarSenha />} />
        <Route index path='/medico/dashboard' element= {<MedicoDashboard />} />
        <Route index path='/medico/emitiratestado' element={<MedicoEmitirAtestado />} />
        <Route index path='/medico/emitiratestado/ver/:id' element={ <MedicoEmitirAtestadoVer/>} />
        <Route index path='/gestor/dashboard' element={<GestorDashboard/>} />
        <Route index path='/gestor/dashboard/atestado/ver/:id' element={<GestorVerAtestado/>} />
        <Route index path='/gestor/paciente' element={<GestorPaciente/>} />
        <Route index path='/gestor/medico' element={<GestorMedico/>} />
      </Routes>
    </Router>
  );
}