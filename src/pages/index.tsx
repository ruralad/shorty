import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { Suspense } from "react";
import { useState, useEffect } from "react";

import { useTheme } from "next-themes";
import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

const Form = dynamic(() => import("../components/Form"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const { theme, setTheme } = useTheme();

  const fetchCount = () => {
    fetch("/api/getCount")
      .then((response) => response.json())
      .then((data) => setTotalCount(data.count));
  };

  useEffect(() => {
    setMounted(true);
    fetchCount();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-950 p-2">
      <Suspense>
        <div className="absolute top-5 right-5 cursor-pointer flex gap-5">
          <a
            href="https://github.com/ruralad/shorty"
            target="_blank"
            rel="nofollow nereferrer"
            className="p-2 text-gray-500 hover:text-inherit"
          >
            <GitHubLogoIcon />
          </a>
          <span
            className="p-2 bg-blue-900/50 hover:bg-blue-900/70 rounded"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <SunIcon /> : <MoonIcon />}
          </span>
        </div>
        <Form fetchCount={fetchCount} />

        {totalCount && (
          <span className="absolute right-0 bottom-0 p-4 tracking-tight opacity-30">
            used {totalCount} times
          </span>
        )}
      </Suspense>
    </div>
  );
};

export default Home;
