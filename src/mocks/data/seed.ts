import type { Viewer } from '@/entities/viewer'
import type { User } from '@/entities/user'
import type { Shop } from '@/entities/shop'
import type { Product } from '@/entities/product'
import type { Order } from '@/entities/order'
import type { RequestDocument, ShopRequest } from '@/entities/shop-request'
import { IMAGES } from './images'

/** Local ISO date-time (no timezone suffix) `hours` before now, so request ages always look fresh. */
function hoursAgo(hours: number): string {
  const d = new Date(Date.now() - hours * 3_600_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
}

const DOCUMENTS: RequestDocument[] = [
  { title: 'Registration certificate', fileName: 'guvohnoma.pdf', size: '1.2 MB', url: '#' },
  { title: "Owner's passport / ID", fileName: 'passport.jpg', size: '840 KB', url: '#' },
]

export const viewer: Viewer = { id: 1, name: 'Dilnoza K.', role: 'Admin', avatarUrl: 'https://github.com/shadcn.png' }

export const users: User[] = [
  { id: 1, name: 'Dilnoza K.', phone: '+998 90 000 00 01', roles: ['ADMIN'], joinedAt: '2025-12-01', blocked: false },
  { id: 123, name: 'Mirsaid', phone: '+998 97 999 79 69', roles: ['USER', 'SELLER'], joinedAt: '2026-01-01', blocked: false },
  { id: 124, name: 'Aziza Karimova', phone: '+998 93 412 55 10', roles: ['USER', 'SELLER'], joinedAt: '2026-01-09', blocked: false },
  { id: 125, name: 'Bekzod Rahimov', phone: '+998 99 230 18 44', roles: ['USER', 'SELLER'], joinedAt: '2026-02-02', blocked: false },
  { id: 131, name: 'Kamola Yusupova', phone: '+998 91 777 30 21', roles: ['USER'], joinedAt: '2026-03-15', blocked: false },
  { id: 140, name: 'Timur Aliyev', phone: '+998 94 615 02 87', roles: ['USER'], joinedAt: '2026-04-03', blocked: false },
  { id: 152, name: 'Malika Ergasheva', phone: '+998 90 318 64 09', roles: ['USER'], joinedAt: '2026-04-21', blocked: false },
  { id: 166, name: 'Jasur Tursunov', phone: '+998 97 120 45 33', roles: ['USER'], joinedAt: '2026-05-06', blocked: true },
]

export const shops: Shop[] = [
  { id: 1, name: "Gullar do'koni", ownerId: 123, categories: ['FLOWERS'], commission: 10, suspended: false },
  { id: 2, name: 'Sweet Dreams', ownerId: 124, categories: ['BAKERY', 'GIFTS'], commission: 10, suspended: false },
  { id: 3, name: 'Le Dessert', ownerId: 125, categories: ['BAKERY'], commission: 10, suspended: false },
  { id: 4, name: 'Flora Art', ownerId: 123, categories: ['FLOWERS', 'GIFTS'], commission: 10, suspended: false },
]

export const products: Product[] = [
  { id: 1, shopId: 1, name: "Rose 'Magic' Bouquet", category: 'FLOWERS', price: 390000, discount: 13, stock: 20, rating: 4.8, reviewCount: 45, imageUrl: IMAGES.rose, hidden: false },
  { id: 2, shopId: 1, name: 'Red Roses Bundle', category: 'FLOWERS', price: 120000, discount: 0, stock: 35, rating: 4.5, reviewCount: 28, imageUrl: IMAGES.red, hidden: false },
  { id: 3, shopId: 1, name: 'White Lily Bouquet', category: 'FLOWERS', price: 145000, discount: 10, stock: 18, rating: 4.6, reviewCount: 15, imageUrl: IMAGES.lily, hidden: false },
  { id: 4, shopId: 4, name: 'Spring Composition', category: 'FLOWERS', price: 420000, discount: 0, stock: 12, rating: 4.9, reviewCount: 62, imageUrl: IMAGES.spring, hidden: false },
  { id: 5, shopId: 3, name: 'Cinnamon Roll Bundle', category: 'BAKERY', price: 85000, discount: 0, stock: 0, rating: 4.7, reviewCount: 31, imageUrl: IMAGES.roll, hidden: false },
  { id: 6, shopId: 2, name: 'Luxury Flower & Sweet Hamper', category: 'GIFTS', price: 650000, discount: 5, stock: 8, rating: 4.9, reviewCount: 22, imageUrl: IMAGES.rose, hidden: false },
  { id: 7, shopId: 4, name: 'Tulip Basket', category: 'FLOWERS', price: 180000, discount: 0, stock: 14, rating: 4.4, reviewCount: 9, imageUrl: IMAGES.tulip, hidden: false },
  { id: 8, shopId: 2, name: 'Pastel Gift Bouquet', category: 'GIFTS', price: 260000, discount: 15, stock: 6, rating: 4.3, reviewCount: 7, imageUrl: IMAGES.bouquet, hidden: false },
]

export const orders: Order[] = [
  { id: 12, userId: 152, shopId: 1, items: "Rose 'Magic' Bouquet ×1", total: 339300, status: 'ACCEPTED', deliveryType: 'DELIVERY', createdAt: '2026-10-14T10:42:00' },
  { id: 11, userId: 131, shopId: 4, items: 'Spring Composition ×1, Tulip Basket ×1', total: 600000, status: 'PREPARING', deliveryType: 'DELIVERY', createdAt: '2026-10-14T09:15:00' },
  { id: 10, userId: 123, shopId: 2, items: 'Luxury Flower & Sweet Hamper ×1', total: 617500, status: 'IN_DELIVERY', deliveryType: 'DELIVERY', createdAt: '2026-10-13T18:30:00' },
  { id: 9, userId: 166, shopId: 3, items: 'Cinnamon Roll Bundle ×2', total: 170000, status: 'CANCELLED', deliveryType: 'PICKUP', createdAt: '2026-10-13T12:04:00' },
  { id: 8, userId: 140, shopId: 1, items: 'Red Roses Bundle ×2', total: 240000, status: 'COMPLETED', deliveryType: 'PICKUP', createdAt: '2026-10-12T16:20:00' },
  { id: 7, userId: 152, shopId: 2, items: 'Pastel Gift Bouquet ×1', total: 221000, status: 'COMPLETED', deliveryType: 'DELIVERY', createdAt: '2026-10-11T11:47:00' },
  { id: 6, userId: 124, shopId: 1, items: 'White Lily Bouquet ×1', total: 130500, status: 'COMPLETED', deliveryType: 'DELIVERY', createdAt: '2026-10-10T14:02:00' },
  { id: 5, userId: 131, shopId: 3, items: 'Cinnamon Roll Bundle ×1', total: 85000, status: 'ACCEPTED', deliveryType: 'PICKUP', createdAt: '2026-10-10T08:55:00' },
]

export const shopRequests: ShopRequest[] = [
  {
    id: 41, name: 'Bake & Bloom', ownerId: 123, categories: ['BAKERY', 'FLOWERS'],
    description: 'Morning pastries paired with small seasonal bouquets — a breakfast-gift shop.',
    phone: '+998 90 123 45 67', address: 'Tashkent, Yunusobod, Amir Temur Ave 107', legalEntity: 'LLC', stir: '305123987',
    status: 'PENDING', documents: DOCUMENTS, submittedAt: hoursAgo(2),
  },
  {
    id: 40, name: 'Tulip House', ownerId: 131, categories: ['FLOWERS'],
    description: 'Imported Dutch tulips and spring arrangements, delivered same day across Tashkent.',
    phone: '+998 91 777 30 21', address: "Tashkent, Mirzo Ulug'bek, Buyuk Ipak Yo'li 48", legalEntity: 'YATT', stir: '512904331',
    status: 'PENDING', documents: DOCUMENTS, submittedAt: hoursAgo(26),
  },
  {
    id: 38, name: 'Choco Lab', ownerId: 140, categories: ['GIFTS', 'BAKERY'],
    description: 'Hand-tempered chocolate boxes and custom gift sets.',
    phone: '+998 94 615 02 87', address: 'Tashkent, Chilonzor, 9-kvartal 14', legalEntity: 'YATT', stir: '487201556',
    status: 'PENDING', documents: DOCUMENTS, submittedAt: hoursAgo(50), resubmitted: true,
    previousNote: "STIR on the certificate didn't match the one in the form. Please re-check.",
  },
  {
    id: 36, name: "Sovg'a Market", ownerId: 123, categories: ['GIFTS'],
    description: 'Gift baskets for holidays and corporate orders.',
    phone: '+998 90 318 64 09', address: 'Tashkent, Shayxontohur, Navoiy St 30', legalEntity: 'LLC', stir: '309877412',
    status: 'CHANGES_REQUESTED', documents: DOCUMENTS, submittedAt: hoursAgo(120),
    note: 'The registration certificate photo is unreadable. Please upload a clear scan or PDF.',
  },
  {
    id: 33, name: 'Fast Flowers 24', ownerId: 166, categories: ['FLOWERS'],
    description: '24/7 flower delivery.',
    phone: '+998 97 120 45 33', address: 'Tashkent', legalEntity: 'YATT', stir: '100000000',
    status: 'REJECTED', documents: DOCUMENTS, submittedAt: hoursAgo(290),
    note: 'Duplicate of a previously blocked account. Documents could not be verified.',
  },
]
