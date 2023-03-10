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
      <MobileProfile
        data={data}
        user={user}
        LIMIT={LIMIT}
        session={session}
        isOpen={isOpen}
        closeModal={closeModal}
        closeFollowingModal={closeFollowingModal}
        isOpenFollowing={isOpenFollowing}
      />
    </Layout>
  );
};

export default Profile;
