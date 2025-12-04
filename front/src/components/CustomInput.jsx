import React from 'react';
import '../styles/components/CustomInput.css'; // <--- CORREÇÃO: Importação direta (sem 'styles from')

const CustomInput = ({ label, value, onChange, type = "text", placeholder }) => {
  return (
    <div className="custom-input-container">
      <label className="custom-input-label">
        {label}
      </label>
      <input
        className="custom-input-field"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default CustomInput;