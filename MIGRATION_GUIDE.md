# Vue 2 to Vue 3 Migration Guide

This document describes the migration from Vue 2 to Vue 3 and the changes required for deployment.

## Environment Variables

**IMPORTANT**: Environment variable prefix has changed from `VUE_APP_` to `VITE_APP_`

If you have a `.env` file or environment variables set, you need to update them:

### Old (Vue 2 / Vue CLI)
```
VUE_APP_API_KEY=your_key
VUE_APP_FIREBASE_API_KEY=your_key
VUE_APP_FIREBASE_PROJECT_ID=your_project_id
...
```

### New (Vue 3 / Vite)
```
VITE_APP_API_KEY=your_key
VITE_APP_FIREBASE_API_KEY=your_key
VITE_APP_FIREBASE_PROJECT_ID=your_project_id
...
```

## Build System Changes

The project has been migrated from Vue CLI to Vite:

- **Build command**: `npm run build` (unchanged)
- **Dev server**: `npm run serve` (unchanged)
- **Preview**: `npm run preview` (new - preview production build locally)

## Major Dependency Updates

- Vue: 2.7.0 → 3.5.13
- Vue Router: 3.6.5 → 4.5.0
- Vuex: 3.6.0 → 4.1.0
- Vuetify: 2.7.2 → 3.7.4
- Vue I18n: 8.28.2 → 9.14.5
- Firebase: 8.10.1 → 10.14.1

## Removed Dependencies

- `vue-cli-service` and all Vue CLI plugins (replaced with Vite)
- `gmap-vue` (replaced with `@googlemaps/js-api-loader`)
- `vue-clipboard2` (replaced with `vue-clipboard3`)
- `vue-country-flag` (replaced with `vue-country-flag-next`)
- `vue-axios` (axios is used directly)

## Breaking Changes

### For Developers

1. **Import statements** now require explicit file extensions:
   ```js
   // Old
   import MyComponent from '@/components/MyComponent'
   
   // New
   import MyComponent from '@/components/MyComponent.vue'
   ```

2. **Lifecycle hooks** renamed:
   - `beforeDestroy` → `beforeUnmount`
   - `destroyed` → `unmounted`

3. **`.sync` modifier** replaced:
   ```vue
   <!-- Old -->
   <Component :prop.sync="value" />
   
   <!-- New -->
   <Component v-model:prop="value" />
   ```

4. **Firebase API** changed to modular:
   ```js
   // Old
   import firebase from 'firebase/app'
   import 'firebase/database'
   const db = firebase.database()
   
   // New
   import { getDatabase, ref } from 'firebase/database'
   const db = getDatabase()
   const dbRef = ref(db, 'path')
   ```

## Deployment Notes

### Environment Setup

1. Copy `.env.dist` to `.env`
2. Update all environment variable names from `VUE_APP_*` to `VITE_APP_*`
3. Fill in your API keys and configuration

### CI/CD Updates

If you have CI/CD pipelines, update:

1. Environment variable names (VUE_APP → VITE_APP)
2. Build commands remain the same
3. Output directory is now `dist/` (unchanged)

### Docker

The existing Docker setup should work with minimal changes. Just ensure environment variables use the VITE_APP prefix.

## Testing

Unit tests will need to be updated to use Vue 3 test utilities (`@vue/test-utils` v2).

## Rollback Plan

If you need to rollback:

1. Checkout the commit before this migration
2. Restore the old `.env` file with `VUE_APP_` prefix
3. Run `npm install` to restore Vue 2 dependencies
4. Build and deploy as before

## Support

For issues related to this migration, please check:

1. This migration guide
2. Vue 3 migration guide: https://v3-migration.vuejs.org/
3. Vite documentation: https://vitejs.dev/
4. Vuetify 3 documentation: https://vuetifyjs.com/
