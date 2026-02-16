export interface PortfolioProject {
  id: number;
  slug?: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  github: string;
}

export interface PortfolioStat {
  number: string;
  label: string;
  icon: string;
}

export interface PortfolioContent {
  site: {
    name: string;
    displayName: string;
    contactEmail: string;
  };
  projects: PortfolioProject[];
  stats: PortfolioStat[];
  skills: string[];
  socialLinks: { name: string; url: string; icon: string }[];
  contactLinks: { icon: string; title: string; description: string; href: string }[];
}

const DEFAULT_BFF_BASE_URL = 'http://localhost:8001';

function getBffBaseUrl(): string {
  return (
    process.env.BFF_BASE_URL ||
    process.env.NEXT_PUBLIC_BFF_BASE_URL ||
    DEFAULT_BFF_BASE_URL
  );
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const baseUrl = getBffBaseUrl();
  const response = await fetch(`${baseUrl}/api/portfolio-content`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio content: ${response.status}`);
  }

  return response.json();
}

export async function getProject(project: string): Promise<PortfolioProject> {
  const baseUrl = getBffBaseUrl();
  const response = await fetch(`${baseUrl}/projects/${project}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.status}`);
  }

  return response.json();
}
