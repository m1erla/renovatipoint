// src/components/Shared/Footer.js

import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#2c3e50",
        padding: "1rem",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <p style={{ color: "#ecf0f1", margin: 0, textAlign: "center" }}>
        &copy; {new Date().getFullYear()} Expert Payment System. All rights
        reserved.
      </p>
    </footer>
  );
}

export default Footer;
