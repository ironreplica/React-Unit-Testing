import React from "react";

const Input = (props) => {
  const { id, label, onChange, error, type } = props;
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={error ? "form-control is-invalid" : "form-control"}
        onChange={onChange}
      />
      <span className={error ? "invalid-feedback" : ""}>{error}</span>
    </div>
  );
};

export default Input;
