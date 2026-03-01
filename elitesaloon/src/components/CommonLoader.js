import React from "react";
import "./loader.css";

const CommonLoader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
      <p>Please wait...</p>
    </div>
  );
};

export default CommonLoader;