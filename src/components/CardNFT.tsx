"use client";
import { FC, useEffect, useState } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Badge from "@/shared/Badge/Badge";
import Link from "next/link";
import NftMoreDropdown from "./NftMoreDropdown";
import { nftsImgs } from "@/contains/fakeData";
import { ethers } from "ethers";
import ABI from "@/../contracts/ABI-NFTMarketplace.json";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;
declare let window: any;

export interface CardNFTProps {
  id?: number;
  imageUrl?: string;
  name?: string;
  description?: string;
  price?: string;
  className?: string;
  isLiked?: boolean;
  currentOwner?: string;
  primaryOwner?: string;
  onSale?: boolean;
  owner_wallet?: string;
  token_id?: string;
  collection_address?: string;
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
  token_id,
  onSale,
  collection_address,
}) => {
  const contractAddress = "0xdd89638c5ec6B5A8a0Dbbad41074480e4DCBDd98";

  const [username, setUserName] = useState<string | null>();
  const router = useRouter();
  const userId = Cookies.get("userId");
  const token = Cookies.get("loginToken");
  const wallet = Cookies.get("wallet");
  const token_id_int = parseInt(token_id as string);

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

  const [itemType, setItemType] = useState<"video" | "audio" | "default">(
    "default"
  );

  const handleSubmit = async () => {
    if (!wallet) {
      toast.error("Please connect wallet to buy NFT");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    if (!collection_address) {
      toast.error(" Server error occured while buying NFT");
      return;
    }

    const contract = new ethers.Contract(collection_address, ABI, signer);
    const priceInt = ethers.parseEther(price ? price : "0.0");
    // const nft = await contract.nfts(token_id);
    // const price = nft.price;

    try {
      const transaction = await contract.buyNFT(token_id, { value: priceInt });
      await transaction.wait();
      console.log(`NFT with tokenId ${token_id} has been bought`);
    } catch (error) {
      toast.error("Error occured while buying NFT");
      console.error("An error occurred", error);
      return;
    }

    if (userId) {
      await axios
        .put(
          `${apiBaseUrl}/nfts/update/${userId}`,
          {
            id: id,
            owner_wallet: wallet,
            status: false,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log(response.data);
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
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const valueInWei = ethers.parseEther(price ? price : "0.0");

    if (!collection_address) {
      toast.error(" Server error occured putting NFT on sale");
      return;
    }

    const contract = new ethers.Contract(collection_address, ABI, signer);

    try {
      console.log(token_id, valueInWei);
      const transaction = await contract.sellNFT(token_id, valueInWei);
      await transaction.wait();
      console.log(
        `NFT with tokenId ${token_id} is now for sale at price ${price} ETH`
      );
    } catch (error) {
      toast.error("Error occured while putting NFT on sale");
      console.error("An error occurred", error);
      return;
    }
    if (userId) {
      await axios
        .put(
          `${apiBaseUrl}/nfts/update-nft/${id}`,
          {
            status: true,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log(response.data);
          router.push("/nft-sale");
          toast.success("NFT added for sale on marketplace");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error occured while putting NFT on sale");
        });
    }
  };

  const handleRemoveFromSale = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    if (!collection_address) {
      toast.error("Server error occured while removing NFT from sale");
      return;
    }

    const contract = new ethers.Contract(collection_address, ABI, signer);

    try {
      console.log(token_id);
      const transaction = await contract.removeNFTFromSale(token_id);
      await transaction.wait();
      console.log(`NFT with tokenId ${token_id} is removed from sale`);
    } catch (error) {
      toast.error("Error occured while removing NFT from sale");
      console.error("An error occurred", error);
      return;
    }
    if (userId) {
      await axios
        .put(
          `${apiBaseUrl}/nfts/update-nft/${id}`,
          {
            status: false,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log(response.data);
          router.push("/nft-sale");
          toast.success("NFT removed from sale on marketplace");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error occured while putting NFT on sale");
        });
    }
  };

  return (
    <div className={`nc-CardNFT relative flex flex-col group ${className}`}>
      <div className="relative flex-shrink-0 ">
        <div className="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0">
          <Link
            href={{
              pathname: "/nft-detail",
              query: {
                id: id,
                onSale: onSale,
              },
            }}
          >
            <Image
              className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={!imageUrl ? nftsImgs[0] : imageUrl}
              alt="NFT Image"
            />
          </Link>
        </div>

        {userId ? (
          <>
            {" "}
            <LikeButton
              nftId={id}
              userId={userId}
              liked={isLiked}
              className="absolute top-3 right-3 z-10 !h-9"
            />
          </>
        ) : (
          <></>
        )}

        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>
      <div className="px-2 py-5 space-y-3">
        <h2 className={`text-lg font-medium`}>{name}</h2>
        <h2 className={`text-lg font-medium`}>{description}</h2>

        <div>
          <h5>
            <div className="flex justify-between">
              <Link
                href={{
                  pathname: "/user-profile",
                  query: {
                    id: currentOwner,
                  },
                }}
              >
                <div className="flex items-center">
                  <Avatar
                    imgUrl={imageUrl ? nftsImgs[0] : "/"}
                    sizeClass="h-6 w-6"
                    containerClassName="ring-2 ring-white"
                  />
                  <div className="ml-2 text-sm">
                    <span className="font-normal">Owner:</span>{" "}
                    <span className="font-medium">
                      {username ? username : "Loading..."}
                    </span>
                  </div>
                </div>
              </Link>
              {userId == currentOwner && onSale ? (
                <div className="h-0">
                  <NftMoreDropdown id={id} />
                </div>
              ) : (
                ""
              )}
            </div>
          </h5>
        </div>

        <div className="w-full border-b border-neutral-200/70 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end">
          <Prices
            price={price}
            labelTextClassName="bg-white dark:bg-neutral-900"
          />
          {userId == currentOwner ? (
            <>
              {onSale ? (
                <button
                  onClick={handleRemoveFromSale}
                  className="border-2 border-green-500 text-xs hover:text-white hover:bg-green-600 text-green-500 py-2 px-4 rounded"
                >
                  Remove from sale
                </button>
              ) : (
                <button
                  onClick={handleOnSale}
                  className="border-2 border-green-500 text-xs hover:text-white hover:bg-green-600 text-green-500 py-2 px-4 rounded"
                >
                  Put on sale
                </button>
              )}
            </>
          ) : (
            <>
              {onSale ? (
                <button
                  onClick={handleSubmit}
                  className="border-2 border-green-500 text-xs hover:text-white hover:bg-green-600 text-green-500 py-2 px-4 rounded"
                >
                  Buy
                </button>
              ) : (
                <Badge
                  name="Not On Sale"
                  className="bg-opacity-0 border border-green-500 text-green-500"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CardNFT), { ssr: false });
