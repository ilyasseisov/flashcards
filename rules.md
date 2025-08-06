# rules - Next.js 15+ App Router Development

# General Directives

# These rules set the overall context and preferences for Next.js 15+ development using the App Router.

---

globs:

- "\*_/_.js"

- "\*_/_.jsx"

- "\*_/_.ts"

- "\*_/_.tsx"

alwaysApply: true

---

# Primary Goal: Guide LLMs in providing intelligent, context-aware suggestions

# for Next.js 15+ App Router projects, embracing React Server Components (RSC) and Client Components.

# Emphasize modern Next.js architecture, file-based routing, and best practices.

rules:

# Next.js App Router Core Structures

# -----------------------------------

- When creating files in the `app/` directory or its subdirectories, prioritize App Router conventions.

  # Cursor should suggest:

  # - `layout.tsx`/`.jsx` for root layouts or nested layouts.

  # - `page.tsx`/`.jsx` for route segments.

  # - `loading.tsx`/`.jsx` for Suspense fallbacks.

  # - `error.tsx`/`.jsx` for error boundaries.

  # - `not-found.tsx`/`.jsx` for 404 pages.

- For `layout.tsx`/`.jsx` files:

  # Promote a default export `RootLayout` or `[Segment]Layout` component.

  # Suggest importing `React.ReactNode` for the `children` prop.

  # Guide towards adding `<html>` and `<body>` tags in the root layout if it's the top-level.

  # Example suggestion:

  # ```

  # export default function RootLayout({ children }: { children: React.ReactNode }) {

  # return (

  # <html lang="en">

  # <body>{children}</body>

  # </html>

  # );

  # }

  # ```

- For `page.tsx`/`.jsx` files:

  # Promote a default export `Page` or `[Segment]Page` component.

  # Suggest `async` functional components by default, as pages are Server Components by default.

  # Example suggestion:

  # ```

  # export default async function HomePage() {

  # // Server-side data fetching here

  # return (

  # <main>

  # <h1>Welcome to Next.js App Router!</h1>

  # </main>

  # );

  # }

  # ```

# Server Components (RSC) Guidance

# --------------------------------

- In files that are Server Components (e.g., `page.tsx`, `layout.tsx`, or any component not marked `'use client'`):

  # Encourage `async` functional components for direct data fetching.

  # Suggest using native `fetch` with `await` for server-side data fetching.

  # Remind about `next/cache` revalidation options.

  # Example suggestion for data fetching:

  # ```

  # async function getPosts() {

  # const res = await fetch('[https://api.example.com/posts](https://api.example.com/posts)', { next: { revalidate: 3600 } }); // Cache for 1 hour

  # if (!res.ok) throw new Error('Failed to fetch posts');

  # return res.json();

  # }

  # export default async function PostsPage() {

  # const posts = await getPosts();

  # return (

  # <div>

  # {posts.map(post => <p key={post.id}>{post.title}</p>)}

  # </div>

  # );

  # }

  # ```

- When defining data revalidation or dynamic behavior for Server Components:

  # Suggest `export const revalidate = [seconds];` (e.g., `revalidate = 60`) at the top level of the component file.

  # Suggest `export const dynamic = 'force-dynamic';` or `'auto'`.

# Client Components Guidance

# --------------------------

- When `'use client';` is present at the top of a file:

  # Prioritize standard React hooks: `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`.

  # Suggest imports from `next/navigation` for client-side routing hooks: `useRouter`, `usePathname`, `useSearchParams`.

  # Example suggestion for a client component:

  # ```

  # 'use client';

  # import { useState } from 'react';

  # import { useRouter } from 'next/navigation';

  # export default function ClientCounter() {

  # const [count, setCount] = useState(0);

  # const router = useRouter();

  # return (

  # <div>

  # <p>Count: {count}</p>

  # <button onClick={() => setCount(count + 1)}>Increment</button>

  # <button onClick={() => router.push('/dashboard')}>Go to Dashboard</button>

  # </div>

  # );

  # }

  # ```

# Next.js Specific APIs and Components

# ------------------------------------

- For internal navigation, suggest `import Link from 'next/link';` and using the `<Link>` component.

  # Guide towards using `href` prop for the path.

  # Example suggestion: `<Link href="/about">About Us</Link>`

- For optimized images, suggest `import Image from 'next/image';` and using the `<Image>` component.

  # Remind about `src`, `alt`, `width`, `height`, and `priority` props.

  # Example suggestion: `<Image src="/my-image.jpg" alt="My Image" width={500} height={300} />`

- For API Routes (in `app/api/`):

  # Suggest `export async function GET(request: Request) { ... }`, `POST`, `PUT`, `DELETE` handlers.

  # Promote using `NextResponse` for responses.

  # Example suggestion:

  # ```

  # import { NextResponse } from 'next/server';

  # export async function GET(request: Request) {

  # const { searchParams } = new URL(request.url);

  # const id = searchParams.get('id');

  # // ... fetch data ...

  # return NextResponse.json({ message: 'Hello from API', id });

  # }

  # ```

# Code Quality and Structure

# --------------------------

- Encourage modular, scalable folder structure within `app/`.

  # Suggest grouping related files (e.g., `app/dashboard/page.tsx`, `app/dashboard/layout.tsx`, `app/dashboard/error.tsx`).

  # Promote creating separate `components/`, `hooks/`, `utils/` directories outside `app/` for shared logic and UI.

- Promote clean separation of concerns:

  # Server Components for data fetching and initial rendering.

  # Client Components for interactivity and browser-specific APIs.

- Guide towards using TypeScript for type safety (`.ts`, `.tsx` files).

# Custom Placeholders for Project-Specific Technologies

# -----------------------------------------------------

# STYLING_TECHNOLOGY_PLACEHOLDER

# When generating or modifying CSS or styling in React/Next.js components, adhere to the following:

# Examples:

# - If using Tailwind CSS: Recommend directly applying Tailwind utility classes via `className="..."`.

# DATA_FETCHING_LIBRARY_PLACEHOLDER

# When fetching data in client components (or for specific patterns not covered by RSC fetch), adhere to the following:

# Examples:

# - If using plain `axios` in client components: Suggest `axios.get()`, `axios.post()`.

# STATE_MANAGEMENT_LIBRARY_PLACEHOLDER

# When managing global or complex client-side state, adhere to the following:

# Examples:

# - If using `Zustand`: Suggest `create` for store definition and using the store directly within client components.

# - If no specific library: Guide towards React Context API for shared client-side state.

# FORMS_LIBRARY_PLACEHOLDER

# When handling forms in client components, adhere to the following:

# Examples:

# - If using `React Hook Form`: Prioritize `useForm`, `register`, `handleSubmit`, and `Controller`.

# - If using `Formik`: Suggest `useFormik` hook or `Formik` component patterns.

# - If using plain HTML forms: Guide towards controlled components with `useState` and form submission handlers.

# ANIMATION_LIBRARY_PLACEHOLDER

# When adding animations to UI elements in client components, adhere to the following:

# Examples:

# - If using `Framer Motion`: Prioritize `motion` components and their props (`initial`, `animate`, `transition`).

# - If using `React Spring`: Suggest `useSpring` and `animated` components.

# - If using plain CSS animations: Suggest applying CSS classes conditionally.

# TESTING_FRAMEWORK_PLACEHOLDER

# When writing tests for Next.js components and API routes, adhere to the following:

# Examples:

# - If using `Jest` and `React Testing Library`: Prioritize `render`, `screen`, `expect`, querying methods, and mock Next.js modules.

# - If using `Cypress`: Suggest `cy.mount` for client component testing and `cy.request` for API routes.

# - For Server Component testing: Guide towards unit testing data fetching functions.

# UI_LIBRARY_PLACEHOLDER

# When using a UI component library, adhere to the following:

# Examples:

# - If no UI library: Suggest basic HTML elements styled via the chosen `STYLING_TECHNOLOGY_PLACEHOLDER`.

# Explicit Exclusions

# -------------------

- Actively **avoid suggestions** related to `getServerSideProps`, `getStaticProps`, `getInitialProps`.

- Do not suggest `_app.tsx` or `_document.tsx` conventions.

- Do not suggest `pages/` directory conventions for routing.

- Avoid generic React patterns that directly conflict with App Router's explicit Server/Client Component model.

# Tech stack

- NEXT JS 15
- TAILWIND CSS
- CLERK
- MONGO DB with MONGOOSE
- SHADCN UI
- STRIPE
- VERCEL (hosting)
