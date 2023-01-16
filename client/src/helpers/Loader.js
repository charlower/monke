import React from "react";

const Loader = () => {
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-view-dark">
      <div className="spinner-border text-success-pink" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
