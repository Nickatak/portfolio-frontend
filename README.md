# Modern Portfolio Site

A modern, full-featured portfolio website built with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/). This project demonstrates contemporary web development practices by showcasing a complete portfolio experience integrated with a calendar scheduling system.

## Features

- **Responsive Design** - Mobile-first, fully responsive layout using Tailwind CSS
- **Dark Mode** - Built-in dark mode support with seamless theme switching
- **Integrated Calendar** - Schedule call functionality powered by a separate [calendar application](https://github.com/Nickatak/calendar)
- **TypeScript** - Full type safety throughout the codebase
- **SEO Optimized** - Metadata and semantic HTML for better search engine visibility
- **Production Ready** - Optimized builds and performance best practices
- **Google OAuth Integration** - Secure authentication for scheduling calls

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode
- **Authentication**: Google OAuth 2.0
- **Build Tool**: Turbopack
- **Linting**: ESLint
- **Testing**: Jest

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page
│   ├── about/page.tsx              # About section
│   ├── projects/page.tsx           # Projects showcase
│   ├── contact/page.tsx            # Contact & schedule call
│   ├── globals.css                 # Global styles
│   └── layout.tsx                  # Root layout
├── components/
│   ├── Navigation.tsx              # Header navigation
│   ├── Footer.tsx                  # Footer
│   ├── ProjectCard.tsx             # Reusable project card
│   ├── SkillBadge.tsx              # Skill badge component
│   ├── SkillsPreview.tsx           # Skills preview section
│   └── ScheduleCallSection/        # Calendar integration
│       ├── index.tsx               # Main component
│       ├── DateTimePickerSection.tsx
│       ├── AuthenticationSection.tsx
│       ├── ContactFormSection.tsx
│       ├── utils.ts                # Helper utilities
│       └── __tests__/              # Component tests
└── data/
    ├── portfolio.json              # Content data (copy from portfolio.example.json)
    ├── portfolio.example.json      # Template for portfolio content
    ├── social.json                 # Social links (copy from social.example.json)
    └── social.example.json         # Template for social links
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env.dev
   cp .env.example .env.prod
   
   # Edit with your actual values
   nano .env.dev      # for development
   nano .env.prod     # for production
   ```

   **Required variables:**
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Get from [Google Cloud Console](https://console.cloud.google.com/)

4. Set up portfolio data files:
   ```bash
   # Copy the example data files
   cp src/data/portfolio.example.json src/data/portfolio.json
   cp src/data/social.example.json src/data/social.json
   
   # Edit with your information
   nano src/data/portfolio.json    # Update your projects and skills
   nano src/data/social.json       # Update your social and contact links
   ```

5. Set the environment mode (see [Environment Management](#environment-management))

### Development

Start the development server:

```bash
make run
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

The page auto-updates as you edit files. TypeScript and ESLint checks run in the background.

### Production

Build for production:

```bash
make build
# or
npm run build
```

Start the production server:

```bash
make start
# or
npm run start
```

## Environment Management

This project uses a flexible environment system that supports both development and production configurations without committing sensitive data to version control.

### How It Works

- **`.env.example`** - Template file (committed to repo)
- **`.env.dev`** - Development environment variables (gitignored)
- **`.env.prod`** - Production environment variables (gitignored)
- **`.env`** - Symlink pointing to either `.env.dev` or `.env.prod` (gitignored)

### Switching Environments

Use the `toggle-env` script to switch between environments:

```bash
# Switch to development
make toggle-env-dev

# Switch to production
make toggle-env-prod

# Or run the script directly
./toggle-env.sh dev
./toggle-env.sh prod
```

The script creates a symlink from `.env` to the selected environment file. Next.js automatically picks up the `.env` file at startup.

### For Contributors

1. Copy and configure environment files:
   ```bash
   cp .env.example .env.dev
   cp .env.example .env.prod
   # Add your actual values
   ```
   
2. Copy and configure data files:
   ```bash
   cp src/data/portfolio.example.json src/data/portfolio.json
   cp src/data/social.example.json src/data/social.json
   # Customize with your information
   ```

3. Switch to development environment: `make toggle-env-dev`

4. Never commit `.env.dev`, `.env.prod`, `src/data/portfolio.json`, or `src/data/social.json`

## Calendar Integration

The project includes a `ScheduleCallSection` component that integrates with a separate [calendar scheduling application](https://github.com/Nickatak/calendar). This demonstrates:

- Component modularization and reusability
- Complex state management with React hooks
- Integration with external APIs
- Google OAuth authentication flow
- Form validation and user data handling
- Responsive UI with Tailwind CSS

The calendar backend runs on `http://localhost:8000` by default during development.

## Available Scripts

```bash
make help              # Show all available commands
make install           # Install dependencies
make run              # Start development server
make build            # Build for production
make start            # Start production server
make lint             # Run ESLint
make lint-fix         # Fix ESLint issues
make clean            # Remove build artifacts
make clean-all        # Clean + remove node_modules
make kill             # Kill process on port 3000
make toggle-env-dev   # Switch to development environment
make toggle-env-prod  # Switch to production environment
```

## Code Quality

### Linting

Lint your code:

```bash
make lint
```

Auto-fix linting issues:

```bash
make lint-fix
```

### Testing

Run tests:

```bash
npm test
```

Watch mode:

```bash
npm test -- --watch
```

## Customization

### Update Content

- **Home**: Edit `src/app/page.tsx`
- **About**: Edit `src/app/about/page.tsx` and update `src/data/portfolio.json`
- **Projects**: Edit `src/app/projects/page.tsx`
- **Contact**: Edit `src/app/contact/page.tsx` and update `src/data/social.json`

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Dark mode: Use `dark:` prefix in Tailwind classes

## Deployment

Deploy to [Vercel](https://vercel.com) (recommended):

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Important**: Set your environment variables in the Vercel project settings before deploying.

For other platforms, follow their documentation and ensure you set the required environment variables.

## License

MIT
