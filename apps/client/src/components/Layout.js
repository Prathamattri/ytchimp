import React from "react";
import Navbar from "./navbar";
import { Inter } from "next/font/google";
import Alert from "./alert";

const inter = Inter({ subsets: ["latin"] });
const Layout = ({ children }) => {
  return (
    <div className={inter.className}>
      <Navbar />
      <Alert />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
