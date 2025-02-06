import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/inicio';
import Login from './pages/login';
import Registro from './pages/registro';
import SeleccionarDireccion from './pages/seleccionar-direccion';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/seleccionar-direccion" element={<SeleccionarDireccion />} />
      </Routes>
    </Router>
  );
};

export default App;