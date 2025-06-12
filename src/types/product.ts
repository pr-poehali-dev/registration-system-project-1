export interface Product {
  id: string;
  name: string;
  brand: string;
  type: "солнцезащитные" | "оптические" | "компьютерные";
  gender: "мужские" | "женские" | "унисекс";
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Filters {
  type: string;
  gender: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
}
