import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { BiGridVertical } from "react-icons/bi";
import { MdOutlineContactMail } from "react-icons/md";

import toast from "react-hot-toast";

import Image from "next/image";
import Layout from "../../components/Layout";

import { IoSettingsOutline } from "react-icons/io5";
import Head from "next/head";
import { BsBookmark } from "react-icons/bs";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import FollowBtn from "../../components/common/FollowBtn";
import { useQueryClient } from "@tanstack/react-query";
import FollowersModal from "../../components/User/FollowersModal";
import FollowingModal from "../../components/User/FollowingModal";

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

  function closeModal() {
    setIsOpen(false);
  }
  function closeFollowingModal() {
    setIsOpenFollowing(false);
  }
  console.log({ user });

  if (!user || isLoading) {
    return <div>Loading user profile....</div>;
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
      <div className="mx-auto max-w-6xl justify-center overflow-y-auto p-10 pt-20 scrollbar scrollbar-thumb-black dark:text-white xl:mx-auto">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 flex justify-center">
            <Image
              height={36}
              width={36}
              className="h-36 w-36 rounded-full object-cover"
              src={user.image as string}
              alt=""
            />
          </div>
          <div className="col-span-3">
            <span className="mr-4 text-2xl text-gray-600 dark:text-white">
              {user.username}
            </span>
            {session?.user?.id === user.id ? (
              <>
                <div className="mr-4 inline cursor-pointer rounded border border-gray-300 p-1 px-2 text-sm text-gray-700 dark:text-white">
                  <button onClick={() => console.log("hello")}>
                    Edit Profile
                  </button>
                </div>
                {/* {isOpen && <EditProfileModal user={user} />} */}
                <IoSettingsOutline className="inline h-6 flex-1 cursor-pointer" />
              </>
            ) : (
              <FollowBtn isFollowing={isFollowing} userId={user.id} />
            )}
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
                  {/* {user.bio} */}
                  this is my bio
                </span>

                <a
                  target="_blank"
                  rel="noreferrer"
                  //   href={user.website}
                  className="mr-2 text-base font-medium text-blue-700"
                >
                  {/* {user.website} */}
                  mamsheikh.vercel.app
                </a>
              </div>
            </div>
          </div>
        </div>
        <FollowersModal
          isOpen={isOpen}
          closeModal={closeModal}
          userId={user.id}
        />
        {/* <FollowingModal
          isOpen={isOpenFollowing}
          closeModal={closeFollowingModal}
          userId={user.id}
        /> */}
        {/* {showFollowers && <Followers users={user.followers} />}
        {showFollowing && <Following users={user.following} />} */}
        <hr className="mt-6 border-gray-500" />

        <div className="flex justify-center gap-10">
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
        </div>
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
