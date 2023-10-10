import React from "react";
import Navbar from "./navbar";
import { Inter } from "next/font/google";
import Notify from "./alert";

const inter = Inter({ subsets: ["latin"] });
const Layout = ({ children }) => {
  return (
    <div className={inter.className}>
      <Navbar />
      <Notify />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
