// src/components/TranslationInitiation.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import {
  allImageComponents,
} from "./translationConfig";

// 简化的图片显示组件
function ImageWithLabel({ 
  image, 
  label, 
  animateProps, 
  transitionProps, 
  styleProps, 
  zIndex = 1, 
  labelConfig = {}, // label 配置参数
  componentId = ""  // 组件ID,用于判断是否是eIF
}) {
  // labelConfig 默认值
  const {
    show = true,              // 是否显示 label
    position = "bottom",      // label 位置: "top", "bottom", "left", "right"
    offsetX = 0,             // X 轴偏移
    offsetY = 10,            // Y 轴偏移
  } = labelConfig;

  // 判断是否是 eIF 组件
  const isEIF = componentId.toLowerCase().includes('eif');

  // 计算图片宽度的中心位置
  const imgWidth = styleProps.width || 150; // 默认宽度
  
  // 根据 position 计算 label 位置
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
      
      {/* Label - 可配置显示/隐藏和位置 */}
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
              ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600' 
              : 'text-gray-800 bg-white/90'
          }`}
        >
          {label}
        </motion.div>
      )}
    </>
  );
}

export default function TranslationInitiation() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);
  
  // 定义初始位置
  const initialPositions = {
    '17-eIF3': { x: 10, y: 50 },   // 左侧
    '03-eIF1': { x: 10, y: 50 },   // 左侧
    '02-eIF1A': { x: 10, y: 50 },  // 左侧
    '16-40s': { x: 200, y: 50 },    // 右侧
    '06-mRNA-1': { x: 200, y: 400 }, // 下方
    '07-PABP': { x: 200, y: 400 },   // 与 06-mRNA-1 相同位置
    // 第二步新增组件
    '15-eIF2': { x: 450, y: 50 },   // 右侧
    '14-GTP': { x: 450, y: 50 },    // 右侧，与15左对齐
    '11-tRNA': { x: 650, y: 50 },   // 再右侧
    // 第三步新增组件
    '13-eIF5-CTD': { x: 700, y: 50 }, // 右侧
    '12-eIF5-NTD': { x: 700, y: 50 },    // 右侧，与13左对齐
    // 第六步新增组件
    '08-eIF4': { x: 200, y: 400 },    // 与 06-mRNA-1 左对齐上对齐
    // 第七步新增组件（在48S右侧出现，x不同）
    '09-eIF4A': { x: 500, y: 50 },    // 48S右侧
    '04-eIF4B': { x: 650, y: 50 },    // 再右侧，与09 x不同
    // 第九步新增组件（替换06-mRNA-1）
    '05-mRNA-2': { x: 200, y: 400 },  // 与 06-mRNA-1 相同位置
    '01-AUG-2': { x: 200, y: 400 },   // 与 05-mRNA-2 相同位置
    // 第十步新增组件（替换03-eIF1）
    '00-eIF5-NTD-2': { x: 200, y: 400 }, // 与 03-eIF1 在 Step 8 后的位置相同
    // 第十一步新增组件（19和20从上方出现，然后移动到05位置）
    '19-eIF5B': { x: 200, y: 50 },    // 上方
    '20-60s': { x: 200, y: 50 },      // 上方，与19相同位置
    // 第十二步新增组件（18替换19和02）
    '18-eEFs': { x: 200, y: 400 },   // 与 02-eIF1A 和 19-eIF5B 在 Step 11 后的位置相同
  };

  // 获取组件当前位置（根据动画步骤）
  const getComponentPosition = (id) => {
    const initial = initialPositions[id];
    if (!initial) return { x: 50, y: 50 };

    // Step 11: 19和20移动到与05相同位置
    if (animationStep >= 11) {
      if (id === '19-eIF5B' || id === '20-60s') {
        return { x: 200, y: 400 }; // 移动到与 05-mRNA-2 相同的位置
      }
    }

    // Step 8: 48S的所有组件和09、04一起移动到与06相同位置
    if (animationStep >= 8) {
      const moveToMRNAComponents = ['02-eIF1A', '03-eIF1', '17-eIF3', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD', '09-eIF4A', '04-eIF4B'];
      if (moveToMRNAComponents.includes(id)) {
        return { x: 200, y: 400 }; // 移动到与 06-mRNA-1 相同的位置
      }
    }

    // Step 5: 所有相关组件向中间移动至左对齐且上对齐
    if (animationStep >= 5) {
      const alignComponents = ['02-eIF1A', '03-eIF1', '17-eIF3', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD'];
      if (alignComponents.includes(id)) {
        return { x: 350, y: 50 }; // 统一移动到中间位置，左对齐且上对齐
      }
    }

    // Step 0: 初始位置
    if (animationStep === 0) {
      return initial;
    }

    // Step 1+: 17, 03, 02 向右移动到与 16 左对齐
    if (animationStep >= 1) {
      if (id === '17-eIF3' || id === '03-eIF1' || id === '02-eIF1A') {
        return { x: 200, y: initial.y }; // 移动到与 16-40s 相同的 x 坐标 (200)
      }
    }

    // Step 3+: 11 向左移动到与 15+14 相同的 x
    if (animationStep >= 3) {
      if (id === '11-tRNA') {
        return { x: 450, y: initial.y }; // 11 向左移动，与 15+14 左对齐
      }
      // 15-eIF2 和 14-GTP 保持在初始位置 x=450
    }

    // Step 2: 15、14、11 只是出现，保持初始位置（15+14在x=450，11在x=650）
    // Step 4: 12、13 在右侧出现（保持在初始位置 x=700）

    return initial;
  };

  // 获取可见的组件列表
  const getVisibleComponents = () => {
    // Step 12 及以后：19 和 02 消失，18 出现
    if (animationStep >= 12) {
      return allImageComponents.filter(comp => 
        ['11-tRNA', '01-AUG-2', '05-mRNA-2', '16-40s', '20-60s', '18-eEFs', '07-PABP'].includes(comp.id)
      );
    }
    
    // Step 11：只保留 02、11、01、05、16，并显示 19、20
    if (animationStep >= 11) {
      return allImageComponents.filter(comp => 
        ['02-eIF1A', '11-tRNA', '01-AUG-2', '05-mRNA-2', '16-40s', '19-eIF5B', '20-60s', '07-PABP'].includes(comp.id)
      );
    }
    
    let visibleIds = ['17-eIF3', '02-eIF1A', '16-40s', '07-PABP'];
    
    // Step 0-9: 显示 03-eIF1
    if (animationStep < 10) {
      visibleIds.push('03-eIF1');
    }
    
    // Step 0-8: 显示 06-mRNA-1
    if (animationStep < 9) {
      visibleIds.push('06-mRNA-1');
    }
    
    // Step 2 及以后，15、14、11 出现（动画二的第一步）
    if (animationStep >= 2) {
      visibleIds = [...visibleIds, '15-eIF2', '14-GTP', '11-tRNA'];
    }
    
    // Step 4-9：12、13 在右侧出现
    if (animationStep >= 4 && animationStep < 10) {
      visibleIds = [...visibleIds, '13-eIF5-CTD', '12-eIF5-NTD'];
    }
    
    // Step 10 及以后，只显示 13-eIF5-CTD（12-eIF5-NTD 消失）
    if (animationStep >= 10) {
      visibleIds = [...visibleIds, '13-eIF5-CTD'];
    }
    
    // Step 6 及以后，08-eIF4 出现在 06 位置
    if (animationStep >= 6) {
      visibleIds = [...visibleIds, '08-eIF4'];
    }
    
    // Step 7 及以后，09-eIF4A 和 04-eIF4B 在右侧出现
    if (animationStep >= 7) {
      visibleIds = [...visibleIds, '09-eIF4A', '04-eIF4B'];
    }
    
    // Step 9 及以后，06-mRNA-1 消失，05-mRNA-2 和 01-AUG-2 出现
    if (animationStep >= 9) {
      visibleIds = [...visibleIds, '05-mRNA-2', '01-AUG-2'];
    }
    
    // Step 10 及以后，03-eIF1 消失，00-eIF5-NTD-2 出现
    if (animationStep >= 10) {
      visibleIds = [...visibleIds, '00-eIF5-NTD-2'];
    }
    
    return allImageComponents.filter(comp => visibleIds.includes(comp.id));
  };

  // 定义步骤的展示标签（用于右侧面板显示）
  const getStepDisplayLabels = () => {
    if (animationStep === 0) {
      // 步骤0：显示独立组件 - 不显示 mRNA
      const components = ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s'];
      return components.map(id => {
        const comp = allImageComponents.find(c => c.id === id);
        return {
          id: comp.id,
          label: comp.label,
          title: comp.hoverInfo.title,
          description: comp.hoverInfo.content
        };
      });
    } else if (animationStep === 1) {
      // 步骤1：显示单独的组件，不形成43S complex
      const components = ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s'];
      return components.map(id => {
        const comp = allImageComponents.find(c => c.id === id);
        return {
          id: comp.id,
          label: comp.label,
          title: comp.hoverInfo.title,
          description: comp.hoverInfo.content
        };
      });
    } else if (animationStep === 2) {
      // 步骤2：15、14、11 出现（独立显示，未对齐）
      const individualComps = ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s', '15-eIF2', '14-GTP', '11-tRNA'];
      return individualComps.map(id => {
        const comp = allImageComponents.find(c => c.id === id);
        return {
          id: comp.id,
          label: comp.label,
          title: comp.hoverInfo.title,
          description: comp.hoverInfo.content
        };
      });
    } else if (animationStep === 3) {
      // 步骤3：11 向左移动，形成三元复合物（不显示43S complex）
      const individualComps = ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s'];
      return [
        ...individualComps.map(id => {
          const comp = allImageComponents.find(c => c.id === id);
          return {
            id: comp.id,
            label: comp.label,
            title: comp.hoverInfo.title,
            description: comp.hoverInfo.content
          };
        }),
        { 
          id: 'complex-ternary', 
          label: 'Ternary Complex', 
          title: 'Ternary complex',
          description: 'Ternary complex (eIF2–GTP–Met-tRNAi<sup>Met</sup>): Delivers the initiator tRNA to the ribosome during 43S pre-initiation complex formation; its proper binding is stabilized by eIF3 and is essential for start codon recognition and fidelity.',
          components: ['15-eIF2', '14-GTP', '11-tRNA'],
          isComplex: true
        },
      ];
    } else if (animationStep === 4) {
      // 步骤4：12、13 在右侧出现（不显示43S complex）
      const individualComps = ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s'];
      const eif5Comps = ['13-eIF5-CTD', '12-eIF5-NTD'];
      return [
        ...individualComps.map(id => {
          const comp = allImageComponents.find(c => c.id === id);
          return {
            id: comp.id,
            label: comp.label,
            title: comp.hoverInfo.title,
            description: comp.hoverInfo.content
          };
        }),
        { 
          id: 'complex-ternary', 
          label: 'Ternary Complex', 
          title: 'Ternary complex',
          description: 'Ternary complex (eIF2–GTP–Met-tRNAi<sup>Met</sup>): Delivers the initiator tRNA to the ribosome during 43S pre-initiation complex formation; its proper binding is stabilized by eIF3 and is essential for start codon recognition and fidelity.',
          components: ['15-eIF2', '14-GTP', '11-tRNA']
        },
        ...eif5Comps.map(id => {
          const comp = allImageComponents.find(c => c.id === id);
          return {
            id: comp.id,
            label: comp.label,
            title: comp.hoverInfo.title,
            description: comp.hoverInfo.content
          };
        })
      ];
    } else if (animationStep === 5) {
      // 步骤5：所有组件向中间汇聚，形成43S complex（包含eIF5）
      return [
        { 
          id: 'complex-43S', 
          label: '43S PIC', 
          title: '43S pre-initiation complex',
          description: 'The 43S complex is composed of the 40S ribosomal subunit, eIF1, eIF1A, eIF3, eIF5, and the ternary complex (eIF2–GTP–Met-tRNAi<sup>Met</sup>), and it scans the mRNA 5′ UTR to locate the start codon before 60S subunit joining.',
          components: ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD']
        }
      ];
    } else if (animationStep === 6) {
      // 步骤6：eIF4 复合物出现（不显示mRNA）
      return [
        { 
          id: 'complex-43S', 
          label: '43S PIC', 
          title: '43S pre-initiation complex',
          description: 'The 43S complex is composed of the 40S ribosomal subunit, eIF1, eIF1A, eIF3, eIF5, and the ternary complex (eIF2–GTP–Met-tRNAi<sup>Met</sup>), and it scans the mRNA 5′ UTR to locate the start codon before 60S subunit joining.',
          components: ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD']
        },
        { 
          id: 'complex-eIF4F', 
          label: 'eIF4F complex', 
          title: 'eIF4F complex',
          description: 'A cap-binding complex composed of eIF4E, eIF4G, and eIF4A that binds the 5′ cap of mRNA and recruits the 43S complex to initiate scanning along the 5′ UTR.<br><br><b>eIF4E:</b> Cap-binding protein that specifically recognizes the 7-methylguanosine (m⁷G) cap at the 5′ end of mRNA, anchoring the eIF4F complex to the transcript.<br><br><b>eIF4G:</b> A large scaffolding protein that connects eIF4E, eIF4A, eIF3, PABP, and mRNA, bridging the 5′ and 3′ ends of the transcript to facilitate closed-loop mRNA structure and 43S recruitment.<br><br><b>eIF4A:</b> A DEAD-box RNA helicase that unwinds secondary structures in the 5′ UTR of mRNA to enable scanning by the 43S complex; functions both as part of the eIF4F complex and independently at the mRNA entry site with eIF4B.',
          components: ['08-eIF4']
        },
      ];
    } else if (animationStep === 7) {
      // 步骤7：eIF4A 和 eIF4B 出现（显示43S和eIF4F两个complex，不显示mRNA）
      return [
        { 
          id: 'complex-43S', 
          label: '43S PIC', 
          title: '43S pre-initiation complex',
          description: 'The 43S complex is composed of the 40S ribosomal subunit, eIF1, eIF1A, eIF3, eIF5, and the ternary complex (eIF2–GTP–Met-tRNAi<sup>Met</sup>), and it scans the mRNA 5′ UTR to locate the start codon before 60S subunit joining.',
          components: ['17-eIF3', '03-eIF1', '02-eIF1A', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD']
        },
        { 
          id: 'complex-eIF4F', 
          label: 'eIF4F complex', 
          title: 'eIF4F complex',
          description: 'A cap-binding complex composed of eIF4E, eIF4G, and eIF4A that binds the 5′ cap of mRNA and recruits the 43S complex to initiate scanning along the 5′ UTR.<br><br><b>eIF4E:</b> Cap-binding protein that specifically recognizes the 7-methylguanosine (m⁷G) cap at the 5′ end of mRNA, anchoring the eIF4F complex to the transcript.<br><br><b>eIF4G:</b> A large scaffolding protein that connects eIF4E, eIF4A, eIF3, PABP, and mRNA, bridging the 5′ and 3′ ends of the transcript to facilitate closed-loop mRNA structure and 43S recruitment.<br><br><b>eIF4A:</b> A DEAD-box RNA helicase that unwinds secondary structures in the 5′ UTR of mRNA to enable scanning by the 43S complex; functions both as part of the eIF4F complex and independently at the mRNA entry site with eIF4B.',
          components: ['08-eIF4']
        },
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '09-eIF4A');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '04-eIF4B');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
      ];
    } else if (animationStep === 8) {
      // 步骤8：所有组件移动到 mRNA 位置，形成48S open complex
      return [
        { 
          id: 'complex-48S-open', 
          label: '48S open complex', 
          title: '48S open complex',
          description: 'An intermediate scanning-competent complex formed when the 43S pre-initiation complex is recruited to the mRNA; characterized by an open conformation of the 40S subunit that allows scanning along the 5′ UTR.',
          components: ['02-eIF1A', '03-eIF1', '17-eIF3', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD', '09-eIF4A', '04-eIF4B', '06-mRNA-1', '08-eIF4']
        },
      ];
    } else if (animationStep === 9) {
      // 步骤9：06 消失，05 和 01 出现（继续显示48S open complex）
      return [
        { 
          id: 'complex-48S-open', 
          label: '48S open complex', 
          title: '48S open complex',
          description: 'An intermediate scanning-competent complex formed when the 43S pre-initiation complex is recruited to the mRNA; characterized by an open conformation of the 40S subunit that allows scanning along the 5′ UTR.<br><br>The 48S complex scans the mRNA to locate the start codon.',
          components: ['02-eIF1A', '03-eIF1', '17-eIF3', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '12-eIF5-NTD', '09-eIF4A', '04-eIF4B', '05-mRNA-2', '01-AUG-2', '08-eIF4']
        },
      ];
    } else if (animationStep >= 12) {
      // 步骤12：19 和 02 消失，18 出现（不显示AUG和mRNA）
      return [
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '11-tRNA');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '16-40s');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '20-60s');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '18-eEFs');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
      ];
    } else if (animationStep >= 11) {
      // 步骤11：大部分组件离开，19 和 20 出现并移动（不显示AUG和mRNA）
      return [
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '02-eIF1A');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '11-tRNA');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '16-40s');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '19-eIF5B');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
        ...(() => {
          const comp = allImageComponents.find(c => c.id === '20-60s');
          return [{ id: comp.id, label: comp.label, title: comp.hoverInfo.title, description: comp.hoverInfo.content }];
        })(),
      ];
    } else if (animationStep >= 10) {
      // 步骤10：03-eIF1 和 12-eIF5-NTD 消失，00-eIF5-NTD-2 出现，形成48S closed complex
      return [
        { 
          id: 'complex-48S-closed', 
          label: '48S closed complex', 
          title: '48S closed complex',
          description: 'A conformationally locked state of the 48S initiation complex that forms upon accurate start codon recognition; characterized by full insertion of Met-tRNAi<sup>Met</sup> into the P site, release of eIF1, and a closed 40S head conformation that stabilizes the codon–anticodon interaction.',
          components: ['02-eIF1A', '00-eIF5-NTD-2', '17-eIF3', '16-40s', '15-eIF2', '14-GTP', '11-tRNA', '13-eIF5-CTD', '09-eIF4A', '04-eIF4B', '05-mRNA-2', '01-AUG-2', '08-eIF4']
        },
      ];
    }
    return [];
  };

  // 下一步
  const nextStep = () => {
    setAnimationStep(prev => prev + 1);
  };

  // 上一步
  const prevStep = () => {
    setAnimationStep(prev => Math.max(0, prev - 1));
  };

  // 重置
  const reset = () => {
    setAnimationStep(0);
  };

  return (
    <div className="w-full h-screen relative bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* 左侧 Timeline */}
      <div className="w-64 bg-white border-r-2 border-gray-200 overflow-y-auto shadow-xl">
        <div className="p-4">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Translation Initiation</h3>
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
                className={`flex items-start gap-3 text-sm transition-all cursor-pointer hover:bg-gray-50 p-2 rounded ${
                  item.step === animationStep 
                    ? 'font-bold text-blue-600 bg-blue-50' 
                    : item.step < animationStep 
                      ? 'text-gray-600' 
                      : 'text-gray-400'
                }`}
                onClick={() => setAnimationStep(item.step)}
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

      <div className="flex-1 relative overflow-hidden">
        {/* 控制按钮 */}
        <div className="absolute bottom-8 right-8 flex gap-4 z-50">
          <button 
            onClick={prevStep} 
            disabled={animationStep === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md transition font-medium"
          >
            Previous
          </button>
          <button 
            onClick={reset}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow-md transition font-medium"
          >
            Reset
          </button>
          <button 
            onClick={nextStep}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition font-medium"
          >
            Next
          </button>
        </div>

        {/* 动画组件显示 */}
        <div className="w-full h-full relative" style={{ marginLeft: '-200px' }}>
          <AnimatePresence>
            {getVisibleComponents()
              .sort((a, b) => b.layer - a.layer)
              .map((comp) => {
                const position = getComponentPosition(comp.id);
                
                // Step 11: 为 19 和 20 添加特殊的动画延迟
                let transitionDelay = 0;
                let initialPosition = position;
                
                if (animationStep === 11 && (comp.id === '19-eIF5B' || comp.id === '20-60s')) {
                  // 19 和 20 在 Step 11 时有特殊的动画序列
                  transitionDelay = 0.8; // 第一部分：其他组件离开后，19和20才出现
                  initialPosition = initialPositions[comp.id]; // 从初始位置（上方）出现
                }
                
                // Step 12: 为 18 添加延迟，让它在 19 和 02 消失后再出现
                if (animationStep === 12 && comp.id === '18-eEFs') {
                  transitionDelay = 1.2; // 延迟出现
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
      {/* 右侧信息面板 */}
      <div className="w-96 bg-white border-l-2 border-gray-200 overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* 步骤说明 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
            <h3 className="font-bold text-lg text-blue-900 mb-2">
              {animationStep === 0 && "Initial State"}
              {animationStep === 1 && "Ribosome Recruitment"}
              {animationStep === 2 && "Ternary Complex Components"}
              {animationStep === 3 && "Ternary Complex Formation"}
              {animationStep === 4 && "eIF5 Recruitment"}
              {animationStep === 5 && "43S PIC Assembly Complete"}
              {animationStep === 6 && "mRNA Cap Recognition"}
              {animationStep === 7 && "Helicase Recruitment"}
              {animationStep === 8 && "48S Open Complex Formation"}
              {animationStep === 9 && "mRNA Scanning"}
              {animationStep === 10 && "Start Codon Recognition"}
              {animationStep === 11 && "60S Subunit Joining"}
              {animationStep === 12 && "Elongation Begins"}
              {animationStep >= 13 && "Translation Initiation Complete"}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {animationStep === 0 && "eIF3, eIF1, and eIF1A exist as individual factors before ribosome binding."}
              {animationStep === 1 && "eIF3, eIF1, and eIF1A associate with the 40S ribosomal subunit to form the 43S pre-initiation complex (PIC)."}
              {animationStep === 2 && "eIF2, GTP, and Met-tRNAi are present independently before complex formation."}
              {animationStep === 3 && "eIF2·GTP binds Met-tRNAi to form the ternary complex, which is essential for start codon recognition."}
              {animationStep === 4 && "The two domains of eIF5 (CTD and NTD) join the assembly to prepare for start codon recognition."}
              {animationStep === 5 && "All initiation factors and the ternary complex converge on the 40S subunit, forming a mature 43S PIC ready for mRNA recruitment."}
              {animationStep === 6 && "The eIF4F complex (eIF4E-eIF4G-eIF4A) binds to the 5′ cap structure of mRNA."}
              {animationStep === 7 && "eIF4A and eIF4B are recruited to unwind secondary structures in the 5′ UTR, preparing for ribosome attachment."}
              {animationStep === 8 && "The 43S PIC is recruited to the mRNA via eIF4F, forming the 48S open complex with an open 40S conformation."}
              {animationStep === 9 && "The 48S complex scans the 5′ UTR in the 5′→3′ direction, searching for the start codon (AUG) in optimal context."}
              {animationStep === 10 && "Upon AUG recognition, eIF1 is released and the eIF5-NTD moves into the P site, stabilizing the closed 48S complex with Met-tRNAi positioned at the start codon."}
              {animationStep === 11 && "eIF5B facilitates the joining of the 60S subunit to form the 80S initiation complex. Most initiation factors are released during this transition."}
              {animationStep === 12 && "eIF5B and eIF1A dissociate, and eEFs (elongation factors) take over to drive the elongation phase of translation."}
              {animationStep >= 13 && "The ribosome is now ready to begin synthesizing the protein!"}
            </p>
          </div>

          {/* 当前显示的组件/复合物 */}
          <h3 className="font-bold text-gray-800 mb-3">Players</h3>
          <div className="space-y-3">
            {getStepDisplayLabels().map((item) => {
              // 如果是复合物，显示复合物信息
              if (item.components) {
                const isSelected = selectedComponent?.id === item.id;
                
                return (
                  <div key={item.id}>
                    <div
                      className={`p-3 rounded-lg border-2 cursor-pointer transition border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-600 ${
                        isSelected ? 'ring-2 ring-offset-2 ring-purple-500' : ''
                      }`}
                      onClick={() => setSelectedComponent(isSelected ? null : item)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-purple-200 px-2 py-0.5 rounded">
                          Complex
                        </span>
                        <h4 className="font-bold text-base text-purple-900">{item.title}</h4>
                      </div>
                    </div>
                    
                    {/* 展开的详细信息 - 复合物不显示图片 */}
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
                          className="overflow-hidden p-4 rounded-lg border-2 border-purple-300 bg-white"
                        >
                          <p 
                            className="text-xs text-gray-700 mb-3 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                          <div className="text-xs text-gray-600 pt-3 border-t border-purple-200">
                            <span className="font-semibold">Including:</span> {
                              // 特殊处理不同 complex 的组件显示
                              item.id === 'complex-eIF4F' 
                                ? 'eIF4E, eIF4G, eIF4A'
                                : item.id === 'complex-48S-open'
                                ? 'eIF1A, eIF1, eIF3, 40s, eIF2, GTP, tRNA, eIF5-CTD, eIF5-NTD, eIF4A, eIF4B, eIF4'
                                : item.id === 'complex-48S-closed'
                                ? 'eIF1A, eIF5-NTD-2, eIF3, 40s, eIF2, GTP, tRNA, eIF5-CTD, eIF4A, eIF4B, mRNA, AUG, eIF4'
                                : item.components.map(id => {
                                    const comp = allImageComponents.find(c => c.id === id);
                                    return comp?.label;
                                  }).join(', ')
                            }
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              
              // 如果是单个组件，显示组件信息
              const comp = allImageComponents.find(c => c.id === item.id);
              if (!comp) return null;
              
              // 判断是否是 eIF 组件
              const isEIF = comp.id.toLowerCase().includes('eif');
              const isSelected = selectedComponent?.id === comp.id;
              
              return (
                <div key={item.id}>
                  <div
                    className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                      isEIF 
                        ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-600' 
                        : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400'
                    } ${isSelected ? 'ring-2 ring-offset-2 ' + (isEIF ? 'ring-purple-500' : 'ring-blue-500') : ''}`}
                    onClick={() => setSelectedComponent(isSelected ? null : comp)}
                  >
                    <h4 className={`font-bold text-base ${isEIF ? 'text-purple-900' : 'text-gray-900'}`}>
                      {item.title || comp.hoverInfo.title}
                    </h4>
                  </div>
                  
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
                        className={`overflow-hidden p-4 rounded-lg border-2 ${
                          isEIF 
                            ? 'border-purple-300 bg-white' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex gap-3 mb-3">
                          <img 
                            src={comp.image} 
                            alt={comp.label} 
                            className="w-20 h-20 object-contain flex-shrink-0" 
                          />
                          <div className="flex-1">
                            <h5 className={`font-bold text-sm mb-2 ${isEIF ? 'text-purple-900' : 'text-gray-900'}`}>
                              {comp.hoverInfo.title}
                            </h5>
                            <p 
                              className="text-xs text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: comp.hoverInfo.content }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
