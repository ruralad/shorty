import "../styles/globals.css";

import Head from "next/head";
import type { AppProps } from "next/app";

import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";

import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <link rel="shortcut icon" href="/public/favicon.ico" />
        <title>Shorty | URL Shortner</title>
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

function getBaseUrl() {
  if (process.browser) return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
    };
  },
  ssr: false,
})(MyApp);
