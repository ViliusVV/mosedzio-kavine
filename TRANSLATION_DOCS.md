# Translation Docs

This file records translation context, renderer constraints, and previously agreed wording decisions for `src/data/menu.json`.

Use it before reviewing or editing menu translations so the same issues are not re-litigated repeatedly.

## Scope

- Main source file: `src/data/menu.json`
- Relevant renderers:
  - `src/components/menu.tsx`
  - `src/components/menu-web.tsx`

## Verified Renderer Behavior

These points were verified from the codebase and should be treated as source of truth for future reviews.

1. The public site locales are `lt`, `en`, and `lv`.
2. Menu translation fallback is not strict per-language completeness.
3. `src/components/menu.tsx` falls back in this order: active locale -> `en` -> `lt`.
4. `src/components/menu-web.tsx` falls back in this order: active locale -> `en` -> `lt` -> empty string.
5. The renderers use the singular key `note`, not `notes`.

## Review Rules

Apply these rules when reviewing menu translations.

1. Do not report missing locale variants as issues by default if the menu will render via fallback.
2. Only flag missing locale keys when the user explicitly wants full locale coverage or when a renderer/schema mismatch could hide content.
3. Treat `note` vs `notes` as a real issue, because that can prevent content from rendering.
4. Do not "correct" branding just because it is untranslated.
5. Prefer preserving local dish identity over flattening culturally specific items into generic wording.

## Agreed Translation Decisions

These were explicitly clarified and should be reused.

### Local dishes and regional terms

1. `spirginė`
Meaning to use in English: `hemp seed spread`
Notes:
- It is a very local regional item.
- It does not have a straightforward direct translation.
- Do not keep re-flagging this as an error when rendered as `hemp seed spread`.

2. `kąstinys` / `kastinys`
Preferred English: `Samogitian curd spread`
Avoid:
- `beaten cream`
- `beaten cream sauce`
- overly generic `local curd sauce`

3. `Žemaitiškas užkandis`
Preferred English direction: `Samogitian appetizer`
Notes:
- Do not translate this as a soup.
- The item includes local dishes, but the title itself is not a soup title.

### Product and menu wording

1. `Bulvių grotelės`
Preferred English: `Criss-cut fries`

2. Alcohol and cocktail branding
Rule:
- Branding may stay untranslated.
- Brand-style names such as `Screwdriver`, `Mojito`, `Aperol Spritz`, and similar cocktail names do not need forced localization.

## Latvian Notes

1. Replace malformed mixed-language wording like `žemaitišku` with proper Latvian `žemaišu`.
2. Use `smēriņš` / `smēriņu` for spread-like items where appropriate instead of `uzkandīte`.
3. Prefer natural menu phrasing over literal but awkward wording.

## Current Preferred Phrases

Use these as defaults unless the user asks for a different style.

| Source term | Preferred translation / wording |
|---|---|
| `spirginė` | `hemp seed spread` |
| `kąstinys` | `Samogitian curd spread` |
| `Žemaitiškas užkandis` | `Samogitian appetizer` |
| `Bulvių grotelės` | `Criss-cut fries` |
| `Alkoholiniai kokteiliai` | `Alcoholic cocktails` |

## What Not To Re-Flag

Unless the user asks otherwise, do not keep reopening these points as problems:

1. Missing locale variants by themselves, because menu rendering has fallback behavior.
2. Use of branding or untranslated cocktail/product names.
3. `spirginė` rendered as `hemp seed spread`.
4. `kąstinys` rendered as `Samogitian curd spread`.

## What Still Deserves Attention In Future Reviews

These categories are still worth checking when new edits are made.

1. `note` vs `notes`
2. grammar mistakes in Latvian, Lithuanian, or English
3. mistranslating dish type, for example turning an appetizer into a soup
4. losing important meaning like `with / without cheese`
5. introducing awkward menu English where a simple natural phrase exists

## Quick Checklist For Future Menu Reviews

1. Confirm the item meaning matches the source dish type.
2. Confirm the key is `note`, not `notes`.
3. Confirm any missing locale is acceptable under fallback behavior.
4. Preserve agreed local-food terminology.
5. Preserve brand naming unless the user asks to localize it.
