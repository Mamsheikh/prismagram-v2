import React, { useState } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";
import { useSession } from "next-auth/react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    console.log(isOpen);
    setIsOpen(true);
  }
  return (
    <div>
      <Header
        isOpen={isOpen}
        openModal={openModal}
        setIsOpen={setIsOpen}
        session={session}
      />
      {children}
      <MobileNav openModal={openModal} session={session} />
    </div>
  );
};
export default Layout;
