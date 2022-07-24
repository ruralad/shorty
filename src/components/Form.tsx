import type { NextPage } from "next";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { trpc } from "../../utils/trpc";
import { nanoid } from "nanoid";

type Form = {
  slug: string;
  url: string;
};

const Form: NextPage = () => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const url = window.location.origin;

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const createSlug = trpc.useMutation(["createSlug"]);
  if (createSlug.status === "success") {
    return (
      <>
        <div className="flex justify-center items-center">
          <h1>{`${url}/${form.slug}`}</h1>
        </div>
        <input
          type="button"
          value="shorten another url"
          className="bg-gray-200 p-2 mt-5 rounded cursor-pointer"
          onClick={() => {
            createSlug.reset();
            setForm({ slug: "", url: "" });
          }}
        />
      </>
    );
  }

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        createSlug.mutate({ ...form });
      }}
    >
      {/* {slugCheck.data?.used && (
        <span className="text-red-500">not available :(</span>
      )} */}
      {/* {!slugCheck.data?.used && form.slug && (
        <span className="absolute text-green-500">available</span>
      )} */}
      <div className="flex items-center">
        <p>{url}/</p>
        <input
          type="text"
          className={
            `rounded bg-gray-100 p-2 outline-none text-black ml-1 border-2 border-gray-100` +
            (slugCheck.data?.used ? ` border-red-500` : ``) +
            (!slugCheck.data?.used && form.slug ? ` border-green-500` : ``)
          }
          placeholder="kewlSite"
          minLength={1}
          maxLength={30}
          onChange={(e) => {
            setForm({
              ...form,
              slug: e.target.value,
            });
            debounce(slugCheck.refetch, 100);
          }}
          value={form.slug}
          pattern={"^[-a-zA-Z0-9]+$"}
          title="Only alphanumeric characters and hypens are allowed. No spaces."
          required
        />
        <input
          type="button"
          value="random"
          className="rounded border border-gray-200 text-gray-500 p-2 cursor-pointer ml-2"
          onClick={() => {
            const slug = nanoid(12);
            setForm({
              ...form,
              slug,
            });
            slugCheck.refetch();
          }}
        />
      </div>
      <div className="mt-3 flex items-center">
        <span>link</span>
        <input
          type="url"
          className="rounded bg-gray-100 p-2 outline-none text-black ml-3 w-full"
          placeholder="https://lengthyURLyouneedtoshorten.com/nicePage"
          minLength={1}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
      </div>
      <input
        type="submit"
        value="shorten"
        className="rounded w-full bg-gray-800 text-white p-1 font-bold cursor-pointer mt-3 "
        disabled={slugCheck.isFetched && slugCheck.data?.used}
      />
    </form>
  );
};

export default Form;
