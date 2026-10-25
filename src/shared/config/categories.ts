export const CATEGORIES = ['FLOWERS', 'GIFTS', 'BAKERY'] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_META: Record<Category, { emoji: string; label: string }> = {
  FLOWERS: { emoji: '🌸', label: 'Flowers' },
  GIFTS: { emoji: '🎁', label: 'Gifts' },
  BAKERY: { emoji: '🎂', label: 'Bakery' },
}

export const categoryLabel = (c: Category) => CATEGORY_META[c].label
export const categoryEmoji = (c: Category) => CATEGORY_META[c].emoji
export const categoryWithEmoji = (c: Category) => `${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label}`
