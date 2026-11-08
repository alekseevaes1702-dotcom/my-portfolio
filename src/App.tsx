import { StoreProvider } from './lib/store'
import { CursorGlow, NeuralBg, ScrollBar } from './components/fx'
import Nav from './components/Nav'
import Hero from './components/Hero'
import { About, Cases, Contacts, CurrentEducation, Footer, Marquee, Related, Skills } from './components/Sections'
import EditorPanel from './components/EditorPanel'

export default function App() {
  return (
    <StoreProvider>
      <NeuralBg />
      <CursorGlow />
      <ScrollBar />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Cases />
        <Related />
        <CurrentEducation />
        <Contacts />
        <Footer />
      </main>
      <EditorPanel />
    </StoreProvider>
  )
}
