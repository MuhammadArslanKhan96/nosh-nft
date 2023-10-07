"use client";
import { FC, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import ItemTypeImageIcon from "./ItemTypeImageIcon";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import ItemTypeVideoIcon from "./ItemTypeVideoIcon";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import { useUserContext } from "@/hooks/useUserContext";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export interface CardNFTProps {
  id?: number;
  imageUrl?: string;
  name?: string;
  description?: string;
  price?: string;
  className?: string;
  isLiked?: boolean;
  currentOwner?: string;
}

const CardNFT: FC<CardNFTProps> = ({
  className = "",
  isLiked,
  id,
  name,
  imageUrl,
  description,
  price,
  currentOwner,
}) => {
  const { user } = useUserContext();
  const userId = user.id;
  const [itemType, setItemType] = useState<"video" | "audio" | "default">(
    "default"
  );

  useEffect(() => {
    if (Math.random() > 0.5) {
      setItemType("video");
    } else {
      setItemType("audio");
    }
  }, []);

  const renderAvatars = () => {
    return (
      <div className="flex -space-x-1 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
      </div>
    );
  };
  const handleSubmit = async () => {
    await axios
      .put(`${apiBaseUrl}/nfts/update/${userId}`, {
        id: id,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={`nc-CardNFT relative flex flex-col group ${className}`}>
      <div className="relative flex-shrink-0 ">
        <div className="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0">
          <Image
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
            fill
            sizes=""
            src={imageUrl as string}
            alt="NFT Image"
          />
        </div>
        {itemType === "video" && (
          <ItemTypeVideoIcon className="absolute top-3 left-3 !w-9 !h-9" />
        )}

        {itemType === "audio" && (
          <ItemTypeImageIcon className="absolute top-3 left-3 !w-9 !h-9" />
        )}

        <LikeButton
          liked={isLiked}
          className="absolute top-3 right-3 z-10 !h-9"
        />
        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>

      <div className="px-2 py-5 space-y-3">
        {/* <div className="flex justify-between">{renderAvatars()}</div> */}
        <h2 className={`text-lg font-medium`}>{name}</h2>
        <h2 className={`text-lg font-medium`}>{description}</h2>

        <div className="w-full border-b border-neutral-200/70 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end">
          <Prices
            price={price}
            labelTextClassName="bg-white dark:bg-neutral-900"
          />
          {/* <Link
            href={"/nft-detail" as Route}
            className="absolute inset-0"
          ></Link> */}
          {userId == currentOwner ? (
            <> </>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className="border border-green-600 hover:text-white hover:bg-green-600 text-green-600 font-bold py-2 px-4 rounded"
              >
                Buy
              </button>
            </>
          )}
          {/* <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="w-4 h-4" />
            <span className="ml-1 mt-0.5">14 hours left</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CardNFT), { ssr: false });
