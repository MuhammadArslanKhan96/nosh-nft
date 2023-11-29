"use client";
import CardNFT from "@/components/CardNFT";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import { useState } from "react";
import Loading from "../loading";
import { NftSale } from "@/types/Nft";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const NftForSalePage = ({}) => {
  const [nft, setNft] = useState<NftSale[]>([]);
  const [row, setRows] = useState<number | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBaseUrl}/nfts/getAll`);
      const onSaleNfts = data.result.filter((nft: any) => nft.on_sale === true);
      setNft(onSaleNfts);
      console.log(onSaleNfts);
      setRows(data.result.length);
      return onSaleNfts;
    },
  });
  if (isLoading) <Loading />;

  return (
    <div className={`nc-MyNftPage`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          {row == 0 ? (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  No NFTs for sale
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  No NFTs are on sale right now. Please check back later.
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  NFTs for sale
                </h2>
                <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                  You can buy NFTS here.
                </span>
              </div>
            </>
          )}

          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10  mt-8 lg:mt-10">
            {nft.map((nft, index) => (
              <CardNFT
                key={nft.id}
                id={nft.id}
                imageUrl={nft.image_url}
                name={nft.name}
                price={nft.price}
                currentOwner={nft.current_owner}
                onSale={nft.on_sale}
                primaryOwner={nft.primary_owner}
                owner_wallet={nft.owner_wallet}
                token_id={nft.token_id}
                collection_address={nft.collection_address}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(NftForSalePage), { ssr: false });
