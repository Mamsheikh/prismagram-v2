import { type Session } from "next-auth";
import React from "react";
import Layout from "../Layout";
import { api } from "../../utils/api";

type FeedProps = {
  session: Session | null;
};

const Feed: React.FC<FeedProps> = () => {
  const { data } = api.user.posts.useQuery();
  console.log({ data });
  return (
    <Layout>
      <div>feed</div>
    </Layout>
  );
};
export default Feed;
