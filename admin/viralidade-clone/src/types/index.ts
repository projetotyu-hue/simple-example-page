export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  gallery?: string[];
  sales_count?: string;
  rating?: string;
  category_id?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Settings {
  shop_name: string;
  logo_url?: string;
  sold_count: string;
  rating: string;
  followers: string;
  cnpj: string;
  address: string;
  email: string;
  phone: string;
  hours: string;
}
