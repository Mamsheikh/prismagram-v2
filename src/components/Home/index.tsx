import { type Session } from "next-auth";
import React from "react";
import Layout from "../Layout";

type FeedProps = {
  session: Session | null;
};

const Feed: React.FC<FeedProps> = () => {
  return (
    <Layout>
      <div>feed</div>
    </Layout>
  );
};
export default Feed;
