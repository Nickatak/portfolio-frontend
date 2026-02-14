interface SkillsPreviewProps {
  skills: string[];
}

export default function SkillsPreview({ skills }: SkillsPreviewProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Skills & Tools</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <div
            key={skill}
            className="glass-effect p-4 rounded-lg text-center font-medium text-zinc-800 dark:text-zinc-200 hover:bg-blue-100/20 dark:hover:bg-blue-900/20 transition-all duration-200 group cursor-pointer"
          >
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
}
