import debounce from "lodash/debounce";
import { customAlphabet } from "nanoid";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

import { TiClipboard } from "react-icons/ti";

type Form = {
  slug: string;
  url: string;
};

interface fetchProps {
  fetchCount: () => any;
}

const Form = ({ fetchCount }: fetchProps) => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const [copied, setCopied] = useState<Boolean>(false);

  const url = window.location.host;

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const createSlug = trpc.useMutation(["createSlug"]);

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(`${url}/${form.slug}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const refreshCount = () => {
    setTimeout(() => {
      fetchCount();
    }, 3000);
  };

  if (createSlug.status === "success") {
    return (
      <>
        <div className="flex justify-center items-center">
          <h3 className="underline">{`${url}/${form.slug}`}</h3>
          <span className="relative ml-3 p-1 rounded cursor-pointer flex items-center">
            <span onClick={copyToClipBoard}>
              <TiClipboard size={25} />{" "}
            </span>
            {copied && <span className="absolute ml-8">copied!</span>}
          </span>
        </div>
        <input
          type="button"
          value="shorten another url"
          className="border-2 border-gray-500 p-2 mt-5 rounded cursor-pointer dark:text-black"
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
        refreshCount();
      }}
    >
      {/* <div className="absolute right-0 -top-10">
        {slugCheck.data?.used && (
          <span className=" text-red-500">already in use</span>
        )}
        {!slugCheck.data?.used && form.slug && (
          <span className=" text-green-500">available</span>
        )}
      </div> */}
      <div className=" flex items-center">
        <span>link</span>
        <input
          type="url"
          className="rounded border-2 border-gray-800 dark:border-gray-200 p-2 outline-none  ml-3 w-full dark:placeholder:text-gray-600"
          placeholder="https://lengthyURLyouneedtoshorten.co"
          minLength={1}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
      </div>
      <div className="flex items-center flex-col md:flex-row gap-1 mt-8 text-center">
        <p>{url}/</p>
        <input
          type="text"
          className={` outline-none  ml-1 border-b-2 dark:placeholder:text-gray-600 bg-transparent w-36 ${
            slugCheck.data?.used ? ` border-red-500` : ``
          } ${!slugCheck.data?.used && form.slug ? `border-green-500` : ``}`}
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
          className="rounded border border-gray-200 px-1 cursor-pointer ml-2 mt-3 md:mt-0"
          onClick={() => {
            const nanoid = customAlphabet(
              "123456789abcdefghijklmnopqrstwxyzABCDEFGHIJKLMNOPQRSTWXYZ-",
              12
            );
            const slug = nanoid();
            setForm({
              ...form,
              slug,
            });
            slugCheck.refetch();
          }}
        />
      </div>
      <input
        type="submit"
        value="shorten"
        className="rounded w-full bg-gray-800 dark:bg-gray-200 p-1 font-bold cursor-pointer mt-8 text-white dark:text-black disabled:text-red-900 disabled:cursor-not-allowed"
        disabled={slugCheck.isFetched && slugCheck.data?.used}
      />
    </form>
  );
};

export default Form;
