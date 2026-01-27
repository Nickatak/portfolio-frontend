<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Portfolio Project Context

This is a modern web development portfolio application built with Next.js, TypeScript, and Tailwind CSS.

### Project Structure
- `src/app/` - Next.js App Router pages (home, projects, about, contact)
- `src/components/` - Reusable React components (Navigation, Footer, ProjectCard, SkillBadge)
- `src/app/globals.css` - Global Tailwind CSS styles
- `package.json` - Dependencies and scripts

### Key Technologies
- Next.js 16+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality

### Development Guidelines

1. **Page Structure**: All pages are in `src/app/` following Next.js App Router conventions
2. **Components**: Reusable components in `src/components/` use TypeScript and props interfaces
3. **Styling**: Use Tailwind CSS utility classes for all styling
4. **Dark Mode**: Components support dark mode using `dark:` prefix in Tailwind classes
5. **Client Components**: Use `'use client'` directive only when needed (e.g., forms, interactive features)
6. **Metadata**: Use `export const metadata` in Server Components for SEO

### Customization Points

**Content Updates:**
- Edit `src/app/page.tsx` for home page content
- Edit `src/app/projects/page.tsx` to update projects list
- Edit `src/app/about/page.tsx` for background and skills
- Edit `src/app/contact/page.tsx` for contact information

**Styling:**
- Use `tailwind.config.ts` to customize Tailwind theme
- Update color schemes in component files using Tailwind classes
- Modify responsive breakpoints as needed

**Adding Features:**
- Create new page directories in `src/app/`
- Add new components to `src/components/`
- Follow existing component patterns and TypeScript interfaces

### Useful Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run start` - Start production server

### Common Tasks

**Update Project Information:**
1. Edit hero section in `src/app/page.tsx`
2. Update social links in `src/components/Footer.tsx`
3. Modify projects list in `src/app/projects/page.tsx`
4. Update skills in `src/app/about/page.tsx`

**Deploy Changes:**
1. Ensure no build errors: `npm run build`
2. Test locally: `npm run dev`
3. Push to Git and deploy via Vercel or preferred platform

### Project Configuration
- TypeScript: Enabled with `tsconfig.json`
- Tailwind CSS: Configured with `tailwind.config.ts`
- ESLint: Configured with `eslint.config.mjs`
- PostCSS: Configured with `postcss.config.mjs`
