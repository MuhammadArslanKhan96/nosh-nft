"use client";
import CollectionCard from "@/components/CollectionCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useState } from "react";
import Loading from "../loading";
import { Collection } from "@/types/Collection";
import { nftsImgs } from "@/contains/fakeData";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const AllCollectionPage = ({}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [row, setRows] = useState<number | null>(null);
  const { isLoading } = useQuery({
    queryKey: ["collection"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBaseUrl}/collection/getAll`);
      console.log(data);
      console.log(data.result);
      console.log(
        collections.map((collection) => collection.nfts[0].nft_image_url)
      );

      setRows(data.result.length);
      setCollections(data.result);
      return data;
    },
    cacheTime: Infinity,
  });

  if (isLoading) <Loading />;

  return (
    <div className={`nc-AllCollectionPage`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          {row == 0 ? (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:tex  t-4xl font-semibold">
                  No Nfts collection found
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  Create a new NFT collection.
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  All NFTs Collection
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  You can view all NFT collections here.
                </span>
              </div>
              <div className="flex overflow-auto py-2 space-x-4 customScrollBar"></div>
              <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10  mt-8 lg:mt-10">
                {collections.map((collection) => {
                  return (
                    <CollectionCard
                      key={collection.collection_id}
                      // imgs={collection.nfts[0]?.nft_image_url}
                      imgs={
                        collection.nfts[0]?.nft_image_url
                          ? collection.nfts[0]?.nft_image_url
                          : nftsImgs[0]
                      }
                      username={collection.user_name}
                      id={collection.collection_id}
                      name={collection.collection_name}
                      description={collection.collection_description}
                      userImageUrl={collection.user_image_url}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(AllCollectionPage), {
  ssr: false,
});
