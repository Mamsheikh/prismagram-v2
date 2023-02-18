import Image from "next/image";
import Link from "next/link";

import { FiMoreHorizontal } from "react-icons/fi";
import { FaComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
// import { createInnerTRPCContext } from "../server/api/trpc";

import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { api } from "../../utils/api";

const Post: React.FC = () => {
  const router = useRouter();

  let postId = "";

  if (router.query.id) {
    postId = router.query.id as string;
  }

  const { data: post, isFetching } = api.post.post.useQuery(
    { postId },
    { refetchOnWindowFocus: false }
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

  if (!post || isFetching) {
    return <div>Loading....</div>;
  }

  return (
    <Layout>
      <div className=" mx-auto  overflow-y-auto p-10 pt-20 dark:text-white md:mx-5 md:max-w-4xl xl:mx-auto">
        <div className="relative mb-10 flex h-full flex-col bg-white dark:bg-gray-900">
          {/* header */}
          <header className="static top-0 right-0 flex h-20 items-center justify-between border-b border-gray-300 px-3 md:absolute md:w-80 md:border-l">
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
              className="mr-0   object-cover "
              src={post.url}
              alt={post.caption as string}
            />
          </div>
          <div className="static bottom-0 right-0 top-20 flex flex-col justify-between md:absolute md:w-80 md:border-l md:border-gray-300">
            <div className="flex h-full flex-col justify-between">
              <div className="md:min-h-48 overflow-y-auto px-3">
                {/* Post Caption */}
                <div className="mb-3 flex border-b py-2">
                  <Link
                    href={`/u/${post.user.id}`}
                    className="relative mr-2 font-semibold"
                  >
                    <Image
                      height={1000}
                      width={1000}
                      className="my-2 h-10 w-10 cursor-pointer rounded-full object-cover ring-2 ring-red-500"
                      src={post.user.image as string}
                      alt="profile photo"
                    />
                  </Link>
                  <div className="mt-2 flex flex-col">
                    <div>
                      <Link
                        href={`/u/${post.user.id}`}
                        className="mr-1 inline-block font-semibold hover:underline"
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
              </div>
              {/* Like And Comment Button */}
              {/* <div>
            {/* <PostActions
          className='p-3'
          postId={id}
          addCommentRef={addCommentRef}
          userLike={userLike}
        />
        {/* Like Count 
            <LikeBtn
              isLike={isLike}
              handleLike={handleLike}
              handleUnLike={handleUnLike}
            />
            <p className='px-3 font-semibold'>
              {post.likes.length} like{post.likes.length === 1 ? '' : 's'}
            </p>
            {/* TimeStamp 
            <Link href={`/p/${post.id}`}>
              <a className='px-3 py-1 text-xs uppercase text-gray-500'>
                {moment(post.createdAt).fromNow(true)} ago
              </a>
            </Link>
            <AddComment postId={post.id} />
          </div> */}
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
            {userPosts &&
              userPosts.posts.map((post) => (
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
                          <span>2</span>
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
