import React, { useState } from "react";

const PagoFormulario = () => {
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  interface FormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    // Aquí puedes agregar la lógica para procesar el pago
    setMensajeExito("Pago realizado con éxito");
    setMensajeError("");
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCardCvc(value);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setCardExpiry(value);
  };

  return (
    <div>
      <h2>Resumen de la Orden</h2>
      <p>Total a Pagar: <span id="total-orden"></span></p>

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
