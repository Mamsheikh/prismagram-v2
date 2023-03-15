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
import MobileProfile from "../../components/profile/MobileProfile";
import DesktopProfile from "../../components/profile";
import { MdVerified } from "react-icons/md";

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

  function closeModal() {
    setIsOpen(false);
  }
  function closeFollowingModal() {
    setIsOpenFollowing(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      if (isLoading || isFetching) return;
      // setPage(prevPage => prevPage + 1);
      console.log("bottom page");
      fetchNextPage();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching]);

  if (!user || isLoading) {
    return <div>Loading user profile....</div>;
  }
  return (
    <Layout>
      <Head>
        <title>
          {user.name} (@{user.username}) - Prismagram
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 bg-opacity-25 pt-20">
        <div className="mb-8 lg:mx-auto lg:w-8/12">
          <header className="flex flex-wrap items-center p-4 md:py-8">
            <div className="relative md:ml-16 md:w-3/12">
              {/* <!-- profile image --> */}
              <Image
                height={100}
                width={100}
                className="h-20 w-20 rounded-full border-2 border-pink-600 object-cover
                     p-1 md:h-40 md:w-40"
                src={user.image as string}
                alt="profile"
              />
            </div>

            {/* <!-- profile meta --> */}
            <div className="ml-4 w-8/12 md:w-7/12">
              <div className="mb-4 md:flex md:flex-wrap md:items-center">
                <h2 className="mb-2 inline-block text-3xl font-light sm:mb-0 md:mr-2">
                  {user.username}
                </h2>

                {/* <!-- badge --> */}
                <span
                  className=" relative mr-6 inline-block -translate-y-2 transform text-xl text-blue-500"
                  aria-hidden="true"
                >
                  <MdVerified />
                </span>

                {session?.user?.id === user.id ? (
                  <>
                    <span className=" text-2xl text-gray-600 dark:text-white">
                      <IoSettingsOutline className="inline h-6 flex-1 cursor-pointer md:mr-4" />
                    </span>
                    <button
                      onClick={() => console.log("hello")}
                      className="mt-2  rounded-md bg-gray-300 px-3 py-1 font-semibold md:max-w-xs"
                    >
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <FollowBtn userId={user.id} isFollowing={user.isFollowing} />
                )}
              </div>

              {/* <!-- post, following, followers list for medium screens --> */}
              <ul className="mb-4 hidden space-x-8 md:flex">
                <li>
                  <span className="font-semibold">{user._count.posts}</span>{" "}
                  posts
                </li>

                <li onClick={() => setIsOpen(!isOpen)}>
                  <span className="font-semibold">{user._count.followers}</span>{" "}
                  followers
                </li>
                <li onClick={() => setIsOpenFollowing(!isOpenFollowing)}>
                  <span className="font-semibold">{user._count.following}</span>{" "}
                  following
                </li>
              </ul>
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

              {/* <!-- user meta form medium screens --> */}
              <div className="hidden md:block">
                <h1 className="font-semibold">{user.username}</h1>
                <span>Travel, Nature and Music</span>
                <p>Lorem ipsum dolor sit amet consectetur</p>
              </div>
            </div>

            {/* <!-- user meta form small screens --> */}
            <div className="my-2 text-sm md:hidden">
              <h1 className="font-semibold">{user.username}</h1>
              <span>Travel, Nature and Music</span>
              <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>
          </header>

          {/* <!-- posts --> */}
          <div className="border-b border-gray-300 px-px md:px-3">
            {/* <!-- user following for mobile only --> */}
            <ul
              className="flex justify-around space-x-8 border-t p-2 
                text-center text-sm leading-snug text-gray-600 md:hidden"
            >
              <li>
                <span className="block font-semibold text-gray-800">
                  {user._count.posts}
                </span>
                posts
              </li>

              <li onClick={() => setIsOpen(!isOpen)}>
                <span className="block font-semibold text-gray-800">
                  {user._count.followers}
                </span>
                followers
              </li>
              <li onClick={() => setIsOpenFollowing(!isOpenFollowing)}>
                <span className="block font-semibold text-gray-800">
                  {user._count.following}
                </span>
                following
              </li>
            </ul>

            <Tab.Group>
              <Tab.List className="mx-auto flex items-center justify-center space-x-1 border-b border-gray-300  pb-1">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "flex w-full items-center justify-center  py-2.5 text-sm font-medium leading-5 text-gray-700 focus:outline-none",
                      selected
                        ? "border-3 border-gray-500 text-blue-500"
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
                  <div className="-mx-px flex flex-wrap md:-mx-3">
                    {/* <!-- column --> */}
                    {posts &&
                      posts.map((post) => (
                        <div key={post.id} className="w-1/3 p-px md:px-3">
                          {/* <!-- post 1--> */}
                          <Link href={`/p/${post.id}`}>
                            <article className="post  pb-full relative bg-gray-100 text-white md:mb-6">
                              {/* <!-- post image--> */}
                              <Image
                                width={2000}
                                height={2000}
                                className="absolute left-0 top-0 h-full w-full object-cover"
                                src={post.url}
                                alt="image"
                              />

                              <i className="fas fa-square absolute right-0 top-0 m-1"></i>
                              {/* <!-- overlay--> */}
                              <div
                                className="overlay absolute left-0 top-0 hidden h-full 
                                w-full bg-gray-800 bg-opacity-25"
                              >
                                <div
                                  className="flex h-full items-center 
                                    justify-center space-x-4"
                                >
                                  <span className="p-2">
                                    <AiFillHeart className="text-white" />
                                    {post._count.likes}
                                  </span>

                                  <span className="p-2">
                                    <FaComment className="text-white" />
                                    {post._count.comments}
                                  </span>
                                </div>
                              </div>
                            </article>
                          </Link>
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
        </div>
      </main>
    </Layout>
  );
};

export default Profile;
