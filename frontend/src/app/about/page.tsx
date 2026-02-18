import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SkillBadge from '@/components/SkillBadge';
import { getPortfolioContentSafe } from '@/lib/bff';
import BffUnavailable from '@/components/BffUnavailable';

export const metadata = {
  title: 'About Me | Modern Portfolio',
  description: 'Learn more about my background and skills',
};

export default async function About() {
  const { content, error } = await getPortfolioContentSafe();
  if (!content) {
    return <BffUnavailable error={error} />;
  }
  const frontendSkills = ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML/CSS'];
  const backendSkills = ['Python', 'Django/DRF', 'C#/.NET 8', 'REST APIs', 'SQL (MySQL)'];
  const systemsSkills = ['Kafka (event-driven)', 'Docker', 'Docker Compose', 'Git/GitHub'];

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
              I’m a full-stack developer focused on clear architecture, reliable systems, and thoughtful UX. My path has been non-linear due to life circumstances, but I’ve used that time to build real projects end-to-end—frontend, backend, messaging, and deployment.
            </p>
          </section>

          {/* Background */}
          <section className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Background</h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
              <p>
                I build systems that are easy to run, easy to reason about, and honest about their constraints. I prefer explicit contracts, clean boundaries, and developer workflows that don’t surprise you.
              </p>
              <p>
                I care about polish, but I care more about correctness and maintainability. My goal is to ship code that another engineer can pick up quickly and trust.
              </p>
              <p>
                I have Tourette’s, so I’m looking for remote-first roles with minimal travel and a calm work environment. I’m comfortable trading some compensation for a sustainable, low-distraction setup.
                I’m open to relocation for the right fit, but I’m not able to commute daily.
                I’m currently seeking part-time or contract roles.
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
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Systems</h3>
                <div className="flex flex-wrap gap-2">
                  {systemsSkills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} level="expert" />
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
                  title: 'Software Engineer',
                  company: 'Gozynta LLC (Remote)',
                  period: 'May 2021 - Dec 2022',
                  description: 'Full-stack software engineer working remotely on product features and maintenance.',
                },
                {
                  title: "Teacher's Assistant",
                  company: 'CodingDojo (Seattle, WA)',
                  period: 'Sep 2016 - 2020',
                  description: 'Troubleshot code and software issues, collaborated on projects, and documented coursework across multiple languages and frameworks.',
                },
                {
                  title: 'Advanced Repair Agent',
                  company: 'Best Buy (Glendora, CA)',
                  period: 'Aug 2015 - Jun 2016',
                  description: 'Diagnosed and repaired Windows/OSX/Linux systems, removed malware, and documented customer issues clearly.',
                },
                {
                  title: 'Professional Tutor',
                  company: 'Self-Employed (San Dimas, CA)',
                  period: 'Sep 2012 - Aug 2015',
                  description: 'STEM tutoring focused on improving student performance and identifying learning patterns.',
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
