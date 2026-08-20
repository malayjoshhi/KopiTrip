# KopiTrip Implementation TODO

## A. Rebrand to "KopiTrip"
- [x] 1. Update `app.json` (name, slug, scheme)
- [x] 2. Update `package.json` (name, description)
- [x] 3. Update `app/_layout.tsx` (Stack title)
- [x] 4. Update auth screens (`login.tsx`, `register.tsx`, `reset-password.tsx`) branding
- [x] 5. Update `app/(tabs)/profile.tsx` (About + version)
- [x] 6. Update `README.md` branding
- [x] 7. Update comments in `constants/Colors.ts`, `constants/Theme.ts`, `services/apiClient.ts`

## B. Generate KopiTrip Logo
- [x] 8. Create SVG logo source
- [x] 9. Generate `icon.png` (1024x1024)
- [x] 10. Generate `adaptive-icon.png` (1024x1024)
- [x] 11. Generate `splash-icon.png` (512x512)
- [x] 12. Generate `favicon.png` (48x48)

## C. Design Fixes
- [x] 13. Fix `app/destination/[id].tsx` (safe-area back button, InfoTile width, clean imports, attraction card styling)
- [x] 14. Add dark-mode support to `components/ui/Modal.tsx`
- [x] 15. Apply active/inactive tint to tab icons in `app/(tabs)/_layout.tsx`
- [x] 16. Use real flight times in `app/bookings.tsx`
- [x] 17. Improve modal scroll height in `app/(tabs)/explore.tsx`
- [x] 18. Type-check with `npx tsc --noEmit`
