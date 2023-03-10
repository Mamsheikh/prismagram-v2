/* eslint-disable react/jsx-no-undef */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { FiMoreHorizontal } from "react-icons/fi";
import { CgDisplayFullwidth } from "react-icons/cg";

import toast from "react-hot-toast";

import Image from "next/image";
import Layout from "../../components/Layout";

import { IoSettingsOutline } from "react-icons/io5";
import Head from "next/head";
import { BsBookmark } from "react-icons/bs";
import { IoMdGrid } from "react-icons/io";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import FollowBtn from "../../components/common/FollowBtn";
import { useQueryClient } from "@tanstack/react-query";
import FollowersModal from "../../components/User/FollowersModal";
import FollowingModal from "../../components/User/FollowingModal";
import { Tab } from "@headlessui/react";
import PostItem from "../../components/Home/Posts/PostItem";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";

const LIMIT = 10;

const Profile: React.FC = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFollowing, setIsOpenFollowing] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { data: user, isLoading } = api.user.user.useQuery(
    {
      userId: router.query.id as string,
    },
    {
      enabled: !!router.isReady,
      retry: (failureCount, error) => {
        return failureCount < 3 && error.data?.httpStatus != 404;
      },
      refetchOnWindowFocus: false,
    }
  );

  const {
    data,
    fetchNextPage,
    isLoading: postsIsLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = api.post.posts.useInfiniteQuery(
    { limit: LIMIT, where: { user: { id: router.query.id as string } } },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      enabled: !!router.isReady,
    }
  );

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  function closeModal() {
    setIsOpen(false);
  }
  function closeFollowingModal() {
    setIsOpenFollowing(false);
  }

  if (!user || isLoading) {
    return <div>Loading user profile....</div>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }
  const isFollowing = user?.isFollowing;
  return (
    <Layout>
      <Head>
        <title>
          {user.name} (@{user.username}) - Prismagram
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="justify-center overflow-y-auto  pt-20 scrollbar scrollbar-thumb-black dark:text-white xl:mx-auto">
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
                      "flex w-full items-center justify-center  py-2.5 text-sm font-medium leading-5 text-gray-700",
                      " focus:outline-none ",
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
    </Layout>
  );
};

export default Profile;
