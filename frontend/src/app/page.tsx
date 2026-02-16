import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import SkillsPreview from '@/components/SkillsPreview';
import { getPortfolioContent } from '@/lib/bff';

export const metadata = {
  title: 'Modern Portfolio | Full Stack Developer',
  description: 'Showcase of my web development projects and skills',
};

export default async function Home() {
  const content = await getPortfolioContent();

  return (
    <>
      <Navigation displayName={content.site.displayName} />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
              Building beautiful
              <br />
              <span className="bg-gradient-text">digital experiences</span>
            </h1>
            
              <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed mb-8">
              Hi! I'm {content.site.displayName}, I'm a full-stack developer crafting modern web applications and automation tools with various combinations of tech stacks. I create performant, maintainable, accessible, and visually stunning digital products.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/projects"
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
              >
                View Demo Applications
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7m10 0v10" />
                </svg>
              </a>
              <a
                href="/contact"
                className="px-8 py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.stats.map((stat, index) => (
              <div
                key={index}
                className="glass-effect p-8 rounded-xl text-center hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:animate-float">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-text">
                  {stat.number}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Demo Applications</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {content.projects.slice(0, 4).map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                link={project.link}
                github={project.github}
              />
            ))}
          </div>
          
          <div className="text-center">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
            >
              Explore all projects
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>

        {/* Skills Preview */}
        <SkillsPreview skills={content.skills} />

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 mb-12">
          <div className="glass-effect rounded-2xl p-12 md:p-16 text-center bg-gradient-to-br from-blue-600/5 to-pink-600/5 dark:from-blue-900/10 dark:to-pink-900/10 border border-blue-200/30 dark:border-blue-900/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ready to create something great?</h2>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8 max-w-2xl mx-auto">
              I'm always interested in hearing about new projects and opportunities.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Let's Talk
            </a>
          </div>
        </section>
      </main>
      <Footer
        displayName={content.site.displayName}
        contactEmail={content.site.contactEmail}
        socialLinks={content.socialLinks}
      />
    </>
  );
}
