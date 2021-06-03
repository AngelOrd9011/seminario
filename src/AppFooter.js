import React from "react";

const AppFooter = () => {
  return (
    <div className="layout-footer">
      <div className="footer-logo-container">
        <img
          id="footer-logo"
          src="./assets/images/icono-tesi.png"
          alt="diamond-layout"
        />
        <span className="app-name">TESI 2021</span>
      </div>
      <span className="copyright">
        &#169; Miguel Angel Ordóñez Pérez
      </span>
    </div>
  );
};

export default AppFooter;
