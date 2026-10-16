import Shell from './components/Shell'
import Hero from './sections/Hero'
import Living from './sections/Living'
import Why from './sections/Why'
import Moments from './sections/Moments'
import Pillars from './sections/Pillars'
import DesignStay from './sections/DesignStay'
import Paths from './sections/Paths'
import Founding from './sections/Founding'
import LivingNetwork from './sections/LivingNetwork'
import Places from './sections/Places'
import AppShowcase from './sections/AppShowcase'
import Join from './sections/Join'
import Closing from './sections/Closing'

// The story, in order: feel it → why it exists → what it is → what life inside looks like → what makes it different →
// try it → who it's for → how it grows → where → what's coming → who we need first → join → close
export default function App() {
  return (
    <Shell home>
      <Hero />
      <Why />
      <Living />
      <Moments />
      <Pillars />
      <DesignStay />
      <Paths />
      <LivingNetwork />
      <Places />
      <AppShowcase />
      <Founding />
      <Join />
      <Closing />
    </Shell>
  )
}
