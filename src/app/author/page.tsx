"use client";
import CardNFT from "@/components/CardNFT";
import { UserContext } from "@/context/userContext";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Pagination from "@/shared/Pagination/Pagination";
import axios from "axios";
import { useContext, useState } from "react";
import { useLayoutEffect } from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

interface nft {
  id: number;
  image_url: string;
  name: string;
  description: string;
  price: string;
  current_owner: string;
}

const page = () => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user.userId;
  const [nft, setNft] = useState<nft[]>([]);
  const [row, setRows] = useState<number | null>(null);
  useLayoutEffect(() => {
    axios
      .get(`${apiBaseUrl}/nfts/get/${userId}`)
      .then((response) => {
        console.log(response.data.result);
        console.log(response.data.result.length);
        setRows(response.data.result.length);
        setNft(response.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10  mt-8 lg:mt-10">
        {nft.map((nft, index) => (
          <CardNFT
            key={nft.id}
            imageUrl={nft.image_url}
            name={nft.name}
            description={nft.description}
            price={nft.price}
            currentOwner={nft.current_owner}
          />
        ))}
      </div>
      <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
        <Pagination />
        <ButtonPrimary>Show me more</ButtonPrimary>
      </div>
    </div>
  );
};

export default page;
