import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  scrollTargetId?: string;
  gradientFrom?: string;
  gradientTo?: string;
  iconColor?: string;
  borderColor?: string;
  focusBorderColor?: string;
  focusRingColor?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  scrollTargetId,
  gradientFrom = "purple-500",
  gradientTo = "cyan-500",
  iconColor = "purple-400",
  borderColor = "border-gray-700/50",
  focusBorderColor = "focus:border-purple-500/50",
  focusRingColor = "focus:ring-purple-500/20",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="relative max-w-xl mx-auto mb-8"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom}/20 to-${gradientTo}/20 rounded-2xl blur-xl opacity-50 pointer-events-none`}
      />
      <div className="relative">
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
          <Search className={`text-${iconColor} w-5 h-5`} />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-14 pr-6 py-4 bg-gray-800/80 border ${borderColor} rounded-2xl ${focusBorderColor} focus:ring-2 ${focusRingColor} transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-xl`}
        />
      </div>
    </motion.div>
  );
};

export default SearchBar;
