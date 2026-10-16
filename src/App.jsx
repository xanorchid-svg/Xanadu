import Shell from './components/Shell'
import Hero from './sections/Hero'
import Living from './sections/Living'
import Why from './sections/Why'
import Pillars from './sections/Pillars'
import DesignStay from './sections/DesignStay'
import Paths from './sections/Paths'
import Founding from './sections/Founding'
import Places from './sections/Places'
import AppShowcase from './sections/AppShowcase'
import Join from './sections/Join'
import Closing from './sections/Closing'

// The story, in order: feel it → what it is → why it exists → what makes it different →
// try it → who it's for → who we need first → where → what's coming → join → close
export default function App() {
  return (
    <Shell home>
      <Hero />
      <Living />
      <Why />
      <Pillars />
      <DesignStay />
      <Paths />
      <Founding />
      <Places />
      <AppShowcase />
      <Join />
      <Closing />
    </Shell>
  )
}
