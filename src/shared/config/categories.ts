export const CATEGORIES = ['FLOWERS', 'GIFTS', 'BAKERY'] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_EMOJI: Record<Category, string> = {
  FLOWERS: '🌸',
  GIFTS: '🎁',
  BAKERY: '🎂',
}

export const categoryEmoji = (c: Category) => CATEGORY_EMOJI[c]
