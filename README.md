# PicLocket Frontend

The frontend for PicLocket, a cloud-native photo backup application.

Built with Next.js and TypeScript, it allows users to securely upload photos directly to Amazon S3 using presigned URLs while interacting with a Spring Boot backend deployed on Render.

## Live Demo

https://piclocket.vercel.app/

## Features

- JWT-authenticated upload workflow
- Direct browser uploads to Amazon S3
- Browse uploaded photos
- Download photos using presigned URLs
- Responsive UI
- Deployed on Vercel

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

The backend is maintained in a separate repository and provides:

- JWT authentication
- Presigned URL generation
- Amazon S3 integration
- Amazon SQS event processing
- Amazon RDS metadata storage

## Local Development

```bash
npm install
npm run dev
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

For production, point the variable to the deployed backend.

## Related Repository

Backend: [*GitHub*](https://github.com/SamanthaBurnett/PicLocket)
