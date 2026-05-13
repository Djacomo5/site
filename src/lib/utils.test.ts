import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPhone, formatDate } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats BRL currency correctly', () => {
    expect(formatCurrency(100)).toContain('R$')
    expect(formatCurrency(100)).toContain('100,00')
    expect(formatCurrency(1234.56)).toContain('1.234,56')
  })
})

describe('formatPhone', () => {
  it('formats 11-digit phone numbers', () => {
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999')
  })

  it('formats 10-digit phone numbers', () => {
    expect(formatPhone('1199999999')).toBe('(11) 9999-9999')
  })

  it('returns original for invalid length', () => {
    expect(formatPhone('1234')).toBe('1234')
  })
})

describe('formatDate', () => {
  it('formats ISO date strings', () => {
    const result = formatDate('2024-01-15')
    expect(result).toContain('15')
    expect(result).toContain('01')
    expect(result).toContain('2024')
  })
})