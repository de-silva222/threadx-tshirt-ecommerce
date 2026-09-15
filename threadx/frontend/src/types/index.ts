export interface ProductImage {
  id: number
  url: string
  type: 'front' | 'back' | 'detail' | 'lifestyle'
  sort_order: number
}

export interface ProductVariant {
  id: number
  product_id: number
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  color: string
  color_hex?: string
  sku: string
  stock: number
  price_override?: number | null
  is_active: boolean
}

export interface Product {
  id: number
  category_id: number
  category_name?: string
  name: string
  slug: string
  sku: string
  description?: string
  material?: string
  gsm?: number
  fit?: string
  base_price: number
  sale_price?: number | null
  tags?: string
  is_featured: boolean
  is_active: boolean
  rating_avg: number
  rating_count: number
  sales_count: number
  image?: string
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  is_active: boolean
  sort_order: number
}

export interface CartItem {
  id: number
  type: 'variant' | 'custom'
  variant_id?: number | null
  product_id?: number
  product_slug?: string
  design_id?: number
  name: string
  image?: string | null
  size: string
  color: string
  unit_price: number
  quantity: number
  subtotal: number
  stock?: number | null
  saved_for_later: boolean
}

export interface WishlistItem {
  wishlist_item_id: number
  product_id: number
  slug: string
  name: string
  price: number
  image?: string | null
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  status: 'active' | 'disabled'
}

export interface Address {
  id: number
  user_id: number
  label?: string
  first_name: string
  last_name: string
  phone: string
  address_line: string
  city: string
  district: string
  postal_code?: string
  is_default: boolean
}

export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'printing'
  | 'packed' | 'shipped' | 'delivered' | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cod_pending'

export interface OrderItem {
  id: number
  product_name: string
  size?: string
  color?: string
  unit_price: number
  quantity: number
  line_total: number
}

export interface Order {
  id: number
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line: string
  city: string
  district: string
  postal_code?: string
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  payment_method: 'cod' | 'online'
  payment_status: PaymentStatus
  order_status: OrderStatus
  courier_name?: string
  tracking_number?: string
  created_at: string
  items?: OrderItem[]
}

export interface Review {
  id: number
  user_name: string
  rating: number
  comment?: string
  created_at: string
}

export type PrintPosition = 'front' | 'back' | 'left_chest' | 'right_chest'

export interface CustomDesignPayload {
  tshirt_type: 'oversized' | 'regular'
  color: string
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  design_image?: string | null
  custom_text?: string
  font?: string
  text_color?: string
  print_position: PrintPosition
  scale?: number
  rotation?: number
  pos_x?: number
  pos_y?: number
}

export interface CustomDesign extends CustomDesignPayload {
  id: number
  base_price: number
  printing_fee: number
  total_price: number
  status: string
}
