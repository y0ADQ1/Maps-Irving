import React, { useState } from 'react';
import axios from 'axios';

const PagoFormulario = ({ cartItems, total, clientId, deliveryAddressId, email, name, phone }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleCardExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 4) {
      setCardExpiry(value);
    }
  };

  const handleCardCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 4) {
      setCardCvc(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar los datos de la tarjeta
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      setMensajeError('Por favor, completa todos los campos.');
      return;
    }

    // Generar el token de tarjeta con Conekta
    Conekta.setPublicKey('tu_llave_publica_de_conekta'); // Reemplaza con tu llave pública

    const cardData = {
      number: cardNumber,
      name: cardName,
      exp_year: cardExpiry.slice(2, 4),
      exp_month: cardExpiry.slice(0, 2),
      cvc: cardCvc,
    };

    Conekta.Token.create({ card: cardData }, async (tokenResponse) => {
      if (tokenResponse.error) {
        setMensajeError('Error al generar el token de tarjeta: ' + tokenResponse.error.message);
        return;
      }

      const token_id = tokenResponse.id;

      try {
        // Llamar a tu API confirmOrder
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
      } catch (error) {
        console.error('Error al confirmar el pedido:', error);
        setMensajeError('Error al confirmar el pedido: ' + error.message);
      }
    });
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