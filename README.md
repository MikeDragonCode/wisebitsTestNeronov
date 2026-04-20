# demoqa Test Suite

Playwright + TypeScript test suite for [demoqa.com](https://demoqa.com).

## Structure

```
src/
  pages/     # Page Object classes
  api/       # API client classes
  types/     # TypeScript interfaces and type guards
  config.ts  # Environment configuration
tests/
  ui/        # UI tests (Web Tables)
  api/       # API tests (Account, BookStore)
  fixtures/  # Custom Playwright fixtures
```

## Running tests

```bash
npm install
npx playwright install chromium

# All tests (requires live demoqa credentials)
npx playwright test

# UI + smoke API only (no credentials needed)
npx playwright test --grep-invert @live

# UI only
npx playwright test --project=ui

# API only
npx playwright test --project=api
```

## Test tags

| Tag | Meaning |
|-----|---------|
| `@live` | Requires a demoqa account with a working token. Requires live access to demoqa.com — CI runners get blocked. |
| _(no tag)_ | Runs anywhere, no auth needed. |

## CI

GitHub Actions runs only tests without `@live` tag on every push to `main`.

`@live` tests are designed to run locally or in an environment with direct access to demoqa.com.

## Environment variables

For `@live` tests, set these in `.env` or GitHub Actions secrets:

| Variable | Description |
|----------|-------------|
| `TEST_USER` | demoqa username (must be registered via UI, not API) |
| `TEST_PASSWORD` | demoqa password |
| `TEST_USER_ID` | demoqa user UUID |

demoqa.com issues tokens only for accounts registered through its web UI. Accounts created via API don't work for token generation.
