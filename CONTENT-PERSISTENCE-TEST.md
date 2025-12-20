# Content Persistence Test Guide

## Overview
This guide helps you test that both settings and page content are properly persisting across devices using the database-first approach.

## Quick Test Steps

### 1. Test Settings Persistence
1. Go to `http://localhost:5001/admin/page-editor`
2. Select "Logo Settings" 
3. Change the logo (e.g., change background color to green)
4. Save changes
5. Open site on mobile: `http://192.168.x.x:5001`
6. ✅ Logo should show the new color

### 2. Test Content Persistence  
1. Go to `http://localhost:5001/admin/page-editor`
2. Select "Homepage"
3. Edit the hero section title (e.g., add "TEST" to the end)
4. Save changes
5. Go to homepage: `http://localhost:5001/`
6. ✅ New title should appear
7. Open on mobile: `http://192.168.x.x:5001`
8. ✅ Same new title should appear on mobile

### 3. Cross-Device Test
1. Make changes on Device A (desktop)
2. Wait 5 seconds
3. Refresh on Device B (mobile)
4. ✅ Changes should appear immediately

## Automated Testing

Visit: `http://localhost:5001/settings-test`

This page will automatically test:
- API connectivity
- Settings loading from database
- Content loading from database  
- Settings saving to database
- Content saving to database
- Cross-device persistence

## Debug Endpoints

- **Settings Test**: `GET /settings-test`
- **API Test**: `GET /api/test`
- **Logo Simple**: `GET /api/logo-simple`
- **Settings Sync**: `GET /api/settings-sync`
- **Content Sync**: `GET /api/content-sync`

## Troubleshooting

### Settings Not Persisting
1. Check browser console for errors
2. Visit `/settings-test` and check results
3. Verify database connection in server logs
4. Check if `websiteSettings` table exists

### Content Not Persisting
1. Check browser console for errors
2. Visit `/settings-test` and test content functions
3. Verify database connection in server logs
4. Check if `pageContents` table exists

### Mobile Not Showing Changes
1. Ensure mobile is on same WiFi network
2. Use exact IP from server startup logs
3. Try hard refresh on mobile (clear cache)
4. Check mobile browser console for errors

## Expected Behavior

### Before Fix
- Settings stored in localStorage only
- Content stored in localStorage only
- Changes didn't appear on other devices
- Mobile showed default settings/content

### After Fix
- Settings stored in database first
- Content stored in database first
- localStorage used only as cache
- Changes appear on all devices immediately
- Mobile shows same content as desktop

## Database Tables Used

1. **websiteSettings**: Stores logo, theme, and other site settings
2. **pageContents**: Stores all page content (home, about, etc.)

## Key Files Changed

### Frontend
- `client/src/lib/content-store.ts` - Database-first content management
- `client/src/lib/settings-store.ts` - Global settings management
- `client/src/pages/admin/page-editor-functional.tsx` - Updated to use database
- `client/src/App.tsx` - Initialize stores on startup

### Backend  
- `server/routes.ts` - Enhanced content and settings endpoints
- `server/index.ts` - Added debug endpoints
- `server/storage.ts` - Database operations

## Verification Checklist

- [ ] Logo changes persist across devices
- [ ] Homepage content changes persist across devices
- [ ] About page content changes persist across devices
- [ ] Settings survive browser restart
- [ ] Content survives browser restart
- [ ] Mobile shows same content as desktop
- [ ] Changes appear on mobile within 5 seconds
- [ ] No console errors in browser
- [ ] Test page shows all tests passing
- [ ] Database contains actual data (not just localStorage)

## Performance Notes

- Content is cached after first load
- Database queries are minimal
- Auto-save prevents data loss
- Real-time updates across components

## Security Notes

- Content endpoints are protected where needed
- Database is single source of truth
- Proper error handling prevents data exposure
- User authentication maintained for admin functions