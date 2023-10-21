"use client";
import Avatar from "@/shared/Avatar/Avatar";
import { Follow } from "@/types/Follow";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

const Page = () => {
  const userId = useSearchParams().get("id");
  const [followers, setFollowers] = useState<Follow[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/follow/get-following/${userId}`)
      .then((response) => {
        setFollowers(response.data.result);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div className="pt-10 py-10">
      {followers.length > 0 ? (
        followers.map((follower, index) => (
          <Link
            key={follower.id}
            href={{
              pathname: "/user-profile",
              query: { id: follower.id },
            }}
          >
            <div className="flex mt-5 flex-col border border-gray-800 shadow-md rounded-lg p-6">
              <div>
                <div className="flex items-center space-x-4">
                  <Avatar
                    imgUrl={follower.image_url}
                    sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{follower.name}</h2>
                    <p className="text-sm text-gray-500">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h1 className="text-center">This user isn't following anyone</h1>
      )}
    </div>
  );
};

export default Page;
