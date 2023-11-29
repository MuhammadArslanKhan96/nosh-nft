"use client";
import CardNFT from "@/components/CardNFT";
import { NftType } from "@/types/Nft";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const page = () => {
  const userId = useSearchParams().get("id");
  const [nft, setNft] = useState<NftType[]>([]);
  const [row, setRows] = useState<number | null>(null);
  const {} = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiBaseUrl}/nfts/get-liked/${userId}`
      );
      console.log(data.result);
      setRows(data.result.length);
      setNft(data.result);
      return data.result;
    },
    cacheTime: Infinity,
  });
  return (
    <div>
      {row === 0 ? (
        <>
          <div className="">
            <h1 className="text-center pt-10">No NFTs Found</h1>
          </div>
        </>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10  mt-8 lg:mt-10">
            {nft.map((nft, index) => (
              <CardNFT
                key={nft.id}
                id={nft.id}
                imageUrl={nft.image_url}
                name={nft.name}
                price={nft.price}
                currentOwner={nft.current_owner}
                onSale={nft.on_sale}
                token_id={nft.token_id}
                collection_address={nft.collection_address}
              />
            ))}
          </div>
          {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination />
            <ButtonPrimary>Show me more</ButtonPrimary>
          </div> */}
        </>
      )}
    </div>
  );
};

export default page;
