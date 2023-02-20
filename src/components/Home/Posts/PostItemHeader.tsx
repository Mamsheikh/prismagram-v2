/* eslint-disable react/jsx-no-undef */
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { type RouterOutputs } from "../../../utils/api";

interface PostItemHeaderProps {
  post: RouterOutputs["post"]["posts"]["posts"][number];
}

const PostItemHeader: React.FC<PostItemHeaderProps> = ({ post }) => {
  return (
    <div className="relative">
      <div className=" flex items-center p-4">
        <div>
          <Link href={`/u/`}>
            <div className="relative">
              <Image
                src={post.user.image as string}
                height={40}
                width={40}
                alt="post image"
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
          </Link>
        </div>
        {/* <
            <a> */}
        <p className="ml-4 flex-1 text-sm font-semibold dark:text-white">
          <Link href={`/u/`}>{post.user.username}</Link>
        </p>
        {/* </a>
         */}
        {/* <DotsHorizontalIcon
          className='h-5 w-5 cursor-pointer'
          onClick={() => setOpen(!open)}
        /> */}
        {/* {open && (
          <PostActionsModal
            userId={userId}
            setEditPost={setEditPost}
            editPost={editPost}
            open={open}
            post={post}
            setOpen={setOpen}
          />
        )}
        {editPost && (
          <EditPostModal
            editPost={editPost}
            post={post}
            setEditPost={setEditPost}
          />
        )} */}
      </div>
    </div>
  );
};
export default PostItemHeader;
