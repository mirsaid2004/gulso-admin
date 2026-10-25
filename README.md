# Gulso — Maintainer panel

Admin app for Gulso maintainers: review shop requests and moderate shops, products, orders and users.
Built from the "Maintainer Panel" Claude Design file, using the same theme tokens as `gulso-seller`.

## Scripts

```bash
cp .env.example .env   # VITE_API_MOCKING=enabled serves the API from MSW
npm run dev            # http://localhost:5173
npm test               # vitest (watch)
npm run test:run       # vitest, single run
npm run coverage
npm run build          # tsc -b && vite build
npm run lint           # oxlint
```

A Husky pre-commit hook (`.husky/pre-commit`) runs `lint` (warnings fail too), `typecheck` and `test:run`; any failure aborts the commit. `npm install` sets it up via the `prepare` script.

With mocking enabled, data lives in memory (`src/mocks/db.ts`) and resets on page reload.

## Architecture

[Feature-Sliced Design](https://feature-sliced.design) layers; each layer imports only from layers below it.

```
src/
  app/        providers, router (lazy routes), global styles
  pages/      one folder per route: model/ (view-model hook) + ui/ (page)
  widgets/    admin-layout (sidebar + header), shop-request-details
  features/   user actions: review-shop-request, edit-entity, moderate-shop,
              moderate-product, moderate-user, cancel-order
  entities/   shop-request, shop, product, order, user, viewer:
              model/ (types, constants), lib/ (pure helpers), api/ (fetchers + TanStack Query hooks), ui/
  shared/     api client, lib (format, search), config (routes, categories), ui kit, test utils
  mocks/      MSW handlers, seed data and in-memory db (browser worker + node server)
```

Import a slice through its `index.ts` (public API), never its internals.

### MVVM

- **Model**: entity types, API calls and query/mutation hooks (`entities/*/api`), plus pure domain helpers (`entities/*/lib`).
- **ViewModel**: one hook per page or feature (`useShopsViewModel`, `useReviewShopRequest`, `useEditDraft`…). It joins queries, holds UI state (search, tab, selection, drafts) and exposes ready-to-render data and commands.
- **View**: components that render what the view model returns and call its commands. No fetching or business rules in the views.

## i18n

Same setup as `gulso-seller`: i18next + react-i18next + the browser language detector. The panel supports **uz** (the fallback), **ru** and **en**. The chosen language is saved in `localStorage["admin-lang"]` and mirrored on `<html lang>`.

- Locales live in `src/shared/i18n/locales/*.json`, and keys are type-checked against `en.json` (`i18next.d.ts`). `locales.test.ts` fails if uz or ru has missing or extra keys, or different `{{placeholders}}`.
- In components and view-models, use `useLocale()` from `@/shared/i18n`. It returns `t`, the active `language`, `changeLanguage` and `money(n)` ("339 300 so'm").
- Domain helpers stay language-free: they return keys or kinds (`getProductBadge → { key }`, `getAge → { unit, count }`, `getOwnerTag → { kind }`), and the view-model translates them.
- Plurals use i18next suffixes. Russian needs `_one/_few/_many/_other`.
- Dates go through `formatDate`/`formatDateTime(iso, language)`. Browsers ship incomplete CLDR data for Uzbek, so Uzbek dates are formatted by hand.
- Data from the API (shop names, descriptions, notes, document titles) is shown as-is, not translated.
- The language switcher is `features/switch-language`, rendered in the header.

## API (served by MSW in dev and tests)

| Method | Path | |
| --- | --- | --- |
| GET | `/api/v1/admin/me` | current maintainer |
| GET | `/api/v1/admin/shop-requests` | all requests |
| POST | `/api/v1/admin/shop-requests/:id/approve` | opens the shop, grants the owner `SELLER` |
| POST | `/api/v1/admin/shop-requests/:id/request-changes` | body `{ note }` |
| POST | `/api/v1/admin/shop-requests/:id/reject` | body `{ note }` |
| GET / PATCH | `/api/v1/admin/{shops,products,orders,users}[/:id]` | list / partial update |

Responses use the `{ success, data, error? }` envelope, the same as the seller panel.

## Tests

Vitest + React Testing Library + jsdom. MSW's node server runs the real handlers, and the db resets after each test (`src/shared/test/setup.ts`).
Tests sit next to the code they cover (`*.test.ts(x)`):

- pure helpers: `shared/lib`, `entities/*/lib`, feature and page `model/` helpers
- hooks: `useEditDraft`, `useReviewShopRequest`, `useShopsViewModel`, `useShopRequestsViewModel`
- components: `SegmentedTabs`, `EditEntityDrawer`, plus page flows for Shop requests, Orders and Users

Use `renderWithProviders` / `renderHookWithProviders` from `@/shared/test/render` for anything that needs React Query or the router.
