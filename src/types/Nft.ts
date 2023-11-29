export type NftHome = {
  id: string;
  name: string;
  image_url: string;
  creator_name: string;
  collection_name: string;
  price: string;
  creator_image_url: string;
  on_sale: boolean;
};

export type NftCollection = {
  nft_name: string;
  nft_image_url: string;
};

export type NftType = {
  id: number;
  image_url: string;
  price: string;
  name: string;
  description: string;
  current_owner: string;
  primary_owner: string;
  on_sale: boolean;
  owner_wallet: string;
  token_id: string;
  collection_address: string;
};

export type NftSale = {
  id: number;
  image_url: string;
  name: string;
  description: string;
  price: string;
  current_owner: string;
  primary_owner: string;
  on_sale: boolean;
  owner_wallet: string;
  token_id: string;
  collection_address: string;
};
