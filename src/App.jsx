import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 10 })
  const [eggPosition, setEggPosition] = useState({ x: 50, y: 80 })
  const [eggFlying, setEggFlying] = useState(false)
  const [eggHit, setEggHit] = useState(false)
  const [score, setScore] = useState(0)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [showBulletEffect, setShowBulletEffect] = useState(false)
  const [showSorryMessage, setShowSorryMessage] = useState(false)
  const [showPlayAgain, setShowPlayAgain] = useState(false)

  const audioRef = useRef(null)
  const animationRef = useRef(null)

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  const moveImageToNewPosition = () => {
    const newX = Math.random() * 80 + 10
    const newY = Math.random() * 20 + 5
    setImagePosition({ x: newX, y: newY })
  }

  const resetGame = () => {
    setScore(0)
    setShowPlayAgain(false)
    setEggPosition({ x: Math.random() * 80 + 10, y: 80 })
    setEggFlying(false)
    setEggHit(false)
    setShowScoreAnimation(false)
    setShowBulletEffect(false)
    setShowSorryMessage(false)
    moveImageToNewPosition()
  }

  const hitImage = () => {
    if (!eggFlying && !showPlayAgain) {
      setEggFlying(true)
      setEggHit(false)

      const startTime = Date.now()
      const duration = 1000

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const currentX = eggPosition.x + (imagePosition.x - eggPosition.x) * progress
        const currentY = eggPosition.y - (eggPosition.y - imagePosition.y) * progress - 20 * Math.sin(progress * Math.PI)

        setEggPosition({ x: currentX, y: currentY })

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setEggHit(true)
          setShowBulletEffect(true)
          setShowSorryMessage(true)
          playSound()

          const newScore = score + 10
          setScore(newScore)
          setShowScoreAnimation(true)

          // Check if score reached 100
          if (newScore >= 100) {
            setShowPlayAgain(true)
          } else {
            moveImageToNewPosition()
          }

          setTimeout(() => {
            if (!showPlayAgain) {
              setEggPosition({ x: Math.random() * 80 + 10, y: 80 })
              setEggFlying(false)
              setEggHit(false)
              setShowScoreAnimation(false)
              setShowBulletEffect(false)
              setShowSorryMessage(false)
            }
          }, 1000)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fun-game">
      <audio ref={audioRef} src="/sound.mp3" preload="auto" />

      <div className="game-container">
        <div className="game-area">
          {/* Floating clouds */}
          <div className="cloud cloud1">☁️</div>
          <div className="cloud cloud2">☁️</div>
          <div className="cloud cloud3">☁️</div>

          {/* Score display */}
          <div className="score-display">
            <div className="score-label">🎯 Score</div>
            <div className="score-value">{score}</div>
            {showScoreAnimation && (
              <div className="score-popup">+10! 🎉</div>
            )}
          </div>

          {/* Developer credit */}
          <div className="developer-credit">
            <span>Developed by Ashikur Rahman Ovi</span>
          </div>

          {/* Target Image */}
          <div
            className={`target-image ${eggFlying ? 'flying' : ''} ${showBulletEffect ? 'hit-effect' : ''}`}
            style={{
              left: `${imagePosition.x}%`,
              top: `${imagePosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={hitImage}
          >
            <img src="/funny.jpg" alt="Target" />
            <div className="target-glow"></div>

            {/* Bullet effect */}
            {showBulletEffect && (
              <div className="bullet-effect">
                <div className="bullet-hole">💥</div>
                <div className="bullet-sparks">
                  <span>✨</span>
                  <span>💫</span>
                  <span>⭐</span>
                </div>
              </div>
            )}
          </div>

          {/* Egg */}
          <div
            className={`egg ${eggFlying ? 'flying' : ''} ${eggHit ? 'hit' : ''}`}
            style={{
              left: `${eggPosition.x}%`,
              top: `${eggPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            🥚
          </div>

          {/* Sorry message */}
          {showSorryMessage && (
            <div className="sorry-message">
              <div className="sorry-bubble">
                <span>Sorry Dibba Amar Abba! 😅</span>
              </div>
            </div>
          )}

          {/* Play Again button */}
          {showPlayAgain && (
            <div className="play-again-overlay">
              <div className="play-again-content">
                <h2>🎉 Congratulations! 🎉</h2>
                <p>You reached 100 points!</p>
                <button className="play-again-btn" onClick={resetGame}>
                  🎮 Play Again!
                </button>
              </div>
            </div>
          )}

          {/* Fun instructions */}
          {!showPlayAgain && (
            <div className="fun-instructions">
              <div className="instruction-bubble">
                <span>👆 Tap the target!</span>
              </div>
            </div>
          )}

          {/* Fun particles */}
          {eggHit && (
            <div className="particles">
              <div className="particle">✨</div>
              <div className="particle">💫</div>
              <div className="particle">⭐</div>
              <div className="particle">🎊</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
