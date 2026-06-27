import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SkillsCarousel, type SkillItem } from './SkillsCarousel'

const items: SkillItem[] = [
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'Vue' },
  { name: 'Angular' },
  { name: 'Node.js' },
  { name: 'Vite' },
]

describe('SkillsCarousel', () => {
  test('renders a page of skills', () => {
    render(<SkillsCarousel items={items} visibleCount={3} autoPlayMs={null} />)
    expect(screen.getByRole('heading', { name: /tech i enjoy/i })).toBeInTheDocument()

    // Should display first 3 items on initial page
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
  })

  test('navigates next and previous', async () => {
    const user = userEvent.setup()
    render(<SkillsCarousel items={items} visibleCount={3} autoPlayMs={null} />)

    // Next to page 2
    await user.click(screen.getByTestId('next-btn'))
    expect(screen.getByText('Vue')).toBeInTheDocument()
    expect(screen.getByText('Angular')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()

    // Prev back to page 1
    await user.click(screen.getByTestId('prev-btn'))
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  test('can jump via dots', async () => {
    const user = userEvent.setup()
    render(<SkillsCarousel items={items} visibleCount={3} autoPlayMs={null} />)
    const dot1 = screen.getByTestId('dot-1')
    await user.click(dot1)
    expect(screen.getByText('Vue')).toBeInTheDocument()
  })
})

