"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASEURL;

interface User {
  userId: string | null;
  username: string | null;
  email: string | null;
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
  let token: string | null;
  token = "";
  const [user, setUser] = useState<User>({
    userId: null,
    username: null,
    email: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    token = localStorage.getItem("loginToken");
  }, []);

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
              userId: response.data.id,
              username: response.data.name,
              email: response.data.email,
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
