import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ViewCardProps {
  cartItems: any[];
  total: number;
}

const ViewCard = (props: ViewCardProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [conektaCargado, setConektaCargado] = useState(false);
  const [userData, setUserData] = useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.conekta.io/v1.0/conekta.js';
    script.async = true;
    document.body.appendChild(script);
    setConektaCargado(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8084/api/auth/getCart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
          .then((response) => {
            setUserData(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
    } else {
      navigate('/login');
    }
  }, []);

  const generarToken = async (cardData: any) => {
    return new Promise((resolve, reject) => {
      if (!window.Conekta) {
        console.error('❌ Conekta no está disponible en window.');
        reject(new Error("Conekta no está disponible."));
        return;
      }

      window.Conekta.Token.create({ card: cardData }, (tokenResponse: any) => {
        console.log('🔄 Respuesta de Conekta:', tokenResponse);
        if (tokenResponse.object === 'error') {
          reject(new Error(tokenResponse.message_to_purchaser));
        } else {
          resolve(tokenResponse.id);
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      setMensajeError('Por favor, completa todos los campos.');
      return;
    }

    try {
      console.log("Datos de la tarjeta antes de enviar a Conekta:", {
        number: cardNumber,
        name: cardName,
        exp_year: `20${cardExpiry.slice(2, 4)}`,
        exp_month: cardExpiry.slice(0, 2),
        cvc: cardCvc,
      });

      const token_id = await generarToken({
        number: cardNumber,
        name: cardName,
        exp_year: `20${cardExpiry.slice(2, 4)}`,
        exp_month: cardExpiry.slice(0, 2),
        cvc: cardCvc,
      });

      // Verificar que userData tenga los campos necesarios
      if (!userData.id || !userData.deliveryAddressId || !userData.email || !userData.name || !userData.phone) {
        setMensajeError('Faltan datos del usuario. Por favor, inicia sesión nuevamente.');
        return;
      }

      // Verificar que props.cartItems esté definido y sea un array
      if (!Array.isArray(props.cartItems) || props.cartItems.length === 0) {
        setMensajeError('El carrito está vacío.');
        return;
      }

      // Mostrar los datos que se enviarán al backend
      console.log("Datos del usuario:", {
        clientId: userData.id,
        deliveryAddressId: userData.deliveryAddressId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
      });

      console.log("Datos del carrito:", props.cartItems);

      console.log("Total del pedido:", props.total);

      const data = {
        clientId: userData.id,
        deliveryAddressId: userData.deliveryAddressId,
        totalPrice: props.total,
        status: 'pending',
        cartItems: props.cartItems,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        token_id,
      };

      console.log("Datos que se enviarán al backend:", data);

      const response = await axios.post('http://localhost:8084/api/orders/confirmOrder', data);

      if (response.status === 201) {
        setMensajeExito('Pago realizado con éxito.');
        setMensajeError('');
      } else {
        setMensajeError('Error al confirmar el pedido.');
      }
    } catch (error: any) {
      setMensajeError(`Error al generar el token de tarjeta: ${error.message}`);
      console.error('Error al enviar la petición:', error);
    }
  };



  return (
      <div>
        <h2>Confirmar Pedido</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Número de tarjeta:</label>
            <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
          </div>
          <div>
            <label>Nombre en la tarjeta:</label>
            <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} />
          </div>
          <div>
            <label>Fecha de expiración (MM/AA):</label>
            <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
          </div>
          <div>
            <label>CVC:</label>
            <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} />
          </div>
          <button type="submit">Pagar</button>
          {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
          {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
        </form>
      </div>
  );
};

export default ViewCard;
