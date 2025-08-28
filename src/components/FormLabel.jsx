import React from "react";

const FormLabel = ({ children }) => {
  return (
    <label className="block pb-1 pt-3 text-textPrimaryColor font-normal text-base leading-6 tracking-normal">
      {children}
    </label>
  );
};

export default FormLabel;
