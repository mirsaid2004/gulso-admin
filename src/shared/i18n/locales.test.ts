import { describe, expect, it } from 'vitest'
import en from './locales/en.json'
import ru from './locales/ru.json'
import uz from './locales/uz.json'

type Tree = { [key: string]: string | Tree }

/** Flattens to dotted keys, folding plural suffixes so "x_one"/"x_few" all count as "x". */
function keys(tree: Tree, prefix = ''): Set<string> {
  const out = new Set<string>()
  for (const [k, v] of Object.entries(tree)) {
    const path = `${prefix}${k.replace(/_(zero|one|two|few|many|other)$/, '')}`
    if (typeof v === 'string') out.add(path)
    else keys(v, `${path}.`).forEach((x) => out.add(x))
  }
  return out
}

function placeholders(tree: Tree, prefix = '', out = new Map<string, string>()): Map<string, string> {
  for (const [k, v] of Object.entries(tree)) {
    const path = `${prefix}${k.replace(/_(zero|one|two|few|many|other)$/, '')}`
    if (typeof v === 'string') out.set(path, [...v.matchAll(/{{(\w+)}}/g)].map((m) => m[1]).sort().join(','))
    else placeholders(v, `${path}.`, out)
  }
  return out
}

describe('locales', () => {
  const base = keys(en)

  it.each([
    ['uz', uz],
    ['ru', ru],
  ])('%s has exactly the same keys as en', (_lng, locale) => {
    const other = keys(locale as Tree)
    expect([...base].filter((k) => !other.has(k))).toEqual([])
    expect([...other].filter((k) => !base.has(k))).toEqual([])
  })

  it.each([
    ['uz', uz],
    ['ru', ru],
  ])('%s uses the same interpolation variables as en', (_lng, locale) => {
    const enVars = placeholders(en)
    const mismatched = [...placeholders(locale as Tree)].filter(([k, vars]) => enVars.get(k) !== vars)
    expect(mismatched).toEqual([])
  })

  it('ru defines every Russian plural form it uses', () => {
    const flat = JSON.stringify(ru)
    for (const key of ['pendingRequests', 'existing', 'changes']) {
      for (const form of ['one', 'few', 'many', 'other']) expect(flat).toContain(`"${key}_${form}"`)
    }
  })
})
