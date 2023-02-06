import type { NextPageContext, NextPage } from "next";
import Head from "next/head";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import Auth from "../components/Auth";

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log({ session });
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <>
      <Head>
        <title>Prismagram</title>
        <meta name="description" content="Prsimagram app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {session?.user?.username ? (
          <div>feed</div>
        ) : (
          <Auth session={session} reloadSession={reloadSession} />
        )}
      </div>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
