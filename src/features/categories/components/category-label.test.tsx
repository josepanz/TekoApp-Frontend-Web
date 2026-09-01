import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CategoryIcon, CategoryLabel } from './category-label';

describe('CategoryIcon', () => {
  it('aplica el color de la categoría al ícono conocido', () => {
    // Arrange & Act
    render(<CategoryIcon icon="hammer" color="#8E44AD" />);

    // Assert
    const icon = document.querySelector('svg');
    expect(icon).toHaveStyle({ color: '#8E44AD' });
  });

  it('usa un ícono genérico cuando el nombre no está en el catálogo', () => {
    // Arrange & Act
    render(<CategoryIcon icon="nombre-inexistente" />);

    // Assert
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});

describe('CategoryLabel', () => {
  it('muestra el ícono y el nombre de la categoría juntos', () => {
    // Arrange & Act
    render(<CategoryLabel name="Plomería" icon="droplet" color="#17BEBB" />);

    // Assert
    expect(screen.getByText('Plomería')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});
