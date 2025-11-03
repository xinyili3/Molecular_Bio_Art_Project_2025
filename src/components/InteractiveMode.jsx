// src/components/InteractiveMode.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { allImageComponents } from "./translationConfig";
import CelebrationPage from "./CelebrationPage";

// 简化的图片显示组件
function ImageWithLabel({ 
  image, 
  label, 
  animateProps, 
  transitionProps, 
  styleProps, 
  zIndex = 1, 
  labelConfig = {}, 
  componentId = ""
}) {
  const {
    show = true,
    position = "bottom",
    offsetX = 0,
    offsetY = 10,
  } = labelConfig;

  const isEIF = componentId.toLowerCase().includes('eif');
  const imgWidth = styleProps.width || 150;
  
  const getLabelPosition = () => {
    const baseX = styleProps.left || styleProps.x || 0;
    const baseY = styleProps.top || styleProps.y || 0;
    const height = styleProps.height || 0;
    
    let left, top, transform;
    
    switch (position) {
      case "top":
        left = baseX + imgWidth / 2 + offsetX;
        top = baseY - offsetY;
        transform = "translate(-50%, -100%)";
        break;
      case "bottom":
        left = baseX + imgWidth / 2 + offsetX;
        top = baseY + height + offsetY;
        transform = "translateX(-50%)";
        break;
      case "left":
        left = baseX + offsetX;
        top = baseY + height / 2 + offsetY;
        transform = "translate(-100%, -50%)";
        break;
      case "right":
        left = baseX + imgWidth + offsetX;
        top = baseY + height / 2 + offsetY;
        transform = "translateY(-50%)";
        break;
      default:
        left = baseX + imgWidth / 2 + offsetX;
        top = baseY + height + offsetY;
        transform = "translateX(-50%)";
    }
    
    return { left, top, transform };
  };

  const labelPosition = getLabelPosition();
  
  return (
    <>
      <motion.img
        {...animateProps}
        transition={transitionProps}
        style={{
          ...styleProps,
          zIndex: zIndex,
        }}
        src={image}
        alt={label}
      />
      
      {show && label && (
        <motion.div
          {...animateProps}
          transition={transitionProps}
          style={{
            position: "absolute",
            left: labelPosition.left,
            top: labelPosition.top,
            height: "auto",
            zIndex: zIndex,
            transform: labelPosition.transform,
          }}
          className={`text-center text-base font-bold px-4 py-2 rounded shadow-sm whitespace-nowrap ${
            isEIF 
              ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-2 border-green-400'
              : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-2 border-blue-400'
          }`}
        >
          {label}
        </motion.div>
      )}
    </>
  );
}

function InteractiveMode({ onToggleMode, currentMode, geneName }) {
  const [animationStep, setAnimationStep] = useState(1); // 从Step 1开始，因为Step 0没有需要点击的组件
  const [clickedComponents, setClickedComponents] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [wrongClicks, setWrongClicks] = useState([]); // 记录错误点击
  const [selectedComponent, setSelectedComponent] = useState(null); // 用于展开详情
  const [showDescription, setShowDescription] = useState(false); // 控制步骤描述显示
  const [showCelebration, setShowCelebration] = useState(false);

  // 定义每一步需要的组件（与动画模式一致）
  const getRequiredComponentsForStep = (step) => {
    const stepRequirements = {
      0: [], // 初始状态，只显示mRNA和PABP
      1: ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s'], // Ribosome Recruitment
      2: ['15-eIF2', '14-GTP', '11-tRNA'], // Ternary Complex Components
      3: [], // Ternary Complex Formation (自动动画)
      4: ['13-eIF5-CTD', '12-eIF5-NTD'], // eIF5 Recruitment
      5: [], // 43S PIC Assembly Complete (自动动画)
      6: ['08-eIF4'], // mRNA Cap Recognition
      7: ['09-eIF4A', '04-eIF4B'], // Helicase Recruitment
      8: [], // 48S Open Complex Formation (自动动画)
      9: [], // mRNA Scanning (mRNA-2 和 AUG-2 自动出现)
      10: ['00-eIF5-NTD-2'], // Start Codon Recognition
      11: ['19-eIF5B', '20-60s'], // 60S Subunit Joining
      12: ['18-eEFs'], // Elongation Begins
    };
    return stepRequirements[step] || [];
  };

  // 获取所有可选组件（所有步骤的组件去重），并排序：eIF优先，按编号智能排序
  const getAllSelectableComponents = () => {
    const allRequired = [];
    for (let i = 1; i <= 12; i++) {
      allRequired.push(...getRequiredComponentsForStep(i));
    }
    const uniqueComponents = [...new Set(allRequired)];
    
    // 分类：eIF 和 其他组件
    const eifComponents = uniqueComponents.filter(id => 
      id.toLowerCase().includes('eif')
    );
    const otherComponents = uniqueComponents.filter(id => 
      !id.toLowerCase().includes('eif')
    );
    
    // eIF 智能排序：1, 1A, 2, 3, 4, 4A, 4B, 5-CTD, 5-NTD, 5B
    eifComponents.sort((a, b) => {
      // 提取主编号和后缀
      const parseEIF = (id) => {
        const label = allImageComponents.find(c => c.id === id)?.label || id;
        // 匹配 eIF 后面的编号，例如 "eIF1", "eIF1A", "eIF4B", "eIF5-NTD"
        const match = label.match(/eIF(\d+)([A-Z]?)(?:-(.+))?/i);
        if (match) {
          const mainNum = parseInt(match[1]);
          const suffix = match[2] || ''; // A, B 等
          const subtype = match[3] || ''; // NTD, CTD 等
          return { mainNum, suffix, subtype, original: label };
        }
        return { mainNum: 999, suffix: '', subtype: '', original: label };
      };
      
      const aInfo = parseEIF(a);
      const bInfo = parseEIF(b);
      
      // 先按主编号排序
      if (aInfo.mainNum !== bInfo.mainNum) {
        return aInfo.mainNum - bInfo.mainNum;
      }
      
      // 主编号相同，按后缀排序（无后缀 < A < B）
      if (aInfo.suffix !== bInfo.suffix) {
        if (!aInfo.suffix) return -1;
        if (!bInfo.suffix) return 1;
        return aInfo.suffix.localeCompare(bInfo.suffix);
      }
      
      // 后缀相同，按子类型排序（无子类型 < CTD < NTD）
      const subtypeOrder = { '': 0, 'CTD': 1, 'NTD': 2 };
      return (subtypeOrder[aInfo.subtype] || 999) - (subtypeOrder[bInfo.subtype] || 999);
    });
    
    // 其他组件保持原顺序
    return [...eifComponents, ...otherComponents];
  };

  // 检查当前步骤是否完成（所有必需组件都被点击）
  useEffect(() => {
    const required = getRequiredComponentsForStep(animationStep);
    
    // 如果是自动动画步骤（没有必需组件）
    if (required.length === 0 && animationStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        if (animationStep < 12) {
          setAnimationStep(animationStep + 1);
        } else if (animationStep === 12 && geneName) {
          // 完成了Step 12，显示庆祝页面
          setTimeout(() => setShowCelebration(true), 500);
        }
      }, 1500);
      return;
    }
    
    // 检查是否所有必需组件都被点击
    if (required.length > 0) {
      const allClicked = required.every(id => clickedComponents.includes(id));
      if (allClicked && !isAnimating) {
        // 所有组件都点击了，开始动画并进入下一步
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          if (animationStep < 12) {
            setAnimationStep(animationStep + 1);
          } else if (animationStep === 12 && geneName) {
            // 完成了Step 12，显示庆祝页面
            setTimeout(() => setShowCelebration(true), 500);
          }
        }, 1500);
      }
    }
  }, [clickedComponents, animationStep]);

  // 处理组件点击
  const handleComponentClick = (componentId) => {
    if (isAnimating) return; // 动画期间不能点击
    if (clickedComponents.includes(componentId)) return; // 已经点击过的不能再点击
    
    const required = getRequiredComponentsForStep(animationStep);
    
    if (required.includes(componentId)) {
      // 选对了
      setClickedComponents([...clickedComponents, componentId]);
      // 清除该组件的错误标记
      setWrongClicks(wrongClicks.filter(id => id !== componentId));
    } else {
      // 选错了，标记为红色
      if (!wrongClicks.includes(componentId)) {
        setWrongClicks([...wrongClicks, componentId]);
        // 1秒后清除红色标记
        setTimeout(() => {
          setWrongClicks(prev => prev.filter(id => id !== componentId));
        }, 1000);
      }
    }
  };

  // 定义初始位置（与动画模式完全相同）
  const initialPositions = {
    '17-eIF3': { x: 10, y: 50 },
    '03-eIF1': { x: 10, y: 50 },
    '02-eIF1A': { x: 10, y: 50 },
    '16-40s': { x: 200, y: 50 },
    '06-mRNA-1': { x: 200, y: 400 },
    '07-PABP': { x: 200, y: 400 },
    '15-eIF2': { x: 450, y: 50 },
    '14-GTP': { x: 450, y: 50 },
    '11-tRNA': { x: 650, y: 50 },
    '13-eIF5-CTD': { x: 700, y: 50 },
    '12-eIF5-NTD': { x: 700, y: 50 },
    '08-eIF4': { x: 200, y: 400 },
    '09-eIF4A': { x: 500, y: 50 },
    '04-eIF4B': { x: 650, y: 50 },
    '05-mRNA-2': { x: 200, y: 400 },
    '01-AUG-2': { x: 200, y: 400 },
    '00-eIF5-NTD-2': { x: 200, y: 400 },
    '19-eIF5B': { x: 200, y: 50 },
    '20-60s': { x: 200, y: 50 },
    '18-eEFs': { x: 200, y: 400 },
  };

  // 获取组件当前位置（与动画模式完全相同的逻辑）
  const getComponentPosition = (id) => {
    const initial = initialPositions[id];
    if (!initial) return { x: 50, y: 50 };

    // Step 11: 19和20移动到与05相同位置
    if (animationStep >= 11) {
      if (id === '19-eIF5B' || id === '20-60s') {
        return { x: 200, y: 400 };
      }
    }

    // Step 8: 48S的所有组件和09、04一起移动到与06相同位置
    if (animationStep >= 8) {
      const moveToMRNAComponents = ['02-eIF1A', '03-eIF1', '17-eIF3', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD', '09-eIF4A', '04-eIF4B'];
      if (moveToMRNAComponents.includes(id)) {
        return { x: 200, y: 400 };
      }
    }

    // Step 5: 所有相关组件向中间移动至左对齐且上对齐
    if (animationStep >= 5) {
      const alignComponents = ['02-eIF1A', '03-eIF1', '17-eIF3', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD'];
      if (alignComponents.includes(id)) {
        return { x: 350, y: 50 };
      }
    }

    // Step 0: 初始位置
    if (animationStep === 0) {
      return initial;
    }

    // Step 1+: 17, 03, 02 向右移动到与 16 左对齐
    if (animationStep >= 1) {
      if (id === '17-eIF3' || id === '03-eIF1' || id === '02-eIF1A') {
        return { x: 200, y: initial.y };
      }
    }

    // Step 3+: 11 向左移动到与 15+14 相同的 x
    if (animationStep >= 3) {
      if (id === '11-tRNA') {
        return { x: 450, y: initial.y };
      }
    }

    return initial;
  };

  // 获取当前应该显示的组件（与动画模式完全相同的逻辑）
  const getVisibleComponents = () => {
    // Step 12 及以后：19 和 02 消失，18 出现
    if (animationStep >= 12) {
      return allImageComponents.filter(comp => 
        ['11-tRNA', '01-AUG-2', '05-mRNA-2', '16-40s', '20-60s', '18-eEFs', '07-PABP'].includes(comp.id) &&
        (clickedComponents.includes(comp.id) || ['07-PABP', '05-mRNA-2', '01-AUG-2'].includes(comp.id))
      );
    }
    
    // Step 11：只保留 02、11、01、05、16，并显示 19、20
    if (animationStep >= 11) {
      return allImageComponents.filter(comp => 
        ['02-eIF1A', '11-tRNA', '01-AUG-2', '05-mRNA-2', '16-40s', '19-eIF5B', '20-60s', '07-PABP'].includes(comp.id) &&
        (clickedComponents.includes(comp.id) || ['07-PABP', '05-mRNA-2', '01-AUG-2'].includes(comp.id))
      );
    }
    
    let visibleIds = ['07-PABP'];
    
    // 添加已点击的组件
    visibleIds = [...visibleIds, ...clickedComponents];
    
    // Step 0-9: 显示 03-eIF1（如果已点击）
    if (animationStep >= 10 && visibleIds.includes('03-eIF1')) {
      visibleIds = visibleIds.filter(id => id !== '03-eIF1');
    }
    
    // Step 0-8: 显示 06-mRNA-1
    if (animationStep < 9) {
      visibleIds.push('06-mRNA-1');
    }
    
    // Step 9 及以后，06-mRNA-1 消失，05-mRNA-2 和 01-AUG-2 自动出现
    if (animationStep >= 9) {
      visibleIds = visibleIds.filter(id => id !== '06-mRNA-1');
      // 自动添加 mRNA-2 和 AUG-2
      if (!visibleIds.includes('05-mRNA-2')) {
        visibleIds.push('05-mRNA-2');
      }
      if (!visibleIds.includes('01-AUG-2')) {
        visibleIds.push('01-AUG-2');
      }
    }
    
    // Step 10 及以后，12-eIF5-NTD 消失
    if (animationStep >= 10 && visibleIds.includes('12-eIF5-NTD')) {
      visibleIds = visibleIds.filter(id => id !== '12-eIF5-NTD');
    }
    
    return allImageComponents.filter(comp => visibleIds.includes(comp.id));
  };

  // 步骤描述
  const getStepDescription = () => {
    const descriptions = {
      0: {
        title: "Initial State",
        description: "eIF3, eIF1, and eIF1A exist as individual factors before ribosome binding."
      },
      1: {
        title: "Ribosome Recruitment",
        description: "eIF3, eIF1, and eIF1A associate with the 40S ribosomal subunit to form the 43S pre-initiation complex (PIC)."
      },
      2: {
        title: "Ternary Complex Components",
        description: "eIF2, GTP, and Met-tRNAi are present independently before complex formation."
      },
      3: {
        title: "Ternary Complex Formation",
        description: "eIF2·GTP binds Met-tRNAi to form the ternary complex, which is essential for start codon recognition."
      },
      4: {
        title: "eIF5 Recruitment",
        description: "The two domains of eIF5 (CTD and NTD) join the assembly to prepare for start codon recognition."
      },
      5: {
        title: "43S PIC Assembly Complete",
        description: "All initiation factors and the ternary complex converge on the 40S subunit, forming a mature 43S PIC ready for mRNA recruitment."
      },
      6: {
        title: "mRNA Cap Recognition",
        description: "The eIF4F complex (eIF4E-eIF4G-eIF4A) binds to the 5′ cap structure of mRNA."
      },
      7: {
        title: "Helicase Recruitment",
        description: "eIF4A and eIF4B are recruited to unwind secondary structures in the 5′ UTR, preparing for ribosome attachment."
      },
      8: {
        title: "48S Open Complex Formation",
        description: "The 43S PIC is recruited to the mRNA via eIF4F, forming the 48S open complex with an open 40S conformation."
      },
      9: {
        title: "mRNA Scanning",
        description: "The 48S complex scans the 5′ UTR in the 5′→3′ direction, searching for the start codon (AUG) in optimal context."
      },
      10: {
        title: "Start Codon Recognition",
        description: "Upon AUG recognition, eIF1 is released and the eIF5-NTD moves into the P site, stabilizing the closed 48S complex with Met-tRNAi positioned at the start codon."
      },
      11: {
        title: "60S Subunit Joining",
        description: "eIF5B facilitates the joining of the 60S subunit to form the 80S initiation complex. Most initiation factors are released during this transition."
      },
      12: {
        title: "Elongation Begins",
        description: "eIF5B and eIF1A dissociate, and eEFs (elongation factors) take over to drive the elongation phase of translation."
      }
    };
    return descriptions[animationStep] || descriptions[0];
  };

  const requiredComponents = getRequiredComponentsForStep(animationStep);
  const visibleComponents = getVisibleComponents();
  const selectableComponents = getAllSelectableComponents();
  const stepDesc = getStepDescription();

  // 重置到Step 1
  const handleReset = () => {
    setAnimationStep(1);
    setClickedComponents([]);
    setIsAnimating(false);
    setWrongClicks([]);
    setSelectedComponent(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 左侧 Timeline */}
      <div className="w-64 bg-white border-r-2 border-gray-200 overflow-y-auto shadow-xl">
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-lg mb-4">Translation Initiation</h3>
          <div className="space-y-3">
            {[
              { step: 0, title: "Initial State" },
              { step: 1, title: "Ribosome Recruitment" },
              { step: 2, title: "Ternary Complex Components" },
              { step: 3, title: "Ternary Complex Formation" },
              { step: 4, title: "eIF5 Recruitment" },
              { step: 5, title: "43S PIC Assembly Complete" },
              { step: 6, title: "mRNA Cap Recognition" },
              { step: 7, title: "Helicase Recruitment" },
              { step: 8, title: "48S Open Complex Formation" },
              { step: 9, title: "mRNA Scanning" },
              { step: 10, title: "Start Codon Recognition" },
              { step: 11, title: "60S Subunit Joining" },
              { step: 12, title: "Elongation Begins" },
            ].map((item) => (
              <div 
                key={item.step}
                className={`flex items-start gap-3 text-sm transition-all p-2 rounded ${
                  item.step === animationStep 
                    ? 'font-bold text-blue-600 bg-blue-50' 
                    : item.step < animationStep 
                      ? 'text-gray-600 hover:bg-gray-50' 
                      : 'text-gray-400'
                } ${item.step === 0 ? 'opacity-50' : ''}`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                  item.step === animationStep
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : item.step < animationStep
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {item.step < animationStep ? '✓' : item.step + 1}
                </div>
                <span className={`flex-1 leading-relaxed ${item.step === animationStep ? 'text-blue-900' : ''}`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 中间动画区域 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 模式切换按钮 */}
        {onToggleMode && (
          <div className="absolute top-4 right-8 z-50">
            <button
              onClick={onToggleMode}
              className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105 font-medium"
            >
              Animation
            </button>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="absolute bottom-8 right-8 flex gap-4 z-50">
          <button 
            onClick={handleReset}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition font-medium"
          >
            Reset
          </button>
        </div>

        <div className="w-full h-full relative" style={{ marginLeft: '-200px' }}>
            <AnimatePresence>
              {visibleComponents
                .sort((a, b) => b.layer - a.layer)
                .map((comp) => {
                  const position = getComponentPosition(comp.id);
                  
                  // Step 11: 为 19 和 20 添加特殊的动画延迟
                  let transitionDelay = 0;
                  let initialPosition = position;
                  
                  if (animationStep === 11 && (comp.id === '19-eIF5B' || comp.id === '20-60s')) {
                    transitionDelay = 0.8;
                    initialPosition = initialPositions[comp.id];
                  }
                  
                  // Step 12: 为 18 添加延迟
                  if (animationStep === 12 && comp.id === '18-eEFs') {
                    transitionDelay = 1.2;
                  }
                  
                  return (
                    <ImageWithLabel
                      key={comp.id}
                      image={comp.image}
                      label={comp.label}
                      labelConfig={comp.labelConfig}
                      componentId={comp.id}
                      animateProps={{ 
                        initial: { 
                          opacity: 0, 
                          scale: 0.8,
                          x: initialPosition.x,
                          y: initialPosition.y
                        },
                        animate: { 
                          opacity: 1, 
                          scale: 1,
                          x: position.x,
                          y: position.y
                        },
                        exit: { 
                          opacity: 0, 
                          scale: 0.8,
                          x: position.x,
                          y: position.y
                        }
                      }}
                      transitionProps={{ 
                        duration: 0.8, 
                        ease: "easeInOut",
                        delay: transitionDelay
                      }}
                      styleProps={{ 
                        position: "absolute",
                        height: comp.height
                      }}
                      zIndex={21 - comp.layer}
                    />
                  );
                })}
            </AnimatePresence>
        </div>
      </div>

      {/* 右侧区域 */}
      <div className="w-96 bg-white border-l-2 border-gray-200 overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* 步骤说明 */}
          <div 
            className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-300 hover:bg-blue-100 transition-colors cursor-help"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
          >
            <h3 className="font-bold text-lg text-blue-900">
              {stepDesc.title}
            </h3>
            <AnimatePresence>
              {showDescription && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ 
                    height: 'auto', 
                    opacity: 1, 
                    marginTop: 8,
                    transition: { 
                      height: { duration: 0.3, ease: 'easeInOut' },
                      opacity: { duration: 0.25, ease: 'easeIn' },
                      marginTop: { duration: 0.3, ease: 'easeInOut' }
                    }
                  }}
                  exit={{ 
                    height: 0, 
                    opacity: 0, 
                    marginTop: 0,
                    transition: { 
                      height: { duration: 0.25, ease: 'easeInOut' },
                      opacity: { duration: 0.2, ease: 'easeOut' },
                      marginTop: { duration: 0.25, ease: 'easeInOut' }
                    }
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {stepDesc.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 已选择的组件区域 */}
          {clickedComponents.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Selected Components</h3>
              <div className="space-y-2">
                {clickedComponents.map((componentId) => {
                  const comp = allImageComponents.find(c => c.id === componentId);
                  if (!comp) return null;
                  
                  const isSelected = selectedComponent?.id === componentId;
                  
                  return (
                    <div key={componentId}>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedComponent(isSelected ? null : comp)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition bg-green-50 border-green-400 hover:bg-green-100 hover:border-green-600 ${
                          isSelected ? 'ring-2 ring-offset-2 ring-green-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-green-900">
                            {comp.label}
                          </span>
                          <span className="text-green-600 text-xl">✓</span>
                        </div>
                      </motion.div>
                      
                      {/* 展开的详细信息 */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ 
                              opacity: 1, 
                              height: 'auto', 
                              marginTop: 8,
                              transition: { 
                                height: { duration: 0.3, ease: 'easeInOut' },
                                opacity: { duration: 0.25, ease: 'easeIn' },
                                marginTop: { duration: 0.3, ease: 'easeInOut' }
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              height: 0, 
                              marginTop: 0,
                              transition: { 
                                height: { duration: 0.25, ease: 'easeInOut' },
                                opacity: { duration: 0.2, ease: 'easeOut' },
                                marginTop: { duration: 0.25, ease: 'easeInOut' }
                              }
                            }}
                            className="overflow-hidden p-4 rounded-lg border-2 border-green-300 bg-white"
                          >
                            <h4 className="font-bold text-base text-green-900 mb-2">
                              {comp.hoverInfo.title}
                            </h4>
                            <p 
                              className="text-xs text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: comp.hoverInfo.content }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 待选择组件区域 */}
          <h3 className="font-bold text-gray-800 mb-3">Available Components</h3>
          
          <div className="space-y-2">
            {selectableComponents.map((componentId) => {
              const comp = allImageComponents.find(c => c.id === componentId);
              if (!comp) return null;
              
              const isClicked = clickedComponents.includes(componentId);
              const isWrong = wrongClicks.includes(componentId);
              const isEIF = componentId.toLowerCase().includes('eif');
              
              // 已点击的不显示在这里
              if (isClicked) return null;
              
              return (
                <motion.div
                  key={componentId}
                  onClick={() => handleComponentClick(componentId)}
                  animate={isWrong ? {
                    x: [-10, 10, -10, 10, 0],
                    transition: { duration: 0.4 }
                  } : {}}
                  className={`p-3 rounded-lg border-2 transition cursor-pointer ${
                    isWrong
                      ? 'bg-red-100 border-red-400 hover:bg-red-200'
                      : isEIF
                      ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200 hover:border-purple-600'
                      : 'bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                  } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!isAnimating ? { scale: 1.02 } : {}}
                  whileTap={!isAnimating ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-sm ${
                      isWrong ? 'text-red-900' : 
                      isEIF ? 'text-purple-900' : 
                      'text-gray-800'
                    }`}>
                      {comp.label}
                    </span>
                    {isWrong && (
                      <span className="text-red-600 text-xl">✗</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {isAnimating && (
            <div className="mt-6 text-center py-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-blue-700 font-semibold">Animating...</p>
            </div>
          )}
        </div>
      </div>

      {/* 庆祝页面 */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationPage
            geneName={geneName}
            onClose={() => setShowCelebration(false)}
            onRestart={() => window.location.reload()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default InteractiveMode;
