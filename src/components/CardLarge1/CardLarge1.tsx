"use client";
import { FC } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import Avatar from "@/shared/Avatar/Avatar";
import collectionPng from "@/images/nfts/collection.png";
import Link from "next/link";
import { StaticImageData } from "next/image";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";

export interface CardLarge1Props {
  className?: string;
  onClickNext?: () => void;
  onClickPrev?: () => void;
  isShowing?: boolean;
  id?: string;
  featuredImgUrl?: string | StaticImageData;
  nftName?: string;
  creatorName?: string;
  collectionName?: string;
  nftPrice?: string;
  userImageUrl?: string;
  onSale?: boolean;
}

const CardLarge1: FC<CardLarge1Props> = ({
  className = "",
  isShowing = true,
  id,
  onClickNext = () => {},
  onClickPrev = () => {},
  featuredImgUrl,
  nftName,
  creatorName,
  collectionName,
  nftPrice,
  userImageUrl,
  onSale,
}) => {
  // const randomTitle = [
  //   "Walking On Air ",
  //   "Amazing Nature",
  //   "Beautiful NFT",
  //   "Lovely NFT",
  //   "Wolf Face #1",
  // ];
  return (
    <div
      className={`nc-CardLarge1 nc-CardLarge1--hasAnimation relative lg:pt-20 flex flex-col-reverse lg:flex-row justify-end ${className}`}
    >
      <div className="lg:absolute z-10 lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 -mt-2 lg:mt-0 sm:px-5 lg:px-0 w-full lg:max-w-lg ">
        <div className="nc-CardLarge1__left p-4 sm:p-8 xl:py-14 md:px-10 bg-white dark:bg-neutral-900 shadow-lg rounded-3xl space-y-3 sm:space-y-8 ">
          {/* TITLE */}
          <h2 className="text-2xl lg:text-3xl 2xl:text-5xl font-semibold ">
            <Link
              href={{
                pathname: "/nft-detail",
                query: {
                  id: id,
                  onSale: onSale,
                },
              }}
            >
              {nftName}
            </Link>
          </h2>

          {/* AUTHOR AND COLLECTION */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-12">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <Avatar imgUrl={userImageUrl} sizeClass="w-10 h-10" />
              </div>
              <div className="ml-3">
                <div className="text-xs dark:text-neutral-400">Creator</div>
                <div className="text-sm font-semibold flex items-center">
                  <span>{creatorName}</span>
                  {/* <VerifyIcon /> */}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <Avatar sizeClass="w-10 h-10" imgUrl={collectionPng} />
              </div>
              <div className="ml-3">
                <div className="text-xs dark:text-neutral-400">Collection</div>
                <div className="text-sm font-semibold ">{collectionName}</div>
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row items-baseline p-6 border-2 border-green-500 rounded-xl relative">
              <span className="block absolute bottom-full translate-y-1.5 py-1 px-1.5 bg-white dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400 ring ring-offset-0 ring-white dark:ring-neutral-900">
                Current Price
              </span>
              <span className="text-3xl xl:text-4xl font-semibold text-green-500">
                {nftPrice}
              </span>
              <span className="text-lg text-neutral-400 sm:ml-3.5">ETH</span>
            </div>
          </div>
          {/* AUTION TIME */}
          {/* <TimeCountDown /> */}
          <div className="w h-[1px] bg-neutral-100 dark:bg-neutral-700"></div>

          {/* DESCRIPTION */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            {/* <Link href={"/"}>
              <ButtonPrimary>Buy Item</ButtonPrimary>
            </Link> */}
            <Link
              href={{
                pathname: "/nft-detail",
                query: {
                  id: id,
                  onSale: onSale,
                },
              }}
            >
              <ButtonPrimary>View item</ButtonPrimary>
            </Link>
          </div>
        </div>
        {/* <div className="p-4 sm:pt-8 sm:px-10 ">
          <NextPrev
            btnClassName="w-11 h-11 text-xl"
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
          />
        </div> */}
      </div>

      <div className="w-full lg:w-[64%] relative ">
        <div className="nc-CardLarge1__right ">
          <Link
            href={{
              pathname: "/nft-detail",
              query: {
                id: id,
                onSale: onSale,
              },
            }}
          >
            <NcImage
              containerClassName="aspect-w-1 aspect-h-1 relative"
              className="absolute inset-0 object-cover rounded-3xl sm:rounded-[40px] border-4 sm:border-[14px] border-white dark:border-neutral-800"
              src={featuredImgUrl as string}
              alt={"title"}
              fill
              sizes="(max-width: 768px) 100vw, 840px"
            />
          </Link>

          {/* META TYPE */}
          {/* <ItemTypeVideoIcon className="absolute w-8 h-8 md:w-10 md:h-10 left-3 bottom-3 sm:left-7 sm:bottom-7 " /> */}

          {/* META FAVORITES */}
          {/* <LikeButton className="absolute right-3 top-3 sm:right-7 sm:top-7" /> */}
        </div>
      </div>
    </div>
  );
};
export default CardLarge1;
