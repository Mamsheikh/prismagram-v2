import { useRouter } from "next/router";
import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { api } from "../../../utils/api";

const AddComment = ({ postId }: { postId: string }) => {
  const [content, setContent] = useState("");
  const router = useRouter();
  const { mutateAsync: createComment } =
    api.comment.createComment.useMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComment({ content, postId });
      setContent("");
    } catch (error) {}
  };
  return (
    <>
      <form onSubmit={onSubmit} className=" flex items-center p-4">
        <BsEmojiSmile
          //   onClick={() => {}}
          className="mr-2 h-7 cursor-pointer dark:text-white"
        />
        {/* </div>  */}
        <input
          type="text"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder="Add a comment..."
          className="flex-1 border-none outline-none focus:ring-0 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="font-semibold text-blue-400"
          onClick={onSubmit}
        >
          {/* {loading ? 'Loading...' : 'Post'} */}
          Post
        </button>
      </form>
    </>
  );
};

export default AddComment;
