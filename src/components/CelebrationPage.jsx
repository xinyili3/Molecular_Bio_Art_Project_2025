// src/components/CelebrationPage.jsx
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

function CelebrationPage({ geneName, onClose, onRestart }) {
  const canvasRef = useRef(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // 文学名句数组
  const quotes = [
    {
      quote: "It was the best of contexts, it was the worst of contexts… for ribosomal scanning.",
      title: "A Tale of Two Translations"
    },
    {
      quote: "To initiate or not to initiate, that is the question.",
      title: "Prince of the Ribosome"
    },
    {
      quote: "All mRNAs are stages, and all the ribosomes and factors merely players.",
      title: "As You Like to Translate It"
    },
    {
      quote: "Call me AUG.",
      title: "Moby Translation"
    },
    {
      quote: "It is a truth universally acknowledged, that a single-stranded mRNA in possession of a good 5′ cap, must be in want of a ribosome.",
      title: "Pride and Polysomes"
    },
    {
      quote: "All happy mRNAs resemble one another; each poorly translated mRNA is poorly translated in its own way.",
      title: "Initiation Karenina"
    },
    {
      quote: "Ribosome, ribosome, wherefore art thou scanning ribosome?",
      title: "Ribosome and Translation"
    },
    {
      quote: "So we beat on, caps against the current, borne back ceaselessly into the 5′ UTR.",
      title: "The Great Translation"
    },
    {
      quote: "Reader, I initiated translation.",
      title: "Jane eIFre"
    },
    {
      quote: "It was a bright cold day in the cytoplasm, and the ribosomes were striking 43S.",
      title: "Initiation 1984"
    },
    {
      quote: "You never really understand translation until you consider the mRNA from both ends.",
      title: "To Initiate a Codon"
    },
    {
      quote: "Once upon a time, there was an mRNA who refused to be translated.",
      title: "The Translationless Princess"
    },
    {
      quote: "Once you eliminate the impossible, whatever remains, must be an alternative start codon.",
      title: "The AUG of the Baskervilles"
    },
    {
      quote: "mRNAs are not born equal. Some are more initiating than others.",
      title: "Translation Farm"
    },
    {
      quote: "Is this a start codon I see before me, its context toward my P site?",
      title: "MacTranslation"
    },
    {
      quote: "There and back again: a ribosome's journey across the 5′ UTR.",
      title: "The Hobbit: An Unexpected Translation"
    }
  ];

  // 获取当前日期和时间（英文格式）
  const getCurrentDateTime = () => {
    const now = new Date();
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleString('en-US', options);
  };

  // 随机选择一句话
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setSelectedQuote(quotes[randomIndex]);
  }, []);

  const currentDateTime = getCurrentDateTime();

  // 下载图片
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // 绘制背景渐变
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, '#f9fafb');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);
    
    // 绘制边框
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 1160, 760);
    
    // 绘制祝贺标题
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 Congratulations! 🎉', 600, 100);
    
    // 绘制主要信息
    ctx.font = '32px Arial';
    ctx.fillStyle = '#374151';
    const mainText = `On ${currentDateTime}`;
    ctx.fillText(mainText, 600, 180);
    
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`You successfully initiated translation of ${geneName}`, 600, 240);
    
    // 绘制分隔线
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 300);
    ctx.lineTo(1000, 300);
    ctx.stroke();
    
    // 绘制名句（如果有）
    if (selectedQuote) {
      ctx.font = 'italic 24px Georgia';
      ctx.fillStyle = '#4b5563';
      
      // 文字换行处理
      const maxWidth = 900;
      const words = selectedQuote.quote.split(' ');
      let line = '';
      let y = 380;
      
      words.forEach((word, index) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && index > 0) {
          ctx.fillText(line, 600, y);
          line = word + ' ';
          y += 35;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 600, y);
      
      // 绘制标题
      ctx.font = 'bold 28px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`— ${selectedQuote.title}`, 600, y + 60);
    }
    
    // 底部信息
    ctx.font = '18px Arial';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText('Translation Initiation Art Project', 600, 750);
    
    // 下载
    const link = document.createElement('a');
    link.download = `${geneName}_translation_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 礼花动画 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
              initial={{
                x: '50%',
                y: '50%',
                scale: 0,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* 标题 */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 Congratulations! 🎉
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            On <span className="font-semibold text-gray-800">{currentDateTime}</span>
          </p>
          <p className="text-xl font-bold text-gray-800 mt-2">
            You successfully initiated translation of <span className="text-blue-600">{geneName}</span>
          </p>
        </motion.div>

        {/* 分隔线 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"
        />

        {/* 文学名句 */}
        {selectedQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 shadow-inner mb-6 border-2 border-gray-200"
          >
            <p className="text-lg italic text-gray-700 leading-relaxed mb-4 text-center">
              "{selectedQuote.quote}"
            </p>
            <p className="text-base font-semibold text-gray-600 text-center">
              — {selectedQuote.title}
            </p>
          </motion.div>
        )}



        {/* 按钮 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={downloadImage}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg shadow-md transition font-medium"
          >
            Download Image
          </button>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md transition font-medium"
          >
            Try Another Gene
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-md transition font-medium"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default CelebrationPage;
