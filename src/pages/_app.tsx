import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import NextNprogress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";

import "nprogress/nprogress.css";

import { api } from "../utils/api";

import "../styles/globals.css";
import Script from "next/script";
import { env } from "../env/client.mjs";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <NextNprogress
          color="#0079bf"
          startPosition={0.3}
          stopDelayMs={200}
          height={4}
        />
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
        
    `}
        </Script>
        <Component {...pageProps} />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
