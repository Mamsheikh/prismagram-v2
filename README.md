# Prismagram-v2

Prismagram-v2 is a social media app built using the T3 stack (Tailwind, TRPC, Typescript, Next.js, Prisma) and Supabase's PostgreSQL for data storage. The app is hosted on Vercel. This version is an improvement of the original version that used GraphQL.

## Features

- User authentication
- User profiles
- User can post images
- User can like and comment on posts
- Light and dark mode
- Fully mobile responsive

## Technologies Used

- [Tailwind CSS](https://tailwindcss.com/)
- [TRPC](https://trpc.io/)
- [Typescript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.io/)
- [Vercel](https://vercel.com/)

## Getting Started

To get started with this project, you will need to:

1. Clone the repository: `git clone https://github.com/Mamsheikh/prismagram-v2.git`
2. Install dependencies: `npm install`
3. Set up your Supabase account and configure the PostgreSQL database
4. Set up your environment variables: `cp .env.example .env.local` and add your Supabase credentials
5. Run the development server: `npm run dev`

## Deployment

To deploy your own instance of Prismagram-v2, you can follow the steps below:

1. Set up your Vercel account
2. Configure your environment variables for production: `vercel env add`
3. Deploy your app to Vercel: `vercel`

## License

Prismagram-v2 is released under the [MIT License](https://opensource.org/licenses/MIT).
