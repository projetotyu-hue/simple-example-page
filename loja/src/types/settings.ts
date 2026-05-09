export interface ProtectionProduct {
  enabled: boolean;
  title: string;
  price: number;
  original_price: number;
  image_url: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  deadline: string;
}

export interface Settings {
  id: string;
  shop_name: string | null;
  logo_url: string | null;
  sold_count: string | null;
  tracking_link: string | null;
  head_script: string | null;
  tiktok_pixel_id: string | null;
  whosamungus_id: string | null;
  cnpj: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  hours: string | null;
  rating: string | null;
  followers: string | null;
  cart_recommendations: string[] | null;
  protection_product: ProtectionProduct | null;
  shipping_rates: ShippingRate[] | null;
}
