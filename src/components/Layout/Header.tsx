import { type Session } from "next-auth";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  AiOutlineCompass,
  AiOutlineHome,
  AiOutlineMenu,
  AiOutlinePlusSquare,
  AiOutlineSearch,
} from "react-icons/ai";
import { BsFillSunFill, BsInstagram } from "react-icons/bs";
import { MdOutlineNightlight } from "react-icons/md";
import CreatePostModal from "../Home/Posts/CreatePostModal";
import Dropdown from "../common/ProfileDropdown";
import { useEffect, useState } from "react";
import SearchUsersModal from "../User/SearchUsersModal";
import { signOut } from "next-auth/react";
// import { Switch } from "@headlessui/react";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openModal: () => void;
  session: Session | null;
}

const Header: React.FC<HeaderProps> = ({
  isOpen,
  setIsOpen,
  openModal,
  session,
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  // const [enabled, setEnabled] = useState(false);
  // const currentTheme = theme === "system" ? systemTheme : theme;

  function openModalSearch() {
    setIsOpenSearch(true);
    setIsMenuOpen(false);
  }

  function closeModalSearch() {
    setIsOpenSearch(false);
  }

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white shadow-sm dark:bg-gray-900">
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
        {/* Search  */}
        <button
          onClick={openModalSearch}
          className="hidden w-full max-w-[10rem] items-center rounded-lg border  bg-gray-100 py-2 pl-2 text-sm md:flex "
        >
          <AiOutlineSearch className="mr-4 h-4 w-4 " />
          Search
        </button>
        <SearchUsersModal isOpen={isOpenSearch} closeModal={closeModalSearch} />
        <div className="flex items-center justify-end px-3 md:space-x-4">
          <Link href="/">
            <AiOutlineHome className="navBtn" />
          </Link>

          <AiOutlineMenu
            className="h-6 dark:text-white md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {mounted && (
            <div
              onClick={() =>
                theme == "dark" ? setTheme("light") : setTheme("dark")
              }
            >
              {theme === "light" ? (
                // <MoonIcon className='navBtn' />
                <span>
                  <MdOutlineNightlight className="navBtn" />
                </span>
              ) : (
                <span>
                  {/* <SunIcon /> */}
                  <BsFillSunFill className="navBtn" />
                </span>
              )}
            </div>
          )}
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
              <Link href="#">
                <AiOutlineCompass className="navBtn" />
              </Link>

              {session.user && (
                <Dropdown
                  id={session.user.id}
                  image={session.user.image as string}
                />
              )}
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
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        }  flex flex-col items-center justify-center space-y-3 border-t py-4 md:hidden lg:hidden`}
      >
        {/* <div className="py-4">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${enabled ? "bg-teal-900" : "bg-gray-100"}
          relative inline-flex h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`${enabled ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </div> */}
        <button
          className="w-full max-w-[15rem] rounded bg-blue-500 px-3 py-2 text-white"
          onClick={() =>
            theme == "dark" ? setTheme("light") : setTheme("dark")
          }
        >
          Toggle Darkmode
        </button>
        <button
          onClick={openModalSearch}
          className=" flex w-full max-w-[10rem] items-center rounded-lg border  bg-gray-100 py-2 pl-2 text-sm dark:bg-gray-800  "
        >
          <AiOutlineSearch className="mr-4 h-4 w-4 " />
          Search
        </button>
        <button
          className="w-full max-w-[15rem] rounded bg-blue-500 px-3 py-2 text-white"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </nav>
      <CreatePostModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        session={session}
      />
    </header>
  );
};

export default Header;
