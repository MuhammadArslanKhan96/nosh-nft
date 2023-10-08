"use client";
import CardNFT from "@/components/CardNFT";
import { useUserContext } from "@/hooks/useUserContext";
import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
interface nft {
  id: number;
  image_url: string;
  name: string;
  description: string;
  price: string;
  current_owner: string;
}
const NftForSalePage = ({}) => {
  const { user } = useUserContext();
  const userId = Cookies.get("userId");
  const [nft, setNft] = useState<nft[]>([]);
  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/nfts/getsale/${userId}`)
      .then((response) => {
        console.log(response.data);
        setNft(response.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={`nc-MyNftPage`}>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              NFTs for sale
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              You can buy NFTS here.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10  mt-8 lg:mt-10">
            {nft.map((nft, index) => (
              <CardNFT
                key={nft.id}
                id={nft.id}
                imageUrl={nft.image_url}
                name={nft.name}
                description={nft.description}
                price={nft.price}
                currentOwner={nft.current_owner}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(NftForSalePage), { ssr: false });
