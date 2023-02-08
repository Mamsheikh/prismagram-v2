import React, { useState } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    console.log(isOpen);
    setIsOpen(true);
  }
  return (
    <div>
      <Header isOpen={isOpen} openModal={openModal} setIsOpen={setIsOpen} />
      {children}
      <MobileNav openModal={openModal} />
    </div>
  );
};
export default Layout;
