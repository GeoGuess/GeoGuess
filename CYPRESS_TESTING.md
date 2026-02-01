# Cypress Testing Guide

This document explains how to run Cypress tests after the Vue 3 migration.

## Prerequisites

1. **Environment Variables**: Create a `.env` file with your Firebase and Google Maps credentials:
   ```bash
   cp .env.dist .env
   # Edit .env and fill in your credentials
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Running Tests

### Option 1: Interactive Mode (Cypress UI)
```bash
npm run serve &  # Start dev server in background
npm run cypress open  # Open Cypress UI
```

### Option 2: Headless Mode
```bash
npm run serve &  # Start dev server in background
npm run test:e2e  # Run all tests headless
```

## What Was Fixed

### 1. Linter Warnings ✅
- Fixed console.error warning in `src/main.js` with eslint-disable comment
- All linter warnings resolved

### 2. Firebase v10 Migration ✅
- Updated `tests/e2e/support/commands.js` to use Firebase v10 modular API
- Changed from:
  - `firebase.database().ref()` → `ref(getDatabase(), path)`
  - `firebase.database.ServerValue.TIMESTAMP` → `serverTimestamp()`
  
### 3. Environment Variables ✅
- Updated from `VUE_APP_*` → `VITE_APP_*` prefix
- Updated Cypress plugin to filter and pass VITE_ variables

## Test Files

- `tests/e2e/specs/homePage.test.js` - Home page language tests
- `tests/e2e/specs/game/gameSingleClassic.test.js` - Classic mode tests
- `tests/e2e/specs/game/gameSingleCountry.test.js` - Country mode tests
- `tests/e2e/specs/game/gameSingleTime.test.js` - Time mode tests
- `tests/e2e/specs/game/gameSingleClassicSmartphone.test.js` - Mobile tests
- `tests/e2e/specs/game/multi.test.js` - Multiplayer tests

## Troubleshooting

### Tests fail with Firebase errors
- Verify your `.env` file has valid Firebase credentials
- Check that Firebase project allows database access

### Tests fail with "baseUrl" errors
- Ensure dev server is running on port 8080
- Check `cypress.config.js` baseUrl setting

### Import errors in commands.js
- Firebase v10 uses modular imports - this has been updated
- Ensure Firebase v10.x is installed in package.json
