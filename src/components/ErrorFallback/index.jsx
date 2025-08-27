import React from "react";

import "./index.css";

const ErrorFallback = ({ error }) => {
  return (
    <div className="errorFallback">
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  );
};

export default ErrorFallback;
