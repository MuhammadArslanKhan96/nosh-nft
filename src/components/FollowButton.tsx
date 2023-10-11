"use client";
import { FC, useEffect, useState } from "react";
import ButtonPrimary, {
  ButtonPrimaryProps,
} from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import axios from "axios";
import { toast } from "sonner";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

export interface FollowButtonProps extends ButtonPrimaryProps {
  isFollowing?: boolean;
  followerId?: string;
  followingId?: string;
}
const FollowButton: FC<FollowButtonProps> = ({
  className = "relative z-10",
  sizeClass = "px-4 py-1.5 min-w-[84px]",
  fontSize = "text-sm font-medium",
  isFollowing = false,
  followerId,
  followingId,
  onClick,
}) => {
  const [following, setFollowing] = useState(isFollowing);

  useEffect(() => {
    setFollowing(Math.random() > 0.5);
  }, []);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.post(`${apiBaseUrl}/follow/check`, {
          followerId: followerId,
          followingId: followingId,
        });
        setFollowing(response.data.result);
      } catch (error) {
        console.error(error);
      }
    };

    checkFollowStatus();
  }, [followerId, followingId]);

  const handleFollow = async (isFollowing: boolean) => {
    const url = isFollowing
      ? `${apiBaseUrl}/follow/create`
      : `${apiBaseUrl}/follow/delete`;
    const data = {
      followerId: followerId,
      followingId: followingId,
    };

    if (isFollowing) {
      await axios
        .post(url, data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await axios
        .delete(url, { data })
        .then((response) => {
          console.log(response.data);
          toast.success(response.data.message);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Error occured while unfollowing");
        });
    }
  };

  const handleClick = async () => {
    setFollowing(!following);
    await handleFollow(!following);
  };
  return !following ? (
    <ButtonPrimary
      className={className}
      sizeClass={sizeClass}
      fontSize={fontSize}
      onClick={handleClick}
    >
      Follow
    </ButtonPrimary>
  ) : (
    <ButtonSecondary
      className={` border border-slate-200 dark:border-slate-700 ${className}`}
      sizeClass={sizeClass}
      fontSize={fontSize}
      onClick={handleClick}
    >
      <span className="text-sm ">Following</span>
    </ButtonSecondary>
  );
};
export default FollowButton;
