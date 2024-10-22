import { useState } from "react";

export default function App() {
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiryMonth: "",
    cardExpiryYear: "",
    cardCvc: "",
  });

  const [error, setError] = useState({});

  const validateInput = (name, value) => {
    return name === "cardName"
      ? value
        ? null
        : "Please enter a card name"
      : name === "cardNumber"
      ? value
        ? /^[\d\s]+$/.test(value)
          ? null
          : "Wrong format, numbers only"
        : "Please enter a card number"
      : name === "cardExpiryMonth"
      ? value
        ? parseInt(value) > 12 || parseInt(value) < 1 || !/^\d+$/.test(value)
          ? "Invalid Month or Year"
          : null
        : "Can't be blank"
      : name === "cardExpiryYear"
      ? value
        ? parseInt(value) <
            parseInt(new Date().getFullYear().toString().slice(-2)) ||
          !/^\d+$/.test(value)
          ? "Invalid Month or Year"
          : null
        : "Can't be blank"
      : name === "cardCvc"
      ? value
        ? /^\d+$/.test(value)
          ? null
          : "Wrong format, numbers only"
        : "Can't be blank"
      : null;
  };

  const handleError = () => {
    const errors = Object.keys(formData).reduce((acc, key) => {
      const errorMessage = validateInput(key, formData[key]);
      if (errorMessage) acc[key] = errorMessage;
      return acc;
    }, {});

    const hasErrors = Object.values(errors).some((error) => error !== null);

    if (hasErrors) {
      setError(errors);
    } else {
      setCompleted(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue =
      name === "cardNumber"
        ? value.replace(/\s+/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")
        : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: validateInput(name, value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleError();
  };

  return (
    <div className="container">
      <nav className="card-container">
        <div className="front-card">
          <div className="card-details">
            <img src="./images/card-logo.svg" alt="card-logo" />
            <div className="card-info">
              <h1 className="card-num ">
                {formData.cardNumber || "0000 0000 0000 0000"}
              </h1>
              <div className="owner">
                <h2 className="card-name">
                  {formData.cardName || "Oluwagbenga Adedire"}
                </h2>
                <div className="card-date">
                  <span>{formData.cardExpiryMonth || "00"}</span> /
                  <span>{formData.cardExpiryYear || "00"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="back-card">
          <p className="card-cvc">{formData.cardCvc || "123"}</p>
        </div>
      </nav>

      <main>
        {completed ? (
          <ThankYou />
        ) : (
          <Form
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formData={formData}
            error={error}
          />
        )}
      </main>
    </div>
  );
}

function Form({ formData, handleChange, handleSubmit, error }) {
  return (
    <form className="form" onSubmit={handleSubmit}>
      <section className="form-section">
        <label htmlFor="card-name">Cardholder Name</label>
        <input
          type="text"
          id="name"
          name="cardName"
          className={error.cardName ? "error" : ""}
          value={formData.cardName}
          onChange={handleChange}
          placeholder="e.g Adedire Oluwagbenga"
        />
        {error.cardName && <p className="error-message">{error.cardName}</p>}
      </section>
      <section className="form-section">
        <label htmlFor="card-number">Card Number</label>
        <input
          type="tel"
          id="card-number"
          name="cardNumber"
          value={formData.cardNumber}
          className={error.cardNumber ? "error" : ""}
          onChange={handleChange}
          placeholder="e.g 1234 5678 1234 5678"
          maxLength={19}
        />
        {error.cardNumber && (
          <p className="error-message">{error.cardNumber}</p>
        )}
      </section>
      <section className="form-section card-exp">
        <div className="exp-month">
          <label htmlFor="card-expiry">EXP. DATE (MM/YY)</label>
          <span>
            <input
              type="text"
              id="card-expiry-month"
              name="cardExpiryMonth"
              value={formData.cardExpiryMonth}
              onChange={handleChange}
              className={error.cardExpiryMonth ? "error" : ""}
              placeholder="MM"
              maxLength={2}
            />
            <input
              type="text"
              id="card-expiry-year"
              name="cardExpiryYear"
              className={error.cardExpiryYear ? "error" : ""}
              value={formData.cardExpiryYear}
              onChange={handleChange}
              placeholder="YY"
              maxLength={2}
            />
            {error.cardExpiryYear ? (
              <p className="error-message">{error.cardExpiryYear}</p>
            ) : error.cardExpiryMonth ? (
              <p className="error-message">{error.cardExpiryMonth}</p>
            ) : null}
          </span>
        </div>

        <div className="cvc">
          <label htmlFor="card-cvc">CVC</label>
          <input
            type="tel"
            id="card-cvc"
            name="cardCvc"
            className={error.cardCvc ? "card_cvc error" : "card_cvc"}
            value={formData.cardCvc}
            onChange={handleChange}
            placeholder="e.g 123"
            maxLength={3}
          />
          {error.cardCvc && <p className="error-message">{error.cardCvc}</p>}
        </div>
      </section>
      <button type="submit">Confirm</button>
    </form>
  );
}

function ThankYou() {
  return (
    <div className="thank-you">
      <img src="/images/icon-complete.svg" alt="checkmark" />
      <h3>Thank you!</h3>
      <p>We've added your card details.</p>
      <button type="submit" onClick={() => window.location.reload()}>
        Continue
      </button>
    </div>
  );
}
