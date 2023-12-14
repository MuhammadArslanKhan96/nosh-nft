import { FC } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import NcImage from "@/shared/NcImage/NcImage";
import VerifyIcon from "./VerifyIcon";
import Link from "next/link";
import { useUserContext } from "@/hooks/useUserContext";
import { StaticImageData } from "next/image";

export interface CollectionCardProps {
  className?: string;
  imgs?: string | string[] | StaticImageData;
  name?: string;
  id?: string;
  description?: string;
  username?: string;
  userImageUrl?: string;
}

const CollectionCard: FC<CollectionCardProps> = ({
  className,
  imgs,
  name,
  id,
  description,
  username,
  userImageUrl,
}) => {
  const { user } = useUserContext();
  return (
    <div
      className={`CollectionCard relative p-4 rounded-2xl overflow-hidden h-[410px] flex flex-col group ${className}`}
    >
      <NcImage
        fill
        containerClassName="absolute inset-0 z-0 overflow-hidden"
        src={imgs as string}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 group-hover:h-full to-transparent "></div>

      <div className="relative mt-auto">
        <div className="flex items-center">
          <Avatar
            imgUrl={userImageUrl ? userImageUrl : userImageUrl}
            sizeClass="h-6 w-6"
            containerClassName="ring-2 ring-white"
          />
          <div className="ml-2 text-xs text-white">
            <span className="font-normal">by</span>{" "}
            <span className="font-medium">{username}</span>
          </div>
          <VerifyIcon iconClass="w-4 h-4" />
        </div>
        <h2 className="font-semibold text-3xl mt-1.5 text-white">{name}</h2>
        <div className="grid grid-cols-3 gap-4 mt-5">
          {/* <NcImage
            containerClassName="relative z-0 w-full h-20 rounded-xl overflow-hidden"
            fill
            src={imgs[1]}
          />
          <NcImage
            containerClassName="relative z-0 w-full h-20 rounded-xl overflow-hidden"
            fill
            src={imgs[2]}
          />
          <NcImage
            containerClassName="relative z-0 w-full h-20 rounded-xl overflow-hidden"
            fill
            src={imgs[3]}
          /> */}
        </div>
      </div>
      <Link
        href={{
          pathname: "/collection",
          query: {
            id: id,
            name: name,
            description: description,
          },
        }}
        className="absolute inset-0"
      ></Link>
    </div>
  );
};

export default CollectionCard;
