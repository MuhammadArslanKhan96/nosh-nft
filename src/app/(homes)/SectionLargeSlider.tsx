"use client";
import { FC, useEffect, useState } from "react";
import CardLarge1 from "@/components/CardLarge1/CardLarge1";
import axios from "axios";

interface nfts {
  id: string;
  name: string;
  image_url: string;
  creator_name: string;
  collection_name: string;
  price: string;
}
export interface SectionLargeSliderProps {
  className?: string;
}

const SectionLargeSlider: FC<SectionLargeSliderProps> = ({
  className = "",
}) => {
  const [nfts, setNfts] = useState<nfts[]>([]);
  const [indexActive, setIndexActive] = useState(0);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/nfts/get-all-details`
        );
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
      {nfts?.map((nft) => (
        <CardLarge1
          key={nft.id}
          featuredImgUrl={nft.image_url}
          nftName={nft.name}
          creatorName={nft.creator_name}
          collectionName={nft.collection_name}
          nftPrice={nft.price}
          onClickNext={handleClickNext}
          onClickPrev={handleClickPrev}
          isShowing={true}
        />
      ))}
    </div>
  );
};

export default SectionLargeSlider;
