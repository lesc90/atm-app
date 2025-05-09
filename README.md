## Getting Started

To run the app locally:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser.

## Test Users
You can log in using any of the following test PINs:

- `1234`
- `1111`
- `2222`

These correspond to mock user accounts defined in `public/data.json`, each with a different name and balance.

## Running Unit Tests
Unit tests are included using Jest
```bash
npm run test
```

## Project Directory

* app/ – Next.js App Router pages and components

* app/api/ – Handles login and account balance API routes (GET and POST)

* public/data.json – Mock user data (acts as a fake DB)

* context/AuthContext.tsx – Global user/auth state
