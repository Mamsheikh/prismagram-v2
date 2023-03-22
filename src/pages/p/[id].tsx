import Image from "next/image";
import Link from "next/link";

import { FiMoreHorizontal } from "react-icons/fi";
import { FaComment } from "react-icons/fa";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlinePlusCircle,
} from "react-icons/ai";
// import { createInnerTRPCContext } from "../server/api/trpc";

import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { api } from "../../utils/api";
import CreatePostComment from "../../components/Home/Posts/CreatePostComment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { BsChat, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

const Post: React.FC = (props) => {
  const router = useRouter();
  const utils = api.useContext();
  const { data: post, isLoading } = api.post.post.useQuery(
    { postId: router.query.id as string },
    { refetchOnWindowFocus: false, enabled: !!router.isReady }
  );

  const { data, hasNextPage, fetchNextPage } =
    api.comment.comments.useInfiniteQuery(
      { limit: 5, postId: router.query.id as string },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!router.isReady,
      }
    );

  const { data: userPosts } = api.post.posts.useQuery(
    {
      limit: 6,
      where: { user: { id: post?.user.id } },
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // const client = useQueryClient();
  const likeMutation = api.post.like.useMutation({
    onSuccess: () => {
      utils.post.post.invalidate();
    },
  }).mutateAsync;
  const unlikeMutation = api.post.unlike.useMutation({
    onSuccess: () => {
      utils.post.post.invalidate();
    },
  }).mutateAsync;

  const { mutateAsync: favoriteMutation } = api.favorite.favorite.useMutation({
    onSuccess: (data, variables) => {
      utils.post.post.invalidate();
      // updateFavoriteCache({
      //   client,
      //   input,
      //   variables,
      //   data,
      //   action: "favorite",
      // });
    },
  });
  const { mutateAsync: unFavoriteMutation } =
    api.favorite.unfavorite.useMutation({
      onSuccess: (data, variables) => {
        utils.post.post.invalidate();
        // updateFavoriteCache({
        //   client,
        //   input,
        //   variables,
        //   data,
        //   action: "unfavorite",
        // });
      },
    });

  const hasFavored = post && post.favorites.length > 0;
  const handleFavorite = () => {
    if (!post) return;
    if (hasFavored) {
      unFavoriteMutation({ postId: post.id });
      toast.success("Removed from saved");
      return;
    }
    favoriteMutation({
      postId: post.id,
    });
    toast.success("Post added to saved");
  };

  const hasLiked = post && post.likes.length > 0;

  const handleLike = () => {
    if (!post) return;
    if (hasLiked) {
      unlikeMutation({ postId: post.id });
      return;
    }
    likeMutation({
      postId: post.id,
    });
  };

  if (!post || isLoading) {
    return <div>Loading....</div>;
  }
  const comments = data?.pages.flatMap((page) => page.comments) ?? [];
  const fileteredUserPosts = userPosts?.posts.filter(
    (userPost) => userPost.id !== post.id
  );
  return (
    <Layout>
      <div className=" mx-auto  overflow-y-auto p-10 pt-20 dark:text-white md:mx-5 md:max-w-4xl xl:mx-auto">
        <div className="relative mb-10 flex h-full flex-col bg-white dark:bg-gray-900">
          {/* header */}
          <header className="static top-0 right-0 flex h-14 items-center justify-between border-b border-gray-300 px-3 md:absolute md:w-80 md:border-l">
            <div className="flex items-center">
              <Link
                href={`/u/${post?.user?.id}`}
                className="relative flex items-center"
              >
                <Image
                  height={40}
                  width={40}
                  className="h-10 w-10 cursor-pointer rounded-full"
                  src={post.user.image as string}
                  alt={`${post.user.username} profile photo`}
                />
                <span className="ml-2 font-semibold">{post.user.username}</span>
              </Link>
            </div>

            <FiMoreHorizontal
              className="h-5 w-5 cursor-pointer"
              //   onClick={() => setOpen(!open)}
            />
          </header>
          {/* Media */}
          <div className="  h-full  max-w-xl  flex-1 bg-gray-800 md:mr-80">
            <Image
              height={1000}
              width={1000}
              className="mr-0 h-[406px]  object-cover "
              src={post.url}
              alt={post.caption as string}
            />
          </div>
          <div className="static bottom-0 right-0 top-16 flex flex-col justify-between md:absolute md:w-80 md:border-l md:border-gray-300">
            <div className="flex h-full flex-col justify-between">
              <div className="h-64 overflow-y-auto  px-3 scrollbar-none">
                {/* Post Caption */}
                <div className="flex  ">
                  <Link
                    href={`/u/${post.user.id}`}
                    className="relative mr-2 flex-shrink-0 font-semibold"
                  >
                    <Image
                      height={40}
                      width={40}
                      className="h-10 w-10 cursor-pointer rounded-full object-cover"
                      src={post.user.image as string}
                      alt={`${post.user.username} profile photo`}
                    />
                  </Link>
                  <div className="flex  flex-col ">
                    <div className="">
                      <Link
                        href={`/u/${post.user.id}`}
                        className="mr-1 inline-block py-1 font-semibold hover:underline"
                      >
                        {post.user.username}
                      </Link>
                      <span>{post.caption}</span>
                    </div>
                    <span className="mt-2 text-sm uppercase text-gray-400">
                      {/* {moment(post.createdAt).fromNow(true)} ago */}
                    </span>
                  </div>
                </div>

                {/* Comments */}
                <div className=" my-1">
                  {comments &&
                    comments.map((comment) => (
                      <div key={comment?.id} className=" mt-2 flex">
                        <Link
                          href={`/u/${comment.user.id}`}
                          className=" mr-2 flex-shrink-0 font-semibold "
                        >
                          <Image
                            height={100}
                            width={100}
                            className="h-10 w-10 cursor-pointer rounded-full"
                            src={comment.user.image as string}
                            alt={`${comment.user.username} profile photo`}
                          />
                        </Link>
                        <div className=" ">
                          {/* <div className="flex space-x-1"> */}
                          <Link
                            href={`/u/${comment.user.id}`}
                            className="flex font-semibold hover:underline"
                          >
                            {comment.user.username}
                          </Link>
                          <span>{comment.content}</span>
                          {/* </div> */}
                          {/* <span className='mt-2 text-sm text-gray-400'>
                          {moment(post.createdAt).fromNow(true)} ago
                        </span> */}
                        </div>
                      </div>
                    ))}
                  {hasNextPage && (
                    <div className="flex items-center justify-center">
                      {" "}
                      <AiOutlinePlusCircle
                        className="h-7 w-7 cursor-pointer"
                        onClick={() => fetchNextPage()}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col ">
                <div>
                  <div className="flex justify-between p-4">
                    <div className="flex space-x-4 ">
                      {/* Like And Comment Button */}
                      {hasLiked ? (
                        <AiFillHeart
                          onClick={handleLike}
                          className="postBtn text-red-500"
                        />
                      ) : (
                        <AiOutlineHeart
                          onClick={handleLike}
                          className="postBtn"
                        />
                      )}

                      <BsChat className="postBtn" />
                      <IoPaperPlaneOutline className="postBtn" />
                    </div>
                    {hasFavored ? (
                      <BsBookmarkFill
                        className="postBtn"
                        onClick={handleFavorite}
                      />
                    ) : (
                      <BsBookmark
                        className="postBtn"
                        onClick={handleFavorite}
                      />
                    )}
                  </div>
                  <div className="truncate px-4 dark:text-white">
                    <p className="mb-1 mr-2 text-sm font-semibold">
                      {post._count.likes} likes
                    </p>
                  </div>
                </div>
                {/* TimeStamp */}
                <Link
                  href={`/p/${post.id}`}
                  className="px-3 py-1 text-xs uppercase text-gray-500"
                >
                  {dayjs(post.createdAt).fromNow()} ago
                </Link>
                <CreatePostComment postId={post.id} />
              </div>
            </div>
          </div>
        </div>
        <section className="mt-10 border-t pt-10">
          <h3 className="mb-3 font-bold text-gray-500">
            More posts from
            <Link
              href={`/u/${post.user.id}`}
              className="ml-1 font-semibold text-black hover:underline"
            >
              {post.user.username}
            </Link>
          </h3>
          <div className="grid grid-cols-3 gap-5">
            {fileteredUserPosts &&
              fileteredUserPosts.map((post) => (
                <div key={post.id} className="h-64 overflow-hidden">
                  <div className="group relative cursor-pointer">
                    <div className="relative h-64">
                      <Image
                        fill
                        style={{ objectFit: "cover" }}
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
        </section>
      </div>
    </Layout>
  );
};
export default Post;
