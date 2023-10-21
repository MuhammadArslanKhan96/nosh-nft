"use client";
import { FC, useEffect, useState } from "react";
import CardLarge1 from "@/components/CardLarge1/CardLarge1";
import axios from "axios";
import Cookies from "js-cookie";
import { NftHome } from "@/types/Nft";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export interface SectionLargeSliderProps {
  className?: string;
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  className = "",
}) => {
  const [nfts, setNfts] = useState<NftHome[]>([]);
  const [indexActive, setIndexActive] = useState(0);
  const token = Cookies.get("loginToken");

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/nfts/get-all-details`);
        console.log(response.data.result);
        setNfts(response.data.result);
      } catch (error) {
        console.error("Failed to fetch NFTs", error);
      }
    };

    fetchNfts();
  }, []);

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= 2) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return 2;
      }
      return state - 1;
    });
  };

  return (
    <div className={`nc-SectionLargeSlider relative ${className}`}>
      {nfts?.slice(0, 4).map((nft) => (
        <CardLarge1
          key={nft.id}
          id={nft.id}
          featuredImgUrl={nft.image_url}
          nftName={nft.name}
          creatorName={nft.creator_name}
          userImageUrl={nft.creator_image_url}
          collectionName={nft.collection_name}
          nftPrice={nft.price}
          onSale={nft.on_sale}
          onClickNext={handleClickNext}
          onClickPrev={handleClickPrev}
          isShowing={true}
        />
      ))}
    </div>
  );
};

export default SectionLargeSlider;
