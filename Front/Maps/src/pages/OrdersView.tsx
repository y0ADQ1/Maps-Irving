import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

const OrdersView = () => {
  const [orders, setOrders] = useState<Array<{ id: string; clientId: string; deliveryAddressId: string; totalPrice: number; status: string }>>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8082/api/auth/getPendingOrders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        navigate('/login');
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  return (
    <StyledContainer>
      <h1>Órdenes Pendientes</h1>
      <Form.Group controlId="statusFilter">
        <Form.Label>Filtrar por estado:</Form.Label>
        <Form.Control as="select" value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="pending">Pendiente</option>
          <option value="in progress">En progreso</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </Form.Control>
      </Form.Group>
      <ListGroup>
        {orders.map((order) => (
          <Card key={order.id} className="mb-3">
            <Card.Body>
              <Card.Title>Orden #{order.id}</Card.Title>
              <Card.Text>
                <strong>Cliente:</strong> {order.clientId}<br />
                <strong>Dirección de entrega:</strong> {order.deliveryAddressId}<br />
                <strong>Total:</strong> ${order.totalPrice}<br />
                <strong>Estado:</strong> {order.status}
              </Card.Text>
              <Button variant="primary" onClick={() => navigate(`/order/${order.id}`)}>
                Ver detalles
              </Button>
            </Card.Body>
          </Card>
        ))}
      </ListGroup>
    </StyledContainer>
  );
};


const StyledContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

export default OrdersView;