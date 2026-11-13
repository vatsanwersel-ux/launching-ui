import { MotionConfig } from 'motion/react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SilkBackground } from './components/SilkBackground'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="page">
        <SilkBackground />
        <Header />
        <main className="page__main">
          <Hero />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
