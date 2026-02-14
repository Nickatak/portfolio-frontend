import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

export default function ProjectCard({ title, description, tags, link, github }: ProjectCardProps) {
  return (
    <div className="group glass-effect rounded-xl p-6 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-lg border border-zinc-100/50 dark:border-zinc-800/50">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover:bg-gradient-text transition-all duration-300">
          {title}
        </h3>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10v10M7 17L17 7" />
            </svg>
          </a>
        )}
      </div>
      
      <p className="text-zinc-700 dark:text-zinc-300 mb-5 leading-relaxed text-sm md:text-base">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-2 group/link"
          >
            View Project
            <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2 group/github"
          >
            Code
            <svg className="w-3.5 h-3.5 group-hover/github:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
