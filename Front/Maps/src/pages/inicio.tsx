import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface Card {
  product_name: string;
  description: string;
price: number;
}

const GlobalStyles = styled.div`
  body, html {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
`;

// Barra de navegación
const Navbar = styled.nav`
  width: 100vw; 
  height: 80px;
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  background-color: #333; 
  padding: 0; 
  box-sizing: border-box; 
  position: fixed; 
  top: 0; 
  left: 0; 
  z-index: 1000; 
`;

const Titulo = styled.h1`
  color: white; 
  margin: 0; 
  flex-grow: 1; 
  text-align: center; 
`;

const Boton = styled.button`
  background-color: #555; 
  color: white; 
  border: none; 
  padding: 10px 20px; 
  margin: 0 10px; 
  cursor: pointer; 
  &:hover {
    background-color: #777; 
  }
`;

const Contenedor = styled.div`
  padding-top: 80px; 
  box-sizing: border-box; 
  width: 98.7vw; 
  min-height: 100vh; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  background-color: rgb(19, 18, 18);
`;

const Contenido = styled.div`
  width: 90%; 
  max-width: 1200px; 
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  margin-top: 20px;

`;

const Inicio = () => {
  const [cards, setCards] = useState<Card[]>([]);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8082/api/auth/ver_menu');
        const data = await response.json();
        setCards(data); 
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchMenu();
  }, []);

  const handleLogin = () => {
    navigate('/login');
  }

  const handleRegistro = () => {
    navigate('/registro');
  }

  return (
    <>
      <GlobalStyles /> 
      <Navbar>
        <Titulo>VAPOSTACHO</Titulo>
        <div>
        <Boton onClick={handleLogin}>Login</Boton>
        <Boton onClick={handleRegistro}>Registro</Boton>
        </div>
      </Navbar>
      <Contenedor>
        <Contenido>
          <Row>
            {cards.map((card) => (
              <Col key={card.product_name} md={4} className="mb-4">
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>{card.product_name}</Card.Title>
                    <Card.Text>{card.description}</Card.Text>
                    <Card.Text>${card.price}</Card.Text>
                    <Button variant="primary">Añadir al Carro</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Contenido>
      </Contenedor>
    </>
  );
};

export default Inicio;