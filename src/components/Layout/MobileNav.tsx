import Link from "next/link";
import {
  AiOutlineCompass,
  AiOutlineHome,
  AiOutlinePlusSquare,
} from "react-icons/ai";

interface MobileNavProps {
  openModal: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ openModal }) => {
  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full border-t border-gray-200 bg-white p-4 shadow dark:border-gray-600 dark:bg-gray-800 md:hidden  md:items-center md:justify-between md:p-6">
      <ul className="mt-3 flex  justify-between  text-gray-900 dark:text-white ">
        <li>
          <Link href="#" className="">
            <AiOutlineHome className="mobileNavBtn" />
          </Link>
        </li>
        <li>
          <Link href="#" className="">
            <AiOutlineCompass className="mobileNavBtn" />
          </Link>
        </li>
        <li onClick={openModal}>
          <Link href="#" className="">
            <AiOutlinePlusSquare className="mobileNavBtn" />
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:underline">
            <AiOutlinePlusSquare className="mobileNavBtn" />
          </Link>
        </li>
        <li>
          <Link href="#" className="hover:underline">
            <AiOutlinePlusSquare className="mobileNavBtn" />
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default MobileNav;
