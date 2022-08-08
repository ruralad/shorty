import debounce from "lodash/debounce";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

import { GearIcon } from "@radix-ui/react-icons";
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

  const [customize, setCustomize] = useState(false);

  const url = window.location.host;

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const createSlug = trpc.useMutation(["createSlug"]);

  const randomSlug = () => {
    const nanoid = customAlphabet(
      "123456789abcdefghijklmnopqrstwxyzABCDEFGHIJKLMNOPQRSTWXYZ-",
      8
    );
    const slug = nanoid();
    setForm({
      ...form,
      slug,
    });
    slugCheck.refetch();
  };
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

  useEffect(() => {
    randomSlug();
  }, []);

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
            randomSlug();
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
        setCustomize(false);
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
      <div className=" flex flex-col items-center text-center">
        <div className="flex items-center p-2">
          <input
            type="url"
            className=" border-2 border-gray-800 dark:border-gray-200 p-2 outline-none  ml-3 dark:placeholder:text-gray-600"
            placeholder="url"
            minLength={1}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
          <input
            type="submit"
            value="shorten"
            className=" border-2 border-gray-800 w-full bg-gray-800 p-2 font-bold cursor-pointer text-white disabled:text-red-900 disabled:cursor-not-allowed"
            disabled={slugCheck.isFetched && slugCheck.data?.used}
          />
        </div>
        <div
          className={
            ` flex items-center gap-2 my-4 cursor-pointer ` +
            (customize ? `opacity-100` : `opacity-50`)
          }
          onClick={() => setCustomize(!customize)}
        >
          <GearIcon />
          <span>Customize</span>
        </div>

        {customize && (
          <div className=" flex flex-col md:flex-row items-center mt-1 showSlowly">
            <div className="flex p-2">
              <p>{url}/</p>
              <input
                type="text"
                className={` outline-none  ml-1 border-b-2 dark:placeholder:text-gray-600 bg-transparent w-28 ${
                  slugCheck.data?.used ? ` border-red-500` : ``
                } ${
                  !slugCheck.data?.used && form.slug ? `border-green-500` : ``
                }`}
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
            </div>
            <input
              type="button"
              value="random"
              className="rounded border border-gray-200 px-1 cursor-pointer ml-2 mt-3 md:mt-0"
              onClick={randomSlug}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default Form;
