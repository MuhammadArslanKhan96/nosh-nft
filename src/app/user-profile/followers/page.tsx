"use client";
import Avatar from "@/shared/Avatar/Avatar";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

interface Follower {
  name: string;
  image_url: string;
}

const Page = () => {
  const userId = useSearchParams().get("id");
  const [followers, setFollowers] = useState<Follower[]>([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/follow/get-follower/${userId}`)
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
          <div className="flex mt-5 flex-col border border-gray-800 shadow-md rounded-lg p-6">
            <div key={index}>
              <div className="flex items-center space-x-4">
                <Avatar
                  imgUrl={follower.image_url}
                  sizeClass="w-8 h-8 sm:w-9 sm:h-9"
                />
                <div>
                  <h2 className="text-lg font-semibold">{follower.name}</h2>
                  <p className="text-sm text-gray-500">Follower</p>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-center">This user doesn't have any followers</h1>
      )}
    </div>
  );
};

export default Page;
