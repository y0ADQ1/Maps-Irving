import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface PagoFormularioProps {
  cartItems: any[];
  total: number;
  clientId: string;
  deliveryAddressId: string;
  email: string;
  name: string;
  phone: string;
}

const PagoFormulario: React.FC<PagoFormularioProps> = ({ cartItems, total, clientId, deliveryAddressId, email, name, phone }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  useEffect(() => {
    if (window.Conekta) {
      window.Conekta.setPublicKey(import.meta.env.CONEKTA_PUBLIC_KEY_TEST || '');
    } else {
      console.error("Conekta no se ha cargado correctamente.");
    }
  }, []);

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 4) {
      setCardExpiry(value);
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 4) {
      setCardCvc(value);
    }
  };

  const generarToken = async (cardData: any) => {
    return new Promise((resolve, reject) => {
      window.Conekta.Token.create({ card: cardData }, (tokenResponse: any) => {
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

    const cardData = {
      number: cardNumber,
      name: cardName,
      exp_year: `20${cardExpiry.slice(2, 4)}`,
      exp_month: cardExpiry.slice(0, 2),
      cvc: cardCvc,
    };

    try {
      const token_id = await generarToken(cardData);

      const response = await axios.post('/confirmOrder', {
        clientId,
        deliveryAddressId,
        totalPrice: total,
        status: 'pending',
        cartItems,
        email,
        name,
        phone,
        token_id,
      });

      if (response.status === 201) {
        setMensajeExito('Pago realizado con éxito.');
        setMensajeError('');
      } else {
        setMensajeError('Error al confirmar el pedido.');
      }
    } catch (error: any) {
      console.error('Error al generar el token de tarjeta:', error);
      setMensajeError(`Error al generar el token de tarjeta: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Resumen de la Orden</h2>
      <p>Total a Pagar: <span id="total-orden">${total}</span></p>

      <h2>Pago con Tarjeta</h2>
      <form id="form-pago" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="card-number">Número de Tarjeta:</label>
          <input
            type="text"
            id="card-number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-name">Nombre en la Tarjeta:</label>
          <input
            type="text"
            id="card-name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-expiry">Fecha de Expiración (MM/AA):</label>
          <input
            type="text"
            id="card-expiry"
            value={cardExpiry}
            onChange={handleCardExpiryChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-cvc">CVC:</label>
          <input
            type="text"
            id="card-cvc"
            value={cardCvc}
            onChange={handleCardCvcChange}
          />
        </div>
        <button type="submit">Pagar</button>
        {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
        {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
      </form>
    </div>
  );
};

export default PagoFormulario;
