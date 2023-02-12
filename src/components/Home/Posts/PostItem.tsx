import Image from "next/image";
import Link from "next/link";
import React from "react";
import PostItemHeader from "./PostItemHeader";
import { BsChatDots, BsBookmarkFill } from "react-icons/bs";
import { FaPaperPlane } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { type RouterOutputs } from "../../../utils/api";
import CreatePostComment from "./CreatePostComment";

type PostItemProps = {
  post: RouterOutputs["user"]["posts"]["withUrls"][number];
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <div className="relative my-7 mx-auto max-w-[468px] rounded bg-white dark:border dark:border-gray-400 dark:bg-black">
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
            alt=""
          />
        </div>
      </Link>

      <div className="flex justify-between p-4">
        <div className="flex space-x-4 ">
          {/* <LikeBtn
                loading={loading}
                isLike={isLike}
                handleLike={handleLike}
                handleUnLike={handleUnLike}
              /> */}
          <FiHeart className="postBtn" />
          <BsChatDots className="postBtn" />
          <FaPaperPlane className="postBtn" />
        </div>
        <BsBookmarkFill className="postBtn" />
      </div>
      <div className="truncate px-4 dark:text-white">
        <p className="mb-1 mr-2 text-sm font-semibold">
          {/* {post.likes.length} likes */}
        </p>
        <span className="mr-1 text-sm font-semibold">
          {/* {post?.user.username} */}
          mamsheikh_01
        </span>{" "}
        {post.caption}
      </div>
      <div className="mb-1 cursor-pointer px-4 text-sm text-gray-400 dark:text-white">
        <Link href={`/p/${post.id}`}>View all 4 comments</Link>
      </div>
      {/* {post.comments.slice(0, 2).map((comment) => ( */}
      <div
        //   key={comment.id}
        className="flex justify-between px-4 dark:text-gray-300"
      >
        <div>
          <span className="mr-1 text-sm font-semibold">
            {/* {comment?.user?.username} */}
            mr_zero
          </span>
          {/* {comment?.content}
           */}
          noice
        </div>
      </div>
      {/* ))} */}
      <div className="flex justify-between px-4">
        <div>
          <span className="mr-1 text-sm font-semibold">Elon</span>Cool 🌚
        </div>
      </div>
      <div className="mb-4 mt-2 px-4 text-xs uppercase text-gray-400">
        {/* {moment(post.createdAt).fromNow(true)} ago */}
        32m ago
      </div>
      <hr />
      <CreatePostComment />
    </div>
  );
};
export default PostItem;
