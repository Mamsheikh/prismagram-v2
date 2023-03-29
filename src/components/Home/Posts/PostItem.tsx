import {
  type InfiniteData,
  type QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { Transition, Dialog } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsChat, BsBookmarkFill } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { type RouterInputs, api, type RouterOutputs } from "../../../utils/api";
import CreatePostComment from "./CreatePostComment";
import PostItemHeader from "./PostItemHeader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
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

type PostItemProps = {
  post: RouterOutputs["post"]["posts"]["posts"][number];
  input: RouterInputs["post"]["posts"];
};

interface UpdateCacheParams {
  client: QueryClient;
  input: RouterInputs["post"]["posts"];
  variables: {
    postId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike" | "favorite" | "unfavorite";
}

function updateCache(params: UpdateCacheParams) {
  const { action, client, data, variables, input } = params;

  client.setQueryData(
    [
      ["post", "posts"],
      {
        input: input,
        type: "infinite",
      },
    ],
    (prevData) => {
      const newData = prevData as InfiniteData<RouterOutputs["post"]["posts"]>;

      const value = action === "like" ? 1 : -1;
      const newPosts = newData.pages.map((page) => {
        return {
          posts: page.posts.map((post) => {
            if (post.id === variables.postId) {
              return {
                ...post,
                likes: action === "like" ? [data.userId] : [],
                _count: {
                  likes: post._count.likes + value,
                },
              };
            }
            return post;
          }),
          nextCursor: page.nextCursor,
        };
      });

      return {
        ...newData,
        pages: newPosts,
      };
    }
  );
}

function updateFavoriteCache(params: UpdateCacheParams) {
  const { action, client, data, variables, input } = params;

  client.setQueryData(
    [
      ["post", "posts"],
      {
        input: input,
        type: "infinite",
      },
    ],
    (prevData) => {
      const newData = prevData as InfiniteData<RouterOutputs["post"]["posts"]>;

      const newPosts = newData.pages.map((page) => {
        return {
          posts: page.posts.map((post) => {
            if (post.id === variables.postId) {
              return {
                ...post,
                favorites: action === "favorite" ? [data.userId] : [],
              };
            }
            return post;
          }),
          nextCursor: page.nextCursor,
        };
      });

      return {
        ...newData,
        pages: newPosts,
      };
    }
  );
}

const PostItem: React.FC<PostItemProps> = ({ post, input }) => {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const utils = api.useContext();

  function closeModalDelete() {
    setIsOpenDelete(false);
  }

  const { pathname } = useRouter();
  const client = useQueryClient();

  const { mutateAsync: favoriteMutation } = api.favorite.favorite.useMutation({
    onSuccess: (data, variables) => {
      updateFavoriteCache({
        client,
        input,
        variables,
        data,
        action: "favorite",
      });
    },
  });
  const { mutateAsync: unFavoriteMutation } =
    api.favorite.unfavorite.useMutation({
      onSuccess: (data, variables) => {
        updateFavoriteCache({
          client,
          input,
          variables,
          data,
          action: "unfavorite",
        });
      },
    });
  const likeMutation = api.post.like.useMutation({
    onSuccess: (data, variables) => {
      updateCache({
        client,
        input,
        variables,
        data,
        action: "like",
      });
    },
  }).mutateAsync;
  const unlikeMutation = api.post.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({
        client,
        input,
        variables,
        data,
        action: "unlike",
      });
    },
  }).mutateAsync;

  const hasLiked = post.likes.length > 0;

  const handleLike = () => {
    if (hasLiked) {
      unlikeMutation({ postId: post.id });
      return;
    }
    likeMutation({
      postId: post.id,
    });
  };

  const hasFavored = post.favorites.length > 0;
  const handleFavorite = () => {
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

  return (
    <div className="relative my-7 mx-auto max-w-[468px] rounded border bg-white dark:border dark:border-gray-400 dark:bg-gray-900">
      <PostItemHeader
        post={post}
        hasFavored={hasFavored}
        handleFavorite={handleFavorite}
        setIsOpenDelete={setIsOpenDelete}
      />
      <DeletePostConfirmationModal
        isOpen={isOpenDelete}
        closeModalDelete={closeModalDelete}
        postId={post.id}
      />

      <Link href={`/p/${post.id}`}>
        <div className="relative">
          <Image
            // fill
            style={{ objectFit: "contain" }}
            height={1000}
            width={1000}
            className=" w-full cursor-pointer object-cover"
            src={post.url}
            loading="lazy"
            // loader={}
            placeholder="blur"
            blurDataURL="/banner.webp"
            alt=""
          />
        </div>
      </Link>

      {pathname === "/" && (
        <div>
          <div className="flex justify-between p-4">
            <div className="flex space-x-4 ">
              {hasLiked ? (
                <AiFillHeart
                  onClick={handleLike}
                  className="postBtn text-red-500 dark:text-red-500"
                />
              ) : (
                <AiOutlineHeart onClick={handleLike} className="postBtn" />
              )}

              <BsChat className="postBtn" />
              <IoPaperPlaneOutline className="postBtn" />
            </div>
            {hasFavored ? (
              <BsBookmarkFill className="postBtn" onClick={handleFavorite} />
            ) : (
              <BsBookmark className="postBtn" onClick={handleFavorite} />
            )}
          </div>
          <div className="truncate px-4 dark:text-white">
            <p className="mb-1 mr-2 text-sm font-semibold">
              {post._count.likes} likes
            </p>
            <span className="mr-1 text-sm font-semibold">
              {/* {post?.user.username} */}
              {post.user.username}
            </span>{" "}
            {post.caption}
          </div>
          {post._count.comments > 1 && (
            <>
              <div className="mb-1 cursor-pointer px-4 text-sm text-gray-400 dark:text-white">
                <Link href={`/p/${post.id}`}>
                  View all {post._count.comments} comments
                </Link>
              </div>
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between px-4 dark:text-gray-300"
                >
                  <div>
                    <span className="mr-1 text-sm font-semibold">
                      {/* {comment?.user?.username} */}
                      {comment.user.username}
                    </span>
                    {/* {comment?.content}
                     */}
                    {comment.content}
                  </div>
                </div>
              ))}
            </>
          )}
          <div className="mb-4 mt-2 px-4 text-xs uppercase text-gray-400">
            {dayjs(post.createdAt).fromNow()} ago
          </div>
          <hr />
          <CreatePostComment postId={post.id} />
        </div>
      )}
    </div>
  );
};
export default PostItem;

export function DeletePostConfirmationModal({
  isOpen,
  closeModalDelete,
  postId,
}: {
  isOpen: boolean;
  closeModalDelete: () => void;
  postId: string;
}) {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const router = useRouter();
  const utils = api.useContext();
  const { mutateAsync: deletePost } = api.post.delete.useMutation({
    onSuccess: () => {
      utils.post.posts.invalidate();
      utils.post.post.invalidate();
    },
  });

  const handleDeletePost = async (postId: string) => {
    await deletePost({ postId });
    if (pathname === "/") {
      toast.success("Post deleted successfully");
      closeModalDelete();
      return;
    }
    router.push(`/u/${session?.user?.id}`);
    toast.success("Post deleted successfully");
    closeModalDelete();
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModalDelete}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="px-6 pt-6  text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete post?
                  </Dialog.Title>
                  <div className="mt-2 ">
                    <p className="text-center text-sm text-gray-500">
                      Are you sure you want to delete this post?
                    </p>
                  </div>

                  <div className="mt-4 flex w-full flex-col">
                    <button
                      type="button"
                      className="inline-flex justify-center border  px-4 py-2 text-sm  font-medium text-red-500 focus:outline-none focus:ring-0 "
                      onClick={() => handleDeletePost(postId)}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center   px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 "
                      onClick={closeModalDelete}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
