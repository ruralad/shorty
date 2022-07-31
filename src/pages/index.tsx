import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

import { Suspense } from "react";
import { useState, useEffect } from "react";

import { useTheme } from "next-themes";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const Form = dynamic(() => import("../components/Form"), {
  ssr: false,
});
const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-950 p-2">
      <Suspense>
        <div
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <MdDarkMode size={25} />
          ) : (
            <MdOutlineLightMode size={25} />
          )}
        </div>
        <Form />
      </Suspense>
    </div>
  );
};

export default Home;
