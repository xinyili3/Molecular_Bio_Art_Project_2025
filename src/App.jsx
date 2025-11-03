import { useState } from 'react'
import WelcomePage from './components/WelcomePage'
import TranslationInitiation from './components/TranslationInitiation'
import InteractiveMode from './components/InteractiveMode'

function App() {
  const [hasEntered, setHasEntered] = useState(false) // 是否已进入应用
  const [mode, setMode] = useState('animation') // 'animation' 或 'interactive'
  const [geneName, setGeneName] = useState('') // 用户输入的基因名

  const toggleMode = () => {
    setMode(mode === 'animation' ? 'interactive' : 'animation')
  }

  const handleEnter = (name) => {
    setGeneName(name)
    setHasEntered(true)
  }

  // 如果还没进入，显示欢迎页
  if (!hasEntered) {
    return <WelcomePage onEnter={handleEnter} />
  }

  return (
    <>
      {/* 渲染对应模式，传递切换函数和基因名 */}
      {mode === 'animation' ? (
        <TranslationInitiation onToggleMode={toggleMode} currentMode="animation" geneName={geneName} />
      ) : (
        <InteractiveMode onToggleMode={toggleMode} currentMode="interactive" geneName={geneName} />
      )}
    </>
  )
}

export default App
