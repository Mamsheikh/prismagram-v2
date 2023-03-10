import { Tab } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { CgDisplayFullwidth } from "react-icons/cg";
import { FaComment } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoMdGrid } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import PostItem from "../Home/Posts/PostItem";
import FollowersModal from "../User/FollowersModal";
import FollowingModal from "../User/FollowingModal";
import FollowBtn from "../common/FollowBtn";
import { type RouterOutputs } from "../../utils/api";
import { type Session } from "next-auth";
import { type InfiniteData } from "@tanstack/react-query";

type MobileProfileProps = {
  user: RouterOutputs["user"]["user"];
  data: InfiniteData<RouterOutputs["post"]["posts"]> | undefined;
  session: Session | null;
  isOpen: boolean;
  closeModal: () => void;
  isOpenFollowing: boolean;
  closeFollowingModal: () => void;
  LIMIT: number;
};

const MobileProfile: React.FC<MobileProfileProps> = ({
  user,
  data,
  session,
  isOpen,
  closeModal,
  isOpenFollowing,
  closeFollowingModal,
  LIMIT,
}) => {
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const isFollowing = user?.isFollowing;
  function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="justify-center overflow-y-auto pt-20  scrollbar scrollbar-thumb-black dark:text-white md:hidden xl:mx-auto">
      <div className="">
        <div className="flex space-x-6 px-7">
          <Image
            height={36}
            width={36}
            className="h-[77px] w-[77px] flex-shrink-0 rounded-full object-cover"
            src={user.image as string}
            alt=""
          />
          <div className="flex flex-1 flex-col">
            {session?.user?.id === user.id ? (
              <>
                <span className=" text-2xl text-gray-600 dark:text-white">
                  {user.username}
                  <IoSettingsOutline className="ml-4 inline h-6 flex-1 cursor-pointer" />
                </span>
                <button
                  onClick={() => console.log("hello")}
                  className="sm:max-sm: mt-2 w-full rounded-md bg-gray-300 px-3 py-1 font-semibold"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <span className=" text-2xl text-gray-600 dark:text-white">
                  {user.username}
                  <FiMoreHorizontal className="ml-4 inline h-6 flex-1 cursor-pointer" />
                </span>
                <FollowBtn isFollowing={isFollowing} userId={user.id} />
              </>
            )}
          </div>
        </div>
        <div className="mt-4 mb-3 border-b border-gray-300 px-7 pb-6">
          <span className="font-semibold">{user.name}</span>
        </div>
        <div className="flex items-center justify-between space-x-3 border-b border-gray-300 px-9 pb-4">
          <div className="flex flex-col items-center justify-center">
            <span className="font-semibold">{user._count.posts}</span>
            <span className="text-sm text-gray-400">posts</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-semibold">{user._count.followers}</span>
            <span className="text-sm text-gray-400">followers</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-semibold">{user._count.following}</span>
            <span className="text-sm text-gray-400">following</span>
          </div>
        </div>
        <div className="w-full">
          <Tab.Group>
            <Tab.List className="flex space-x-1 border-b border-gray-300 pb-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    "flex w-full items-center justify-center  py-2.5 text-sm font-medium leading-5 text-gray-700 focus:outline-none",
                    selected
                      ? "text-blue-500"
                      : "text-gray-500 hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                <IoMdGrid className="h-6 w-6" />
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    "flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
                    " focus:outline-none ",
                    selected
                      ? "text-blue-500"
                      : "text-gray-500 hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                <CgDisplayFullwidth className="h-6 w-6" />
              </Tab>
              {session?.user?.id === user.id && (
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "flex w-full items-center justify-center  py-2.5 text-sm font-medium leading-5 text-gray-700",
                      " focus:outline-none ",
                      selected
                        ? "text-blue-500"
                        : "text-gray-500 hover:bg-white/[0.12] hover:text-white"
                    )
                  }
                >
                  <BsBookmark className="h-6 w-6" />
                </Tab>
              )}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <div className="grid grid-cols-3 gap-1">
                  {posts &&
                    posts.map((post) => (
                      <div key={post.id} className="h-64 overflow-hidden">
                        <div className="group relative cursor-pointer">
                          <div className="relative">
                            <Image
                              height={200}
                              width={200}
                              // style={{ objectFit: "cover" }}
                              src={post.url}
                              alt={post.caption as string}
                              className="h-64 w-full object-cover"
                            />
                          </div>
                          <Link href={`/p/${post.id}`}>
                            <div className="absolute top-0 left-1/2 flex h-full w-full -translate-x-1/2 items-center justify-center bg-black-rgba text-white opacity-0 group-hover:opacity-100">
                              <div className="mr-2 flex items-center space-x-1">
                                <AiFillHeart className="text-white" />
                                <span>{post._count.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FaComment className="text-white" />
                                <span>{post._count.comments}</span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </Tab.Panel>
              <Tab.Panel>
                {posts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    input={{
                      limit: LIMIT,
                    }}
                  />
                ))}
              </Tab.Panel>
              {session?.user?.id === user.id && (
                <Tab.Panel>Content 3</Tab.Panel>
              )}
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* <div className="">
            <div className="mt-4 flex">
              <div>
                <span className="font-semibold">{user._count.posts}</span> posts
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={() => setIsOpen(true)}
              >
                <span className="ml-4 font-semibold">
                  {user._count.followers}
                </span>{" "}
                followers
              </div>
              <div
                className="cursor-pointer hover:underline"
                onClick={() => setIsOpenFollowing(true)}
              >
                <span className="ml-4 font-semibold">
                  {user._count.following}
                </span>{" "}
                following
              </div>
            </div>
            <div>
              <div className="flex flex-col  pt-3">
                <span className="text-lg font-bold text-gray-700 dark:text-gray-400">
                  {/* {user.bio} 
                  this is my bio
                </span>

                <a
                  target="_blank"
                  rel="noreferrer"
                  //   href={user.website}
                  className="mr-2 text-base font-medium text-blue-700"
                >
                  {/* {user.website} 
                  mamsheikh.vercel.app
                </a>
              </div>
            </div>
          </div> */}
      </div>
      <FollowersModal
        isOpen={isOpen}
        closeModal={closeModal}
        userId={user.id}
      />
      <FollowingModal
        isOpen={isOpenFollowing}
        closeModal={closeFollowingModal}
        userId={user.id}
      />
      {/* {showFollowers && <Followers users={user.followers} />}
        {showFollowing && <Following users={user.following} />} */}
      {/* <hr className="mt-6 border-gray-500" /> */}

      {/* <div className="flex justify-center gap-10">
          <button className="flex gap-1 border-gray-800 py-4 text-sm font-semibold uppercase text-gray-400 focus:border-t focus:text-gray-600">
            <BiGridVertical className="h-5 w-5 items-center" /> POSTS
          </button>
          <button className="flex gap-1 border-gray-800 py-4 text-sm font-semibold uppercase text-gray-400 focus:border-t focus:text-gray-600">
            <AiOutlinePlayCircle className="h-5 w-5 items-center" /> Videos
          </button>
          <button className="flex gap-1 border-gray-800 py-4 text-sm font-semibold uppercase text-gray-400 focus:border-t focus:text-gray-600">
            <BsBookmark className="h-5 w-5 items-center" /> Saved
          </button>
          <button className="flex gap-1 border-gray-800 py-4 text-sm font-semibold uppercase text-gray-400 focus:border-t focus:text-gray-600">
            <MdOutlineContactMail className="h-5 w-5 items-center" /> Tagged
          </button>
        </div> */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* {posts.map((post) => (
            <div key={post.id} className='group relative cursor-pointer'>
              
              <PostCard post={post} />
           
            </div>
          ))} */}
      </div>
    </div>
  );
};
export default MobileProfile;
