import React from "react";
import { motion, Variants } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import TypewriterEffect from "../components/TypewriterEffect";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Monishwaran_K_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navigate = useNavigate();

  const typewriterWords = [
    "Composing sleek UIs with React and Next.js...",
    "Hooking into interactivity...",
    "Turning components into experiences...",
    "Writing clean JSX and TSX like poetry...",
    "Managing state, like a boss...",
    "Building fast, responsive apps...",
    "Breaking the UI into reusable pieces...",
    "Animating interfaces with Framer Motion...",
    "Shipping pixel-perfect components...",
  ];

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

  const stats = [
    { label: "Projects Completed", value: "10+" },
    { label: "Technologies Mastered", value: "10+" },
    { label: "Hackathon Won", value: "1" },
    { label: "Years of Experience", value: "2+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-violet-500/10" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-6 lg:mb-8">
            <div className="inline-block p-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500">
              <div className="bg-gray-900 rounded-full px-5 py-2 lg:px-6 lg:py-2.5">
                <span className="text-sm lg:text-base font-semibold text-gray-200">
                  Hello, I'm
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 lg:mb-8 leading-tight bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient"
          >
            Monishwaran K
          </motion.h1>

          <motion.div variants={itemVariants} className="mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-300/75 mb-4 lg:mb-6">
              Aspiring Software Developer || Meta Certified Front-End Developer
            </h2>

            {/* Dynamic Typewriter Effect */}
            <div className="text-lg sm:text-xl lg:text-2xl text-cyan-400 font-medium mb-6">
              <TypewriterEffect
                words={typewriterWords}
                className="min-h-[2em] flex items-center justify-center"
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 mb-12 lg:mb-16 px-4"
          >
            <motion.button
              onClick={handleDownload}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(6,182,212,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-purple-700 via-pink-600 to-violet-700 text-white font-semibold rounded-full hover:from-pink-600 hover:to-violet-700 transition-all duration-300"
            >
              <Download size={20} />
              Download Resume
            </motion.button>
            <motion.button
              onClick={() => navigate("/about")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 border-2 border-cyan-500/50 text-cyan-400 font-semibold rounded-full hover:bg-cyan-500/10 transition-all duration-300"
            >
              View More
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 lg:gap-6 mb-12 lg:mb-16"
          >
            {[
              {
                icon: "/icons/github.webp",
                href: "https://github.com/Monishwarann",
                label: "GitHub",
              },
              {
                icon: "/icons/linkedin.webp",
                href: "https://www.linkedin.com/in/monishwaran-k-b463a3363/",
                label: "LinkedIn",
              },
              {
                icon: "/icons/instagram.webp",
                href: "https://www.instagram.com/k._.monish",
                label: "Instagram",
              },
            ].map(({ icon, href, label }) => (
              <motion.div
                key={label}
                onClick={() => window.open(href, "_blank")}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="relative group p-3 lg:p-4 rounded-xl cursor-pointer bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 shadow-lg shadow-black/10"
              >
                <img
                  src={icon}
                  alt={label}
                  className="h-6 w-6 lg:h-7 lg:w-7 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                By the Numbers
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              A glimpse into my journey as a{" "}
              <span className="text-orange-500 font-semibold">
                passionate developer{" "}
              </span>
              and{" "}
              <span className="text-yellow-500 font-semibold">
                {" "}
                engineering student
              </span>
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 lg:p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2 lg:mb-4">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 lg:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Explore My World
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
              Discover my projects, achievements and events I participated in.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Projects",
                path: "/projects",
                description: "Innovative solutions",
                icon: "🚀",
              },
              {
                title: "Certifications",
                path: "/certifications",
                description: "Professional Achievements",
                icon: "🏆",
              },
              {
                title: "Events",
                path: "/events",
                description: "Hackathons & Events",
                icon: "🎯",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <Link
                  to={item.path}
                  className="block p-6 lg:p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 h-full"
                >
                  <div className="text-4xl lg:text-5xl mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-3 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                  <div className="mt-4 lg:mt-6 flex items-center text-cyan-400 group-hover:text-violet-400 transition-colors">
                    <span className="text-sm lg:text-base font-medium">
                      Explore
                    </span>
                    <ArrowRight
                      size={16}
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
