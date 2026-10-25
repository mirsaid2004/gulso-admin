export type { Product, ProductPatch, ProductStatus } from './model/types'
export { discountedPrice, getProductStatus, getProductBadge, type ProductBadgeKey } from './lib/product'
export { productApi } from './api/productApi'
export { productKeys, useProductsQuery, useUpdateProductMutation } from './api/queries'
