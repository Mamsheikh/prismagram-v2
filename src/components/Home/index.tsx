import { type Session } from "next-auth";
import React, { useEffect } from "react";
import Layout from "../Layout";
import { api } from "../../utils/api";
import PostItem from "./Posts/PostItem";
import useScrollPosition from "../../hooks/scroll";

type FeedProps = {
  session: Session | null;
};

const Feed: React.FC<FeedProps> = () => {
  const scrollPosition = useScrollPosition();
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.user.posts.useInfiniteQuery(
      { limit: 1 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
      }
    );

  const posts = data?.pages.flatMap((page) => page.withUrls) ?? [];
  // if (!data) return null;
  console.log(scrollPosition);
  useEffect(() => {
    if (scrollPosition > 85 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching]);
  return (
    <Layout>
      <div className="mx-auto grid grid-cols-1 pt-16 md:max-w-3xl md:grid-cols-2 xl:max-w-4xl xl:grid-cols-3">
        <section className="col-span-2">
          {posts.map((post) => (
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
          {/* <div className="mx-auto flex items-center justify-center">
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                type="button"
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                load more
              </button>
            )}
          </div> */}
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
