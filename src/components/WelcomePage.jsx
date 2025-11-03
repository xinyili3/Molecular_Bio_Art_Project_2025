// src/components/WelcomePage.jsx
import { motion } from "framer-motion";
import { useState } from "react";

function WelcomePage({ onEnter }) {
  const [isHovering, setIsHovering] = useState(false);
  const [geneName, setGeneName] = useState("");
  const [error, setError] = useState("");

  const handleEnter = () => {
    if (!geneName.trim()) {
      setError("Please enter your favorite gene name");
      return;
    }
    onEnter(geneName.trim());
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center overflow-hidden relative">
      {/* 背景动画粒子 */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gray-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* DNA 双螺旋背景 */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.path
            d="M0,50 Q25,70 50,50 T100,50"
            stroke="white"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          />
        </svg>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center px-8">
        {/* 标题动画 */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-7xl font-bold text-gray-800 mb-4 tracking-tight">
            Translation Initiation
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8"
            style={{ width: "60%" }}
          />
        </motion.div>

        {/* 副标题 */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-3xl text-gray-600 mb-12 font-light"
        >
          of <span className="font-semibold text-gray-800">Your Favorite Gene</span>
        </motion.h2>

        {/* 分子图标 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1.2, type: "spring" }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(156,163,175,0.4)" strokeWidth="2" />
                <circle cx="50" cy="10" r="8" fill="#9CA3AF" />
                <circle cx="85" cy="35" r="8" fill="#D1D5DB" />
                <circle cx="85" cy="65" r="8" fill="#E5E7EB" />
                <circle cx="50" cy="90" r="8" fill="#F3F4F6" />
                <circle cx="15" cy="65" r="8" fill="#E5E7EB" />
                <circle cx="15" cy="35" r="8" fill="#D1D5DB" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* 基因名输入框 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mb-8 max-w-md mx-auto"
        >
          <label className="block text-gray-700 text-sm font-semibold mb-3">
            Name of Your Favorite Gene
          </label>
          <input
            type="text"
            value={geneName}
            onChange={(e) => {
              setGeneName(e.target.value);
              setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleEnter();
              }
            }}
            className="w-full px-6 py-4 text-lg text-gray-800 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition shadow-sm"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm mt-2"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* 进入按钮 */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
          onClick={handleEnter}
          className="group relative px-12 py-5 bg-gradient-to-r from-gray-700 to-gray-600 text-white text-xl font-bold rounded-full shadow-2xl overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700"
            initial={{ x: "-100%" }}
            animate={{ x: isHovering ? "0%" : "-100%" }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center gap-3">
            Explore
            <motion.span
              animate={{ x: isHovering ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </span>
        </motion.button>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-16 text-gray-600 text-sm"
        >
          <p className="mb-2">Art Project</p>
          <p className="text-xs opacity-75">03-742 Molecular Biology | 2025 Fall</p>
        </motion.div>
      </div>

      {/* 底部装饰波浪 */}
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg viewBox="0 0 1200 120" className="w-full h-24">
          <motion.path
            d="M0,60 C150,80 350,40 600,60 C850,80 1050,40 1200,60 L1200,120 L0,120 Z"
            fill="#9CA3AF"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.1 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </svg>
      </div>
    </div>
  );
}

export default WelcomePage;
