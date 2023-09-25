import React from "react";
import Navbar from "./navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const Layout = ({ children }) => {
  return (
    <div className={inter.className}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
