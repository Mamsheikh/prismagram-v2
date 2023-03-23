import { type Session } from "next-auth";
import React, { useEffect } from "react";
import { api } from "../../utils/api";
import Layout from "../Layout";
import PostItem from "./Posts/PostItem";
import { SyncLoader } from "react-spinners";
import PostSkeleton from "./Posts/PostSkeleton";
import MiniProfile from "./MiniProfile";
import Suggestions from "./Suggestions";

const LIMIT = 10;

type FeedProps = {
  session: Session | null;
};

const Feed: React.FC<FeedProps> = ({ session }) => {
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = api.post.posts.useInfiniteQuery(
    { limit: LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight
      )
        return;
      if (isLoading || isFetching) return;
      // setPage(prevPage => prevPage + 1);
      console.log("bottom page");
      fetchNextPage();
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching]);

  return (
    <Layout>
      {isLoading ? (
        <div className="mt-20">
          {[0, 1, 2, 3, 4].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="mx-auto grid grid-cols-1 pt-16 md:max-w-3xl md:grid-cols-2 xl:max-w-4xl xl:grid-cols-3">
          <section className="col-span-2">
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                input={{
                  limit: LIMIT,
                }}
              />
            ))}

            <div className="mx-auto my-10 flex items-center justify-center">
              {isFetchingNextPage && <SyncLoader color="#4B5563" />}
              {!hasNextPage && (
                <p className="text-sm text-gray-600 ">No more posts</p>
              )}
            </div>
          </section>
          <section className=" md:col-span-1 md:hidden xl:inline-grid">
            <div className="fixed">
              <MiniProfile session={session} />
              <Suggestions />
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};
export default Feed;
