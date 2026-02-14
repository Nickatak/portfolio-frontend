interface SkillBadgeProps {
  skill: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export default function SkillBadge({ skill, level = 'intermediate' }: SkillBadgeProps) {
  const levelColors = {
    beginner: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    intermediate: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    advanced: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    expert: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };

  return (
    <span className={`inline-block ${levelColors[level]} px-4 py-2 rounded-full font-medium text-sm`}>
      {skill}
    </span>
  );
}
