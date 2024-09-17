import React from "react";
import Navbar from "./navbar";
import Notify from "./alert";
import { Poppins } from "next/font/google";

const poppinsFont = Poppins({ weight: ["100", "200", "300", "400", "500", "600", "700"], subsets: ["latin"] })
const Layout = ({ children }) => {
  return (
    <div className={poppinsFont.className}>
      <Navbar />
      <main>{children}</main>
      <Notify />
    </div>
  );
};

export default Layout;
