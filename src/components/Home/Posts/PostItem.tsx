import {
  type InfiniteData,
  type QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsBookmark, BsChat } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { type RouterInputs, api, type RouterOutputs } from "../../../utils/api";
import CreatePostComment from "./CreatePostComment";
import PostItemHeader from "./PostItemHeader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";

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
  action: "like" | "unlike";
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

const PostItem: React.FC<PostItemProps> = ({ post, input }) => {
  const { pathname } = useRouter();
  const client = useQueryClient();
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

  return (
    <div className="relative my-7 mx-auto max-w-[468px] rounded border bg-white dark:border dark:border-gray-400 dark:bg-gray-900">
      {/* {editPostModal && <EditPostModal user={data?.Me} />} */}
      <PostItemHeader post={post} />

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
                  className="postBtn text-red-500"
                />
              ) : (
                <AiOutlineHeart onClick={handleLike} className="postBtn" />
              )}

              <BsChat className="postBtn" />
              <IoPaperPlaneOutline className="postBtn" />
            </div>
            <BsBookmark className="postBtn" />
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
