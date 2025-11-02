// src/components/translationConfig.js
// 蛋白质翻译起始过程的组件配置数据

// 所有图片组件配置（按图层排序，数字越小越在上方）
export const allImageComponents = [
  {
    id: "00-eIF5-NTD-2",
    label: "eIF5-NTD-2",
    image: "00-eIF5-NTD-2.png",
    layer: 0,
    height: 500,
    hoverInfo: {
      title: "eIF5-NTD-2",
      content: "eIF5 的 N 端结构域，参与翻译起始复合物的组装和调控。具有 GTPase 激活功能，对翻译起始过程至关重要。"
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "01-AUG-2",
    label: "AUG-2",
    image: "01-AUG-2.png",
    layer: 1,
    height: 500,
    hoverInfo: {
      title: "AUG",
      content: "AUG 是蛋白质翻译的起始密码子，编码甲硫氨酸。它标志着 mRNA 上蛋白质合成的起始位点。"
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "02-eIF1A",
    label: "eIF1A",
    image: "02-eIF1A.png",
    layer: 2,
    height: 500,
    hoverInfo: {
      title: "eIF1A",
      content: "Works with eIF1 to maintain the open conformation of the 40S subunit for scanning; upon start codon recognition, it stabilizes codon–anticodon interactions and assists in 60S joining."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "03-eIF1",
    label: "eIF1",
    image: "03-eIF1.png",
    layer: 3,
    height: 500,
    hoverInfo: {
      title: "eIF1",
      content: "Binds near the ribosomal decoding center and ensures start codon fidelity by preventing incorrect base-pairing during scanning; its release is triggered upon correct AUG recognition."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "04-eIF4B",
    label: "eIF4B",
    image: "04-eIF4B.png",
    layer: 4,
    height: 500,
    hoverInfo: {
      title: "eIF4B",
      content: "An auxiliary factor that enhances the helicase activity of eIF4A, particularly at the mRNA entry site of the 43S complex, facilitating the unwinding of mRNA secondary structures during scanning."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "05-mRNA-2",
    label: "mRNA-2",
    image: "05-mRNA-2.png",
    layer: 5,
    height: 500,
    hoverInfo: {
      title: "mRNA",
      content: "mRNA 携带从 DNA 转录而来的遗传信息，作为蛋白质合成的模板。它的 5' 端有帽子结构，3' 端有 poly(A) 尾巴。"
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "06-mRNA-1",
    label: "mRNA-1",
    image: "06-mRNA-1.png",
    layer: 6,
    height: 500,
    hoverInfo: {
      title: "mRNA",
      content: "mRNA 携带从 DNA 转录而来的遗传信息，作为蛋白质合成的模板。它的 5' 端有帽子结构，3' 端有 poly(A) 尾巴。"
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "07-PABP",
    label: "PABP",
    image: "07-PABP.png",
    layer: 7,
    height: 500,
    hoverInfo: {
      title: "PABP",
      content: "PABP 结合在 mRNA 的 3' poly(A) 尾巴上，与 5' 端的 eIF4G 相互作用，形成环状结构，增强翻译效率和 mRNA 稳定性。"
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "08-eIF4",
    label: "eIF4",
    image: "08-eIF4.png",
    layer: 8,
    height: 500,
    hoverInfo: {
      title: "eIF4F complex",
      content: "A cap-binding complex composed of eIF4E, eIF4G, and eIF4A that binds the 5′ cap of mRNA and recruits the 43S complex to initiate scanning along the 5′ UTR.<br><br><b>eIF4E:</b> Cap-binding protein that specifically recognizes the 7-methylguanosine (m⁷G) cap at the 5′ end of mRNA, anchoring the eIF4F complex to the transcript.<br><br><b>eIF4G:</b> A large scaffolding protein that connects eIF4E, eIF4A, eIF3, PABP, and mRNA, bridging the 5′ and 3′ ends of the transcript to facilitate closed-loop mRNA structure and 43S recruitment.<br><br><b>eIF4A:</b> A DEAD-box RNA helicase that unwinds secondary structures in the 5′ UTR of mRNA to enable scanning by the 43S complex; functions both as part of the eIF4F complex and independently at the mRNA entry site with eIF4B."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "09-eIF4A",
    label: "eIF4A",
    image: "09-eIF4A.png",
    layer: 9,
    height: 500,
    hoverInfo: {
      title: "eIF4A",
      content: "A DEAD-box RNA helicase that unwinds secondary structures in the 5′ UTR of mRNA to enable scanning by the 43S complex; functions both as part of the eIF4F complex and independently at the mRNA entry site with eIF4B."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "10-tRNA-name",
    label: "tRNA-name",
    image: "10-tRNA-name.png",
    layer: 10,
    height: 500,
    hoverInfo: {
      title: "tRNA-name",
      content: "标记起始 tRNA 的名称和位置，用于标识携带甲硫氨酸的起始 tRNA (Met-tRNAi)。"
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "11-tRNA",
    label: "tRNA",
    image: "11-tRNA.png",
    layer: 11,
    height: 500,
    hoverInfo: {
      title: "Met-tRNAi",
      content: "The initiator tRNA charged with methionine, which base-pairs with the start codon in the P site of the 40S subunit and is essential for accurate initiation and transition to the elongation phase."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "12-eIF5-NTD",
    label: "eIF5-NTD",
    image: "12-eIF5-NTD.png",
    layer: 12,
    height: 500,
    hoverInfo: {
      title: "eIF5-NTD",
      content: "The N-terminal domain of eIF5 replaces eIF1 at the ribosomal P site upon start codon recognition, stabilizing the closed conformation of the 48S complex and facilitating subunit joining."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "13-eIF5-CTD",
    label: "eIF5-CTD",
    image: "13-eIF5-CTD.png",
    layer: 13,
    height: 500,
    hoverInfo: {
      title: "eIF5-CTD",
      content: "The C-terminal domain of eIF5 interacts with eIF3c and components of the ternary complex near the decoding center, contributing to start codon recognition and 43S complex stabilization."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "14-GTP",
    label: "GTP",
    image: "14-GTP.png",
    layer: 14,
    height: 500,
    hoverInfo: {
      title: "GTP",
      content: "GTP (guanosine triphosphate) is an energy carrier molecule that binds to eIF2 and is essential for ternary complex formation and translation initiation."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "15-eIF2",
    label: "eIF2",
    image: "15-eIF2.png",
    layer: 15,
    height: 500,
    hoverInfo: {
      title: "eIF2",
      content: "A GTPase that forms a ternary complex with GTP and Met-tRNAi<sup>Met</sup>; it delivers the initiator tRNA to the P site of the 40S subunit and undergoes GTP hydrolysis upon start codon recognition, enabling release and transition to elongation."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "16-40s",
    label: "40s",
    image: "16-40s.png",
    layer: 16,
    height: 500,
    hoverInfo: {
      title: "40S",
      content: "Serves as the platform for the 43S pre-initiation complex; it binds initiation factors and the ternary complex, scans the 5′ UTR of mRNA, and positions the start codon in its P site for accurate translation initiation."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "17-eIF3",
    label: "eIF3",
    image: "17-eIF3.png",
    layer: 17,
    height: 500,
    hoverInfo: {
      title: "eIF3",
      content: "A large multi-subunit complex that scaffolds the 43S pre-initiation complex, stabilizes ternary complex binding, facilitates recruitment of the ribosome to mRNA, and bridges ribosome recycling to a new round of initiation."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "18-eEFs",
    label: "eEFs",
    image: "18-eEFs.png",
    layer: 18,
    height: 500,
    hoverInfo: {
      title: "eEFs (Eukaryotic Elongation Factors)",
      content: "eEFs drive the elongation phase of translation by coordinating tRNA delivery and ribosomal movement. Specifically, eEF1A delivers aminoacyl-tRNAs to the A site in a GTP-dependent manner, ensuring correct codon–anticodon pairing, while eEF2 catalyzes ribosomal translocation along the mRNA after peptide bond formation, using energy from GTP hydrolysis to shift the tRNAs and mRNA by one codon."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "19-eIF5B",
    label: "eIF5B",
    image: "19-eIF5B.png",
    layer: 19,
    height: 500,
    hoverInfo: {
      title: "eIF5B",
      content: "eIF5B is a GTPase that promotes the joining of the 60S subunit by remodeling the 48S complex and positioning the Met-tRNAi<sup>Met</sup> into the peptidyl transferase center. Upon GTP hydrolysis, it facilitates the release of eIF1A and itself, finalizing 80S assembly and allowing translation elongation to begin."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
  {
    id: "20-60s",
    label: "60s",
    image: "20-60s.png",
    layer: 20,
    height: 500,
    hoverInfo: {
      title: "60S",
      content: "The 60S subunit joins the 48S complex after start codon recognition to form the functional 80S initiation complex. This joining marks the transition from initiation to elongation and requires proper positioning of Met-tRNAi<sup>Met</sup> to avoid steric clashes."
    },
    labelConfig: {
      show: false,
      position: "bottom",
      offsetX: 0,
      offsetY: 10,
    }
  },
];
