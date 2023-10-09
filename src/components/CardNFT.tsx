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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Badge from "@/shared/Badge/Badge";
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
  onSale?: boolean;
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
  onSale,
}) => {
  const router = useRouter();
  const userId = Cookies.get("userId");
  const [username, setUserName] = useState<string | null>();
  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/user/get/${currentOwner}`)
      .then((response) => {
        response.data.result.forEach((item: any) => {
          if (item.name) {
            setUserName(item.name);
          } else {
            console.log("Name property does not exist");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const { user } = useUserContext();
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
    if (userId) {
      await axios
        .put(`${apiBaseUrl}/nfts/update/${userId}`, {
          id: id,
        })
        .then((response) => {
          console.log(response.data.status);
          router.push("/nft");
          toast.success("NFT bought successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error occured while buying NFT");
        });
    }
    if (!userId) {
      toast.error("Please login to buy NFT");
    }
  };
  const handleOnSale = async () => {
    if (userId) {
      await axios
        .put(`http://localhost:8080/nfts/update/${userId}`, {
          id: id,
        })
        .then((response) => {
          console.log(response.data.status);
          router.push("/nft-sale");
          toast.success("NFT added for sale on marketplace");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error occured while buying NFT");
        });
    }
  };

  return (
    <div className={`nc-CardNFT relative flex flex-col group ${className}`}>
      <div className="relative flex-shrink-0 ">
        <div className="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0">
          <Image
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        <div>
          <h5>By {username}</h5>
        </div>

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
            <>
              {onSale ? (
                <>
                  <Badge
                    name="On Sale"
                    className="bg-opacity-0 border border-green-500 text-green-500"
                  />
                </>
              ) : (
                <>
                  <button
                    onClick={handleOnSale}
                    className="border border-green-300 hover:text-white hover:bg-green-600 text-green-500 font-bold py-2 px-4 rounded"
                  >
                    Put on sale
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleSubmit}
                className="border border-green-300 hover:text-white hover:bg-green-600 text-green-500 font-bold py-2 px-4 rounded"
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
