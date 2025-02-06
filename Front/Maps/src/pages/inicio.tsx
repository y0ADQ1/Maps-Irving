import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Row, Col, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Product {
  product_name: string;
  description: string;
  price: number;
  id: number;
}

interface CartItem {
  productId: number;
  product_name: string;
  price: number;
  quantity: number;
}

const Navbar = styled.nav`
  width: 100vw; 
  height: 80px;
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  background-color: #333; 
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
`;

const CartButton = styled(Button)`
  position: fixed;
  top: 20px;
  right: 220px;
  z-index: 1001;
`;

const Inicio = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
    fetchCart();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const fetchMenu = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8082/api/auth/ver_menu');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:8082/api/auth/getCart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    const productPrice = product.price;

    const productData = {
      productId: product.id,
      quantity: 1,
      price: productPrice,
    };

    console.log('Producto a agregar:', productData);

    try {
      const token = getToken();
      const response = await fetch('http://127.0.0.1:8082/api/auth/addToCart', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        fetchCart();
      } else {
        const data = await response.json();
        console.error('Error al agregar al carrito:', data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  

  const handleRemoveFromCart = async (productId: number) => {
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:8082/api/auth/removeFromCart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = getToken();
      await fetch('http://127.0.0.1:8082/api/auth/clearCart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  return (
    <>
      <Navbar>
        <Titulo>VAPOSTACHO</Titulo>
        <div>
          <Boton onClick={() => navigate('/login')}>Login</Boton>
          <Boton onClick={() => navigate('/registro')}>Registro</Boton>
          <Button variant="success" onClick={() => navigate('/seleccionar-direccion')}>Proceder con el pedido</Button>
        </div>
      </Navbar>
      <CartButton variant="primary" onClick={handleShowCart}>
        <FontAwesomeIcon icon={faShoppingCart} /> {cart.length}
      </CartButton>
      <Contenedor>
        <Contenido>
          <Row>
            {products.map((product) => (
              <Col key={product.id} md={4} className="mb-4">
                <Card style={{ width: '18rem' }}>
                  <Card.Body>
                    <Card.Title>{product.product_name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <Card.Text>${product.price}</Card.Text>
                    <Button variant="primary" onClick={() => handleAddToCart(product)}>Añadir al Carro</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Contenido>
      </Contenedor>

      <Modal show={showCart} onHide={handleCloseCart}>
        <Modal.Header closeButton>
          <Modal.Title>Carrito de Compras</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            <ul>
              {cart.map(item => (
                <li key={item.productId}>
                  {item.product_name} - ${item.price} x {item.quantity}
                  <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(item.productId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCart}>Cerrar</Button>
          <Button variant="danger" onClick={handleClearCart}>Vaciar Carrito</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Inicio;
