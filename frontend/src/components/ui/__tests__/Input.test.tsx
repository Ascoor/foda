import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  it('renders with the default styling and Arabic placeholder', () => {
    render(<Input placeholder="أدخل الاسم الكامل" aria-label="الاسم" />)

    const input = screen.getByRole('textbox', { name: 'الاسم' }) as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.placeholder).toBe('أدخل الاسم الكامل')
    expect(input.className).toContain('rounded-lg')
  })

  it('merges custom classes for English forms', () => {
    render(<Input placeholder="Campaign name" className="text-base" />)

    const input = screen.getByPlaceholderText('Campaign name')
    expect(input.className).toContain('text-base')
    expect(input.className).toContain('border')
  })

  it('respects RTL direction when provided', () => {
    render(<Input defaultValue="القاهرة" dir="rtl" aria-label="المدينة" />)

    const input = screen.getByDisplayValue('القاهرة')
    expect(input).toHaveAttribute('dir', 'rtl')
  })
})
