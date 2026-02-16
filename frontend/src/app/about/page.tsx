import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SkillBadge from '@/components/SkillBadge';
import { getPortfolioContent } from '@/lib/bff';

export const metadata = {
  title: 'About Me | Modern Portfolio',
  description: 'Learn more about my background and skills',
};

export default async function About() {
  const content = await getPortfolioContent();
  const frontendSkills = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML5/CSS3'];
  const backendSkills = ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'GraphQL'];
  const tools = ['Git', 'Docker', 'AWS', 'Vercel', 'GitHub', 'VS Code'];

  return (
    <>
      <Navigation displayName={content.site.displayName} />
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-12 md:pt-32 md:pb-20">
          {/* Header */}
          <section className="mb-20 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About me</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full mb-6" />
            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
              I'm a full-stack developer passionate about creating beautiful, performant web applications. With over 3 years of experience, I've worked with startups, individuals, and organizations to bring their ideas to life.
            </p>
          </section>

          {/* Background */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Background</h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
              <p>
                My journey in web development started with curiosity. I became fascinated by how websites work and decided to learn programming. What began as a hobby quickly evolved into a full-time career where I've had the privilege of working with exceptional teams and talented individuals.
              </p>
              <p>
                I specialize in building scalable web applications using modern technologies like React, Next.js, and Node.js. I'm passionate about writing clean, maintainable code and following best practices in web development. Performance, accessibility, and user experience are at the heart of everything I build.
              </p>
              <p>
                Beyond coding, I stay updated with industry trends, contribute to open-source projects, and mentor junior developers. I believe in continuous learning and sharing knowledge with the community.
              </p>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Skills</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {frontendSkills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} level="advanced" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {backendSkills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} level="advanced" />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <SkillBadge key={tool} skill={tool} level="expert" />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Experience</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Senior Frontend Developer',
                  company: 'Tech Company Inc.',
                  period: '2022 - Present',
                  description: 'Leading frontend development for multiple high-impact projects, mentoring junior developers, and implementing best practices across the engineering team.',
                },
                {
                  title: 'Full Stack Developer',
                  company: 'Digital Agency Co.',
                  period: '2020 - 2022',
                  description: 'Developed full-stack web applications, managed databases, and deployed applications to production. Collaborated with design and product teams.',
                },
                {
                  title: 'Junior Web Developer',
                  company: 'Startup Studio',
                  period: '2018 - 2020',
                  description: 'Assisted in developing responsive websites and web applications using modern frameworks. Learned best practices and contributed to team projects.',
                },
              ].map((exp, index) => (
                <div key={index} className="glass-effect rounded-lg p-6 border border-blue-200/30 dark:border-blue-900/30 hover:bg-blue-100/20 dark:hover:bg-blue-900/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{exp.title}</h3>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">{exp.period}</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{exp.company}</p>
                  <p className="text-zinc-700 dark:text-zinc-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="glass-effect rounded-2xl p-12 md:p-16 text-center bg-gradient-to-br from-blue-600/5 to-pink-600/5 dark:from-blue-900/10 dark:to-pink-900/10 border border-blue-200/30 dark:border-blue-900/30">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">Let's work together</h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6 max-w-2xl mx-auto">
              Interested in collaborating? I'd love to hear about your project and discuss how I can help.
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Get in Touch
            </a>
          </section>
        </div>
      </main>
      <Footer
        displayName={content.site.displayName}
        contactEmail={content.site.contactEmail}
        socialLinks={content.socialLinks}
      />
    </>
  );
}
