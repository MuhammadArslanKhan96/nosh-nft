"use client";
import { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  bio?: string | null;
  website?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  imageUrl?: string | null;
  imageName?: string | null;
  wallet?: string | null;
}

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  fetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const token = Cookies.get("loginToken");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({
    id: null,
    name: null,
    email: null,
    bio: null,
    website: null,
    facebook: null,
    twitter: null,
    telegram: null,
    imageUrl: null,
    imageName: null,
  });

  const fetchUser = async () => {
    if (token) {
      await axios
        .get(`${apiBaseUrl}/user/get-context`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUser({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            bio: response.data?.bio,
            website: response.data?.website,
            facebook: response.data?.facebook,
            twitter: response.data?.twitter,
            telegram: response.data?.telegram,
            imageUrl: response.data?.image_url,
            imageName: response.data?.image_name,
          });
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (token) {
        const { data } = await axios.get(`${apiBaseUrl}/user/get-context`, {
          headers: {
            Authorization: token,
          },
        });
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          bio: data?.bio,
          website: data?.website,
          facebook: data?.facebook,
          twitter: data?.twitter,
          telegram: data?.telegram,
          imageUrl: data?.image_url,
          imageName: data?.image_name,
        });
        setLoading(false);
        return data;
      }
      return {};
    },
  });

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {isLoading ? (
        <>
          <Loading />
        </>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}
