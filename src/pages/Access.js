import React from "react";
import { Link } from "react-router-dom";

export const Access = () => {
  return (
    <div className="exception-body access">
      <img
        src="assets/layout/images/logo-white.svg"
        alt="diamond-layout"
        className="logo"
      />

      <div className="exception-content">
        <div className="exception-title">ACCESO DENEGADO</div>
        <div className="exception-detail">
          No cuentas con los permisos necesarios.
        </div>
        <Link to="/">Ir a Inicio</Link>
      </div>
    </div>
  );
};
