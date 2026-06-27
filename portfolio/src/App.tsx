import './App.css'
import { SkillsCarousel, type SkillItem } from './components/SkillsCarousel'

function App() {
  const tech: SkillItem[] = [
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'React', color: '#20232A' },
    { name: 'Next.js', color: '#000000' },
    { name: 'Vue', color: '#35495E' },
    { name: 'Angular', color: '#DD0031' },
    { name: 'Node.js', color: '#43853D' },
    { name: 'Vite', color: '#646CFF' },
    { name: 'Tailwind', color: '#06B6D4' },
    { name: 'AWS', color: '#232F3E' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'PostgreSQL', color: '#4169E1' },
    { name: 'MongoDB', color: '#47A248' },
    { name: 'Playwright', color: '#2EAD33' },
    { name: 'Cypress', color: '#17202C' },
    { name: 'Three.js', color: '#000000' },
  ]

  return (
    <div style={{ padding: 24 }}>
      <SkillsCarousel items={tech} visibleCount={6} />
    </div>
  )
}

export default App
