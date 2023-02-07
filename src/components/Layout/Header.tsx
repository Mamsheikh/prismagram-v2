// import {
//     HomeIcon,
//     MenuIcon,
//     MoonIcon,
//     SunIcon,
//   } from '@heroicons/react/outline';
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  AiOutlineCompass,
  AiOutlinePlusSquare,
  AiOutlineHome,
  AiOutlineMenu,
} from "react-icons/ai";
import { BsInstagram, BsFillSunFill } from "react-icons/bs";
import { MdNightlight } from "react-icons/md";
import CreatePostModal from "../Home/Posts/CreatePostModal";
//   import { useRecoilState } from 'recoil';
//   import { postState } from '../../atoms/addPostState';
//   import { userState } from '../../atoms/userState';
//   import { useMeQuery } from '../../generated/graphql';
//   import AddPostModal from '../AddPostModal';
//   import Dropdown from '../Dropdown';
//   import Search from '../Search';

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const { theme, setTheme } = useTheme();
  // const [addPost, setAddPost] = useRecoilState(postState);
  // const router = useRouter();
  // const { data } = useMeQuery({
  //   errorPolicy: 'ignore',
  // });

  // const [viewer, setViewer] = useRecoilState(userState);

  // useEffect(() => {
  //   if (data) {
  //     setViewer(data.me);
  //   }
  // }, [data]);

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

              <AiOutlinePlusSquare
                onClick={() => setIsOpen(true)}
                className="navBtn"
              />
              <Link href="/explore">
                <AiOutlineCompass className="navBtn" />
              </Link>

              {/* <Dropdown id={data?.me?.id} image={data?.me?.image} /> */}
              {/* {addPost && <AddPostModal user={data?.me} />} */}
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
      {isOpen && <CreatePostModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </header>
  );
};

export default Header;
