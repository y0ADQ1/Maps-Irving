import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/inicio';
import Login from './pages/login';
import Registro from './pages/registro';
import SeleccionarDireccion from './pages/seleccionar-direccion';
import ConfirmarPedido from './pages/ConfirmarPedido';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/seleccionar-direccion" element={<SeleccionarDireccion />} />
        <Route path="/confirmar-pedido" element={<ConfirmarPedido />} />
      </Routes>
    </Router>
  );
};

export default App;