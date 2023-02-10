// import {
//     HomeIcon,
//     MenuIcon,
//     MoonIcon,
//     SunIcon,
//   } from '@heroicons/react/outline';
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  AiOutlineCompass,
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { BsFillSunFill, BsInstagram } from "react-icons/bs";
import CreatePostModal from "../Home/Posts/CreatePostModal";
import { type Session } from "next-auth";
//   import { useRecoilState } from 'recoil';
//   import { postState } from '../../atoms/addPostState';
//   import { userState } from '../../atoms/userState';
//   import { useMeQuery } from '../../generated/graphql';
//   import AddPostModal from '../AddPostModal';
//   import Dropdown from '../Dropdown';
//   import Search from '../Search';

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openModal: () => void;
  session: Session | null;
}

const Header: React.FC<HeaderProps> = ({ isOpen, setIsOpen, openModal, session }) => {
  

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white shadow-sm dark:bg-black">
      <div className="mx-auto flex max-w-4xl justify-between p-2  text-black xl:mx-auto">
        <div className="relative hidden h-10 w-24 lg:inline-grid">
          <h2
            className="cursor-pointer text-gray-800 dark:text-white"
            style={{ fontFamily: "Grand Hotel", fontSize: "2rem" }}
          >
            <Link href="/">Prismagram</Link>
          </h2>
        </div>
        <div className="relative mr-3 h-10 w-10 flex-shrink-0 lg:hidden">
          <Link href="/">
            <BsInstagram
              className="cursor-pointer  dark:text-white"
              size={32}
            />
          </Link>
        </div>
        {/* Search Input TODO: */}
        {/* <Search /> */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/">
            <AiOutlineHome className="navBtn" />
          </Link>

          <AiOutlineMenu className="h-6 md:hidden" />
          <div onClick={() => console.log("hello")}>
            {/* {theme === 'light' ? (
                // <MoonIcon className='navBtn' />
                <span>
                  <MdNightlight className='navBtn' />
                </span>
              ) : ( */}
            <span>
              {/* <SunIcon /> */}
              <BsFillSunFill className="navBtn" />
            </span>
            {/* )} */}
          </div>
          {session ? (
            <>
              {/* <div className='navBtn relative'>
                  <Link href='/message'>
                    <a>
                      <RiMessengerLine className='navBtn' />
                      <span className='absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs leading-none text-white'>
                        3
                      </span>
                    </a>
                  </Link>
                </div> */}

              <AiOutlinePlusSquare onClick={openModal} className="navBtn" />
              <Link href="/explore">
                <AiOutlineCompass className="navBtn" />
              </Link>

              {/* <Dropdown id={data?.me?.id} image={data?.me?.image} /> */}
            </>
          ) : (
            <Link
              href="/login"
              className="rounded bg-blue-500 px-4 py-1 text-sm text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      <CreatePostModal isOpen={isOpen} setIsOpen={setIsOpen} session={session} />
    </header>
  );
};

export default Header;
