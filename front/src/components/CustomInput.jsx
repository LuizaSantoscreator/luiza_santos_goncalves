import React from 'react';
import styles from '../styles/components/CustomInput.module.css'; // Importação do CSS Modular

const CustomInput = ({ label, value, onChange, type = "text", placeholder }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label}
      </label>
      <input
        className={styles.input}
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