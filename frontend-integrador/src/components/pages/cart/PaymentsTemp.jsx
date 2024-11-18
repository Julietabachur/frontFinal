import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentsTemps.css";

function PaymentsTemp() {
  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };
  return (
    <div className="page-payments-container">
      
      <div className="form-container">
      <h2 className="title-payments">Datos del pago</h2>
        <Cards
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />
        <form className="form-payments">
          <label htmlFor="serialCardNumber" className="label">
            <span className="title">Número de tarjeta</span>
            <input
              id="serialCardNumber"
              className="input-field"
              title="Input title"
              type="number"
              name="number"
              placeholder="0000 0000 0000 0000"
              value={state.number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </label>
          <label htmlFor="name" className="label">
            <span className="title">Nombre completo</span>
            <input
              className="input-field"
              title="Input title"
              type="text"
              name="name"
              placeholder="Nombre como figura en la tarjeta"
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </label>
          <div className="split">
            <label htmlFor="ExDate" className="label">
              <span className="title">Fecha expiración</span>
              <input
                id="ExDate"
                className="input-field"
                type="text"
                title="Expiry Date"
                name="expiry"
                placeholder="MM/YY"
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </label>
            <label htmlFor="cvv" className="label">
              <span className="title"> CVV</span>
              <input
                id="cvv"
                className="input-field"
                type="number"
                name="cvc"
                title="CVV"
                placeholder="CVV"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentsTemp;
