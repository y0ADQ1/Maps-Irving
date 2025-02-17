import React, { useState } from "react";

const PagoFormulario = () => {
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

interface FormEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setMensajeExito("Pago realizado con éxito");
    setMensajeError("");
};

  return (
    <div>
      <h2>Resumen de la Orden</h2>
      <p>Total: <span id="total-orden"></span></p>
      <p>Envío: <span id="envio-orden"></span></p>
      <p>Dirección de Entrega: <span id="direccion-entrega-orden"></span></p>
      <p>Dirección de Salida: <span id="direccion-salida-orden"></span></p>

      <h2>Pago con Tarjeta</h2>
      <form id="form-pago" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="card-number">Número de Tarjeta:</label>
          <div id="card-number" className="conekta-card-number"></div>
        </div>
        <div className="form-group">
          <label htmlFor="card-name">Nombre en la Tarjeta:</label>
          <div id="card-name" className="conekta-card-name"></div>
        </div>
        <div className="form-group">
          <label htmlFor="card-expiry">Fecha de Expiración (MM/AA):</label>
          <div id="card-expiry" className="conekta-card-expiry"></div>
        </div>
        <div className="form-group">
          <label htmlFor="card-cvc">CVC:</label>
          <div id="card-cvc" className="conekta-card-cvc"></div>
        </div>
        <button type="submit">Pagar</button>
        {mensajeError && <div style={{ color: "red" }}>{mensajeError}</div>}
        {mensajeExito && <div style={{ color: "green" }}>{mensajeExito}</div>}
      </form>
    </div>
  );
};

export default PagoFormulario;
