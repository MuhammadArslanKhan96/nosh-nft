import { NftCollection } from "./Nft";

export type Collection = {
  id: string;
  name: string;
  description: string;
  price: string;
  current_owner: string;
  collection_id: string;
  nft_image_url: string;
  collection_name: string;
  collection_description: string;
  user_name: string;
  user_image_url: string;
  nfts: NftCollection[];
};

export type CollectionUploadItem = {
  id: number;
  name: string;
  description: string;
  symbol: string;
  address: string;
};
