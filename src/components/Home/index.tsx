import { type Session } from "next-auth";
import React from "react";
import Layout from "../Layout";
import { api } from "../../utils/api";
import PostItem from "./Posts/PostItem";

type FeedProps = {
  session: Session | null;
};

const Feed: React.FC<FeedProps> = () => {
  const { data } = api.user.posts.useQuery();
  console.log({ data });
  if (!data) return null;
  return (
    <Layout>
      <div className="mx-auto grid grid-cols-1 pt-16 md:max-w-3xl md:grid-cols-2 xl:max-w-4xl xl:grid-cols-3">
        <section className="col-span-2">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
          {/* <div className='mx-auto flex items-center justify-center md:max-w-3xl xl:max-w-4xl'>
          {data?.posts?.pageInfo?.hasNextPage ? (
            <button
              className='my-10 rounded bg-blue-500 px-4 py-2 text-white'
              
            >
              Load more
            </button>
          ) : (
            <p className='my-10 text-center font-medium'>
              You've reached the end!
            </p>
          )}
        </div> */}
          {/* {loading && <h2>loading...</h2>}
        {data?.posts?.pageInfo?.hasNextPage === false && (
          <p className='my-10 text-center font-medium'>
            You've reached the end!
          </p>
        )} */}
        </section>
        <section className=" md:col-span-1 md:hidden xl:inline-grid">
          <div className="fixed">
            {/* <MiniProfile /> */}
            {/* <Suggestions /> */}
          </div>
        </section>
      </div>
    </Layout>
  );
};
export default Feed;
