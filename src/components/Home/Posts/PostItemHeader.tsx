/* eslint-disable react/jsx-no-undef */
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { type RouterOutputs } from "../../../utils/api";
import { FiMoreHorizontal } from "react-icons/fi";
import PostActionButtonsModal from "./PostActionButtonsModal";

interface PostItemHeaderProps {
  post: RouterOutputs["post"]["posts"]["posts"][number];
  hasFavored: boolean | undefined;
  handleFavorite: () => void;
  setIsOpenDelete: (isOpenDelete: boolean) => void;
}

const PostItemHeader: React.FC<PostItemHeaderProps> = ({
  post,
  hasFavored,
  handleFavorite,
  setIsOpenDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <div className=" flex items-center p-4">
        <div>
          <Link href={`/u/${post.user.id}`}>
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

        <p className="ml-4 flex-1 text-sm font-semibold dark:text-white">
          <Link href={`/u/${post.user.id}`}>{post.user.username}</Link>
        </p>
        {/* </a>
         */}
        <FiMoreHorizontal
          className="h-5 w-5 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>
      <PostActionButtonsModal
        isOpen={isOpen}
        closeModal={closeModal}
        post={post}
        hasFavored={hasFavored}
        handleFavorite={handleFavorite}
        setIsOpenDelete={setIsOpenDelete}
      />
    </div>
  );
};
export default PostItemHeader;
