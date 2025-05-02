This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Vercel Blob Storage Configuration

To enable file uploads in the admin panel, you need to configure Vercel Blob Storage:

1. Add the Vercel Blob Storage integration to your project
   - Go to your Vercel project dashboard
   - Navigate to Settings → Integrations
   - Find and add "Vercel Blob" integration

2. Once the integration is added, Vercel will automatically create a `BLOB_READ_WRITE_TOKEN` environment variable

3. Add this environment variable to your local development environment by adding it to your `.env.local` file:
   ```
   BLOB_READ_WRITE_TOKEN=your-blob-token-from-vercel
   ```

4. Rebuild and deploy your project

File uploads in the admin gallery will now properly store files in Vercel Blob Storage instead of trying to write to the filesystem, which isn't supported in serverless environments.
# Kenan-sWebsite
