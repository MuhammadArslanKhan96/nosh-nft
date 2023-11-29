"use client";
import CardNFT from "@/components/CardNFT";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useState } from "react";
import Loading from "../loading";
import { useAuth } from "@/hooks/useAuth";
import { NftType } from "@/types/Nft";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
const MyNftPage = ({}) => {
  useAuth();
  const userId = Cookies.get("userId");
  const token = Cookies.get("loginToken");
  const [nft, setNft] = useState<NftType[]>([]);
  const [row, setRows] = useState<number | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["nft"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiBaseUrl}/nfts/get/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data.result);
      setRows(data.result.length);
      setNft(data.result);
      return data;
    },
  });

  if (isLoading)
    return (
      <>
        <Loading />
      </>
    );

  return (
    <div className={`nc-MyNftPage`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          {row == 0 ? (
            <>
              <h2 className="text-3xl sm:text-4xl font-semibold">
                No NFTs found
              </h2>
              <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                You currently have no nfts. Start buying an nft or create one.
              </span>
            </>
          ) : (
            <>
              <h2 className="text-3xl sm:text-4xl font-semibold">Your NFT's</h2>
              <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
                You can view, update, disable and manage other nft settings.
              </span>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10  mt-8 lg:mt-10">
                {nft.map((nft) => (
                  <CardNFT
                    key={nft.id}
                    id={nft.id}
                    imageUrl={nft.image_url}
                    name={nft.name}
                    price={nft.price}
                    currentOwner={nft.current_owner}
                    onSale={nft.on_sale}
                    owner_wallet={nft.owner_wallet}
                    token_id={nft.token_id}
                    collection_address={nft.collection_address}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(MyNftPage), { ssr: false });
