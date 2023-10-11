"use client";
import Avatar from "@/shared/Avatar/Avatar";
import { Listbox } from "@headlessui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

interface follower {
  name: string;
  image_url: string;
}

const page = () => {
  const userId = Cookies.get("userId");
  const [follower, setFollower] = useState<follower | null>(null);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/follow/get-following/${userId}`)
      .then((response) => {
        setFollower(response.data.result[0]);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div className="pt-10 py-10">
      {follower ? (
        <Listbox as="div" className="space-y-2">
          {/* <Listbox.Label className="block text-sm font-medium text-gray-700">
          Follower
        </Listbox.Label> */}
          <div className="mt-1 relative">
            <Listbox.Button className="flex justify-between w-full relative py-2 pl-3 pr-3 text-left rounded-lg border border-gray-300 cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="block truncate">{follower.name}</span>
              <Avatar imgUrl={follower.image_url} />
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                {/* <img
                src={}
                alt={follower.name}
                className="h-10 w-10 rounded-full"
              /> */}
              </span>
            </Listbox.Button>
          </div>
        </Listbox>
      ) : (
        <h1 className="pt-10 text-center">You are not following anyone</h1>
      )}

      {/* <h1 className="text-center pt-10">No NFTs Found</h1> */}

      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
    {Array.from("11111111").map((_, index) => (
      <CardNFT key={index} />
    ))}
  </div>
  <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
    <Pagination />
    <ButtonPrimary loading>Show me more</ButtonPrimary>
  </div> */}
    </div>
  );
};

export default page;
