import Link from "next/link";
import {
  AiOutlineCompass,
  AiOutlineHome,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { type Session } from "next-auth";
import Image from "next/image";

interface MobileNavProps {
  openModal: () => void;
  session: Session | null;
}

const MobileNav: React.FC<MobileNavProps> = ({ openModal, session }) => {
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
            <IoPaperPlaneOutline className="mobileNavBtn" />
          </Link>
        </li>
        <li>
          {session?.user && (
            <Link href={`/u/${session.user.id}`}>
              <Image
                src={session.user.image as string}
                height={20}
                width={20}
                className="mobileNavBtn rounded-full border-2 border-gray-900"
                alt="profile pic"
              />
            </Link>
          )}
        </li>
      </ul>
    </footer>
  );
};

export default MobileNav;
