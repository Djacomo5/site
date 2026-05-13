import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/components/shared/EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        title="Nenhum cliente"
        description="Nenhum cliente encontrado"
      />
    )

    expect(screen.getByText('Nenhum cliente')).toBeInTheDocument()
    expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument()
  })

  it('renders action button when provided', () => {
    const onClick = () => {}
    render(
      <EmptyState
        title="Nenhum cliente"
        description="Adicione seu primeiro cliente"
        action={{ label: 'Adicionar', onClick }}
      />
    )

    expect(screen.getByText('Adicionar')).toBeInTheDocument()
  })

  it('does not render action button when not provided', () => {
    render(
      <EmptyState
        title="Nenhum cliente"
        description="Lista vazia"
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})