"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
}

interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextProps | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const token = Cookies.get("loginToken");
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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        await axios
          .get(`${apiBaseUrl}/user/get-context`, {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data.id);
            console.log(response.data.name);
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
            });
            setLoading(false);
          });
      }
    };
    fetchData();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
