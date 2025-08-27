import React from "react";
import Loader from "../loader";

const CircularLoader = () => {
  return (
    <div className="flex center h-10 px-4 py-2 justify-center">
      <Loader />
      loading...
    </div>
  );
};

export default CircularLoader;
