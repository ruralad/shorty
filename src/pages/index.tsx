import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Suspense } from "react";

const Form = dynamic(() => import("../components/Form"), {
  ssr: false,
});
const Home: NextPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-950 text-gray-800">
      <Suspense>
        <Form />
      </Suspense>
    </div>
  );
};

export default Home;
