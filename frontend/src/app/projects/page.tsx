import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import data from '@/data/portfolio.json';

export const metadata = {
  title: 'Demos | Modern Portfolio',
  description: 'View my latest demo applications and projects',
};

export default function Projects() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 md:pt-32 md:pb-20">
          <section className="mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Demo Applications</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full mb-6" />
            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
              A collection of my latest projects across different technologies and industries. Each project represents a unique challenge and showcases my approach to building quality software.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.projects.map((project) => (
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
        </div>
      </main>
      <Footer />
    </>
  );
}
