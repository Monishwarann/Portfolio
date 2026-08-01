import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Github,
  Activity,
  GitBranch,
  Star,
  Users,
  Eye,
  Code2,
  Calendar,
  ExternalLink,
  FolderGit2,
  GitFork,
  AlertCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// GitHub Configuration
const GITHUB_USERNAME = "Monishwarann";
const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

// Auto-refresh interval (5 minutes)
const REFRESH_INTERVAL_MS = 300000;

// Pagination Configuration
const REPOS_PER_PAGE = 6;

// Types
interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string;
  html_url: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  fork: boolean;
  size: number;
  watchers_count: number;
  open_issues_count: number;
}

interface RepoDisplay {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
  updatedAt: string;
  watchers: number;
  openIssues: number;
  size: number;
}

interface GitHubStats {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  languages: { name: string; value: number; color: string }[];
  allRepos: RepoDisplay[];
  topReposByStars: { name: string; stars: number }[];
}

// GitHub Language Colors
const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Vue: "#41b883",
  SCSS: "#c6538c",
  Dart: "#00B4AB",
  Jupyter: "#DA5B0B",
};

// Chart Colors
const CHART_COLORS = {
  primary: "#06b6d4",
  secondary: "#8b5cf6",
  tertiary: "#f59e0b",
  quaternary: "#10b981",
};

const PIE_COLORS = [
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#ec4899",
  "#3b82f6",
  "#14b8a6",
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

// Custom Tooltip Component
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  delay?: number;
}> = ({ icon: Icon, label, value, change, positive = true, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.03, y: -5 }}
    className="relative group p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        {change && (
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              positive ? "text-green-400" : "text-red-400"
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${!positive && "rotate-180"}`} />
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </h3>
      <p className="text-gray-400 text-sm font-medium">{label}</p>
    </div>
  </motion.div>
);

// Chart Card Component
const ChartCard: React.FC<{
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon: Icon = Activity, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className={`p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 ${className}`}
  >
    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
      <Icon className="w-5 h-5 text-cyan-400" />
      {title}
    </h3>
    {children}
  </motion.div>
);

// Error Card Component
const ErrorCard: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-center"
  >
    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
    <p className="text-red-300 mb-2">{message}</p>
    <p className="text-gray-400 text-sm">
      The page will automatically retry when you return to this tab
    </p>
  </motion.div>
);

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {getPageNumbers().map((page, index) => (
        <motion.button
          key={index}
          whileHover={typeof page === "number" ? { scale: 1.05 } : {}}
          whileTap={typeof page === "number" ? { scale: 0.95 } : {}}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${
            page === currentPage
              ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
              : page === "..."
                ? "bg-transparent text-gray-500 cursor-default"
                : "bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400"
          }`}
        >
          {page}
        </motion.button>
      ))}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

const StatsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitialLoad = useRef(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build request headers with optional auth
  const getHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }
    return headers;
  }, []);

  // Fetch all pages of public repos (handles GitHub pagination)
  const fetchAllRepos = useCallback(
    async (headers: HeadersInit): Promise<GitHubRepo[]> => {
      const allRepos: GitHubRepo[] = [];
      let page = 1;
      const perPage = 100;

      while (true) {
        const url = `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}&sort=updated`;

        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        const repos: GitHubRepo[] = await response.json();
        if (repos.length === 0) break;
        allRepos.push(...repos);
        if (repos.length < perPage) break;
        page++;
      }

      return allRepos;
    },
    [],
  );

  // Fetch GitHub data
  const fetchGitHubData = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setIsLoading(true);
        } else {
          setIsRefreshing(true);
        }
        setError(null);

        const headers = getHeaders();

        // Fetch user profile
        const userResponse = await fetch(
          `${GITHUB_API_URL}/users/${GITHUB_USERNAME}`,
          { headers },
        );
        if (!userResponse.ok) {
          throw new Error(`GitHub API error: ${userResponse.status}`);
        }
        const userData: GitHubUser = await userResponse.json();

        // Fetch all public repositories
        const reposData = await fetchAllRepos(headers);

        // Filter out forked repos for stats calculation
        const ownRepos = reposData.filter((repo) => !repo.fork);

        // Calculate total stars and forks
        const totalStars = ownRepos.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0,
        );
        const totalForks = ownRepos.reduce(
          (sum, repo) => sum + repo.forks_count,
          0,
        );

        // Calculate language distribution
        const languageCounts: Record<string, number> = {};
        ownRepos.forEach((repo) => {
          if (repo.language) {
            languageCounts[repo.language] =
              (languageCounts[repo.language] || 0) + 1;
          }
        });

        const totalLangCount = Object.values(languageCounts).reduce(
          (a, b) => a + b,
          0,
        );
        const languages = Object.entries(languageCounts)
          .map(([name, count]) => ({
            name,
            value: Math.round((count / totalLangCount) * 100),
            color: languageColors[name] || "#718096",
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        // Get ALL repos for pagination display
        const allRepos: RepoDisplay[] = ownRepos.map((repo) => ({
          name: repo.name,
          description: repo.description || "No description available",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "Unknown",
          languageColor: languageColors[repo.language || ""] || "#718096",
          url: repo.html_url,
          updatedAt: formatRelativeTime(repo.updated_at),
          watchers: repo.watchers_count || 0,
          openIssues: repo.open_issues_count || 0,
          size: repo.size || 0,
        }));

        // Get top repos by stars
        const topReposByStars = [...ownRepos]
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5)
          .map((repo) => ({
            name: repo.name,
            stars: repo.stargazers_count,
          }));

        setGithubStats({
          user: userData,
          repos: ownRepos,
          totalStars,
          totalForks,
          languages,
          allRepos,
          topReposByStars,
        });

        setLastUpdated(new Date());
        if (!silent) setIsLoading(false);
        setIsRefreshing(false);
        isInitialLoad.current = false;
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        if (!silent || isInitialLoad.current) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch GitHub data",
          );
        }
        if (!silent) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [getHeaders, fetchAllRepos],
  );

  // Initial fetch + 3.5s polling + visibility-based refresh
  useEffect(() => {
    fetchGitHubData();

    // Start 3.5 second polling
    intervalRef.current = setInterval(() => {
      fetchGitHubData(true);
    }, REFRESH_INTERVAL_MS);

    // Also refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchGitHubData(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchGitHubData]);

  // Filter repos by search query
  const filteredRepos = useMemo(() => {
    if (!githubStats) return [];
    if (!searchQuery.trim()) return githubStats.allRepos;
    const query = searchQuery.toLowerCase().trim();
    return githubStats.allRepos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.description.toLowerCase().includes(query) ||
        repo.language.toLowerCase().includes(query),
    );
  }, [githubStats, searchQuery]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("repositories-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Get current page repos from filtered list
  const getCurrentPageRepos = () => {
    const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
    const endIndex = startIndex + REPOS_PER_PAGE;
    return filteredRepos.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredRepos.length / REPOS_PER_PAGE);

  // Public repos only
  const publicRepoCount = githubStats ? githubStats.allRepos.length : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400 text-lg">Fetching data from GitHub...</p>
          <p className="text-gray-500 text-sm mt-2">@{GITHUB_USERNAME}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 lg:py-28">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-violet-500/10" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 mb-6">
              <div className="bg-gray-900 rounded-full px-6 py-3">
                <span className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                  <Github className="w-5 h-5 text-cyan-400" />
                  GitHub Statistics
                </span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                GitHub Stats
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              Insights into my open source contributions, repositories, and
              coding activity on{" "}
              <span className="text-white font-semibold">GitHub</span>
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">
                Live · Public repositories only
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Error State */}
      {error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorCard message={error} />
        </section>
      )}

      {/* GitHub Stats Section */}
      {githubStats && !error && (
        <section className="relative py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* User Profile Card */}
            {githubStats.user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 p-6 lg:p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={githubStats.user.avatar_url}
                    alt={githubStats.user.name || githubStats.user.login}
                    loading="lazy"
                    className="w-28 h-28 rounded-full border-4 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                  />
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {githubStats.user.name || githubStats.user.login}
                    </h2>
                    <p className="text-cyan-400 font-medium mb-3">
                      @{githubStats.user.login}
                    </p>
                    {githubStats.user.bio && (
                      <p className="text-gray-400 mb-3">
                        {githubStats.user.bio}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      Member since{" "}
                      {new Date(githubStats.user.created_at).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" },
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-12"
            >
              <StatCard
                icon={FolderGit2}
                label="Public Repos"
                value={publicRepoCount}
                delay={0}
              />
              <StatCard
                icon={Star}
                label="Total Stars"
                value={githubStats.totalStars}
                delay={0.1}
              />
              <StatCard
                icon={GitFork}
                label="Total Forks"
                value={githubStats.totalForks}
                delay={0.2}
              />
              <StatCard
                icon={Users}
                label="Followers"
                value={githubStats.user?.followers || 0}
                delay={0.3}
              />
              <StatCard
                icon={Eye}
                label="Following"
                value={githubStats.user?.following || 0}
                delay={0.4}
              />
            </motion.div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
              {/* Language Distribution Pie Chart */}
              <ChartCard title="Language Distribution" icon={Code2}>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={githubStats.languages}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 45 : 60}
                        outerRadius={isMobile ? 75 : 100}
                        paddingAngle={2}
                        dataKey="value"
                        label={
                          isMobile
                            ? false
                            : ({ name, percent }) =>
                                `${name} ${((percent || 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {githubStats.languages.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.color ||
                              PIE_COLORS[index % PIE_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {githubStats.languages.map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="text-gray-400 text-sm">{lang.name}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* Top Repos by Stars Bar Chart */}
              <ChartCard title="Top Repositories by Stars" icon={Star}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={githubStats.topReposByStars}
                    layout="vertical"
                    margin={{ left: 0, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#9ca3af"
                      fontSize={11}
                      width={isMobile ? 70 : 100}
                      tick={{ fill: "#9ca3af" }}
                      tickFormatter={(value) => {
                        const limit = isMobile ? 8 : 15;
                        return value.length > limit ? `${value.slice(0, limit)}...` : value;
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="stars"
                      name="Stars"
                      fill={CHART_COLORS.primary}
                      radius={[0, 4, 4, 0]}
                    >
                      {githubStats.topReposByStars.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Repository Activity Overview */}
            <ChartCard
              title="Repository Activity Overview"
              icon={Activity}
              className="mb-12"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={githubStats.allRepos.slice(0, isMobile ? 5 : 10).map((repo) => ({
                    name:
                      repo.name.length > (isMobile ? 8 : 12)
                        ? repo.name.slice(0, isMobile ? 8 : 12) + "..."
                        : repo.name,
                    stars: repo.stars,
                    forks: repo.forks,
                  }))}
                >
                  <defs>
                    <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorForks" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.secondary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.secondary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="stars"
                    name="Stars"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    fill="url(#colorStars)"
                  />
                  <Area
                    type="monotone"
                    dataKey="forks"
                    name="Forks"
                    stroke={CHART_COLORS.secondary}
                    strokeWidth={2}
                    fill="url(#colorForks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* All Repositories with Search and Pagination */}
            <motion.div
              id="repositories-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <GitBranch className="w-6 h-6 text-cyan-400" />
                  All Repositories
                  {isRefreshing && (
                    <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  )}
                </h3>
                {lastUpdated && (
                  <p className="text-gray-600 text-xs flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Live · Updated {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative mb-6 mt-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search repositories by name, description, language..."
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-gray-800/70 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm"
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <p className="text-gray-500 mb-6">
                {searchQuery ? (
                  <>
                    Found{" "}
                    <span className="text-cyan-400 font-semibold">
                      {filteredRepos.length}
                    </span>{" "}
                    {filteredRepos.length === 1 ? "repository" : "repositories"}{" "}
                    matching “
                    <span className="text-gray-300">{searchQuery}</span>”
                  </>
                ) : (
                  <>
                    Showing{" "}
                    {filteredRepos.length > 0
                      ? (currentPage - 1) * REPOS_PER_PAGE + 1
                      : 0}{" "}
                    -{" "}
                    {Math.min(
                      currentPage * REPOS_PER_PAGE,
                      filteredRepos.length,
                    )}{" "}
                    of {filteredRepos.length} repositories
                  </>
                )}
              </p>

              {filteredRepos.length === 0 && searchQuery ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 rounded-2xl bg-gray-800/30 border border-gray-700/30"
                >
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">
                    No repositories found
                  </p>
                  <p className="text-gray-500 text-sm">
                    Try searching with different keywords
                  </p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentPageRepos().map((repo, index) => (
                    <motion.a
                      key={repo.name}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                          <FolderGit2 className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">{repo.name}</span>
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                        {repo.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: repo.languageColor }}
                          />
                          <span className="text-gray-400 text-sm">
                            {repo.language}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" /> {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="w-4 h-4" /> {repo.forks}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mt-3 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Updated{" "}
                        {repo.updatedAt}
                      </p>
                    </motion.a>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Coding Journey Section */}
      {githubStats && (
        <section className="relative py-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Coding Journey
                </span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
                A passion for code that grows stronger{" "}
                <span className="text-cyan-400 font-semibold">every day</span>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Code2,
                  title: "Languages Used",
                  value: githubStats.languages.length,
                  description: "Different programming languages",
                  color: "from-cyan-500 to-blue-500",
                },
                {
                  icon: Calendar,
                  title: "Active Since",
                  value: githubStats.user
                    ? new Date(githubStats.user.created_at).getFullYear()
                    : "N/A",
                  description: "Consistent coding journey",
                  color: "from-violet-500 to-purple-500",
                },
                {
                  icon: FolderGit2,
                  title: "Repositories",
                  value: githubStats.user?.public_repos || 0,
                  description: "Public projects on GitHub",
                  color: "from-green-500 to-emerald-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-6`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    {item.value}
                  </h3>
                  <p className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </p>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default StatsPage;
