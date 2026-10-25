import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedTabs } from './SegmentedTabs'

const tabs = [
  { key: 'ALL', label: 'All', count: 5 },
  { key: 'SUSP', label: 'Suspended', count: 1 },
] as const

describe('SegmentedTabs', () => {
  it('renders each tab with its count and marks the active one', () => {
    render(<SegmentedTabs tabs={[...tabs]} value="ALL" onChange={() => {}} label="Status" />)

    expect(screen.getByRole('tablist', { name: 'Status' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'All 5' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Suspended 1' })).toHaveAttribute('aria-selected', 'false')
  })

  it('reports the clicked tab', async () => {
    const onChange = vi.fn()
    render(<SegmentedTabs tabs={[...tabs]} value="ALL" onChange={onChange} />)

    await userEvent.click(screen.getByRole('tab', { name: /suspended/i }))

    expect(onChange).toHaveBeenCalledWith('SUSP')
  })
})
