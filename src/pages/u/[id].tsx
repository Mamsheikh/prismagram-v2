/* eslint-disable react/jsx-no-undef */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CgDisplayFullwidth } from "react-icons/cg";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { FaComment } from "react-icons/fa";
import { IoMdGrid } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { RingLoader } from "react-spinners";
import PostItem from "../../components/Home/Posts/PostItem";
import Layout from "../../components/Layout";
import EditProfileModal from "../../components/User/EditProfileModal";
import FollowersModal from "../../components/User/FollowersModal";
import FollowingModal from "../../components/User/FollowingModal";
import FollowBtn from "../../components/common/FollowBtn";
import { api } from "../../utils/api";

const LIMIT = 10;

const Profile: React.FC = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
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

  const {
    data: favoriteData,
    fetchNextPage: favoriteFetchNextPage,
    isLoading: favoriteIsLoading,
    isFetching: favoriteIsFetching,
    // isFetchingNextPage,
    // hasNextPage,
  } = api.favorite.favorites.useInfiniteQuery(
    { limit: LIMIT },
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
  function closeEditProfileModal() {
    setEditProfile(false);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function classNames(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const favorites = favoriteData?.pages.flatMap((page) => page.favorites) ?? [];

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      if (isLoading || isFetching || favoriteIsLoading || favoriteIsFetching)
        return;
      // setPage(prevPage => prevPage + 1);
      console.log("bottom page");
      fetchNextPage();
      favoriteFetchNextPage();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center ">
          <RingLoader />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <div>Something went wrong😢</div>;
  }
  return (
    <Layout>
      <Head>
        <title>
          {user.name} (@{user.username}) - Prismagram
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100  pt-20 dark:bg-gray-900">
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
                      onClick={() => setEditProfile(true)}
                      className="mt-2  rounded-md bg-gray-300 px-3 py-1 font-semibold dark:bg-gray-600 md:max-w-xs"
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

              <EditProfileModal
                isOpen={editProfile}
                closeModal={closeEditProfileModal}
                user={user}
              />

              {/* <!-- user meta form medium screens --> */}
              <div className="hidden md:block">
                <h1 className="font-semibold">{user.name}</h1>
                <div className="flex flex-col">
                  <span>{user.bio}</span>
                  <span>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={user.website as string}
                      className="mr-2 text-base font-medium text-blue-700"
                    >
                      {user.website}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* <!-- user meta form small screens --> */}
            <div className="my-2 text-sm md:hidden">
              <h1 className="font-semibold">{user.name}</h1>
              <div className="flex flex-col">
                <span>{user.bio}</span>
                <span>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={user.website as string}
                    className="mr-2 text-base font-medium text-blue-700"
                  >
                    {user.website}
                  </a>
                </span>
              </div>
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
                        : "text-gray-500 hover:bg-gray-300 dark:hover:bg-white/[0.12] dark:hover:text-white"
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
                        : "text-gray-500 hover:bg-gray-300 dark:hover:bg-white/[0.12] dark:hover:text-white"
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
                          : "text-gray-500 hover:bg-gray-300 dark:hover:bg-white/[0.12] dark:hover:text-white"
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
                    {posts.length === 0 && (
                      <div className="mx-auto flex w-full max-w-md items-center justify-center p-10 text-center">
                        <span className="text-center">No posts</span>
                      </div>
                    )}
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
                  {posts.length === 0 && (
                    <div className="mx-auto flex w-full max-w-md items-center justify-center p-10 text-center">
                      <span className="text-center">No posts</span>
                    </div>
                  )}
                </Tab.Panel>
                {session?.user?.id === user.id && (
                  <Tab.Panel>
                    <div className="-mx-px flex flex-wrap md:-mx-3">
                      {/* <!-- column --> */}
                      {favorites &&
                        favorites.map((favorite) => (
                          <div key={favorite.id} className="w-1/3 p-px md:px-3">
                            {/* <!-- post 1--> */}
                            <Link href={`/p/${favorite.post.id}`}>
                              <article className="post  pb-full relative bg-gray-100 text-white md:mb-6">
                                {/* <!-- post image--> */}
                                <Image
                                  width={2000}
                                  height={2000}
                                  className="absolute left-0 top-0 h-full w-full object-cover"
                                  src={favorite.url}
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
                                      {favorite.post._count.likes}
                                    </span>

                                    <span className="p-2">
                                      <FaComment className="text-white" />
                                      {favorite.post._count.comments}
                                    </span>
                                  </div>
                                </div>
                              </article>
                            </Link>
                          </div>
                        ))}
                      {posts.length === 0 && (
                        <div className="mx-auto flex w-full max-w-md items-center justify-center p-10 text-center">
                          <span className="text-center">No posts</span>
                        </div>
                      )}
                    </div>
                    {favorites.length === 0 && (
                      <div className="mx-auto flex w-full max-w-md items-center justify-center p-10 text-center">
                        <span className="text-center">No favorites</span>
                      </div>
                    )}
                  </Tab.Panel>
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
