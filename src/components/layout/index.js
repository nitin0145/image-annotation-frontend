import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Comman/Header";
const LayOut = () => {
  return (
    <>
      <div className="My_app">
        <div className="Main_wrapper">
          <Header />
          <main className="Outlet_wrapper">
            <Outlet />
          </main>
          {/* <Footer  /> */}
        </div>
      </div>
    </>
  );
};
export default LayOut;
