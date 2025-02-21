import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, ListGroup} from 'react-bootstrap';
import styled from 'styled-components';

interface CartItem {
  productId: number;
  product_name: string;
  price: number;
  quantity: number;
}

interface Address {
  id: number;
  peopleId: number;
  address: string;
  latitude: number;
  longitude: number;
}

const Contenedor = styled.div`
  padding-top: 80px; 
  width: 100vw; 
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
`;

const ConfirmarPedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const { selectedAddress } = location.state as { selectedAddress: Address };

  useEffect(() => {
    fetchCart();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const fetchCart = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:8082/api/auth/getCart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const token = getToken();
      const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderData = {
        clientId: selectedAddress.peopleId, 
        deliveryAddressId: selectedAddress.id,
        totalPrice,
        status: 'pending',
        cartItems: cart
      };

      const response = await fetch('http://127.0.0.1:8082/api/auth/confirmOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Pedido confirmado');
        navigate('/Card');
      } else {
        alert('Error al confirmar el pedido');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Error al confirmar el pedido');
    }
  };

  return (
    <Contenedor>
      <Contenido>
        <h2>Confirmar Pedido</h2>
        <h3>Dirección de Entrega</h3>
        <Card>
          <Card.Body>
            <Card.Text>{selectedAddress.address}</Card.Text>
          </Card.Body>
        </Card>

        <h3>Productos en el Carrito</h3>
        <ListGroup>
          {cart.map(item => (
            <ListGroup.Item key={item.productId}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    {item.product_name} - ${item.price} x {item.quantity}
                  </Card.Text>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Button variant="primary" onClick={handleConfirmOrder}>
          Confirmar Pedido
        </Button>
      </Contenido>
    </Contenedor>
  );
};

export default ConfirmarPedido;