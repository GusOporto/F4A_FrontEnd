import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CategoriesPage from '../../pages/CategoriesPage';
import CategoryDetailPage from '../../pages/CategoryDetailPage';
import { categoriaService, productoService } from '../../data/dbService';

describe('Catálogo dinámico de categorías', () => {
  beforeEach(() => localStorage.removeItem('f4a_database'));
  afterEach(() => {
    cleanup();
    localStorage.removeItem('f4a_database');
  });

  it('muestra las categorías creadas por el administrador y enlaza a su detalle', () => {
    const category = categoriaService.create({ nombre: 'Aventura', descripcion: 'Juegos de exploración' });
    render(<MemoryRouter><CategoriesPage /></MemoryRouter>);

    expect(screen.getByText('Aventura')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Aventura.*Juegos de exploración/i })
      .getAttribute('href')).toBe(`/categorias/${category.id}`);
  });

  it('muestra los productos asignados a la categoría elegida', () => {
    const category = categoriaService.create({ nombre: 'Aventura' });
    productoService.create({
      nombre: 'Celeste',
      categoriaId: category.id,
      precio: 4500,
      stock: 6,
      imagen: '',
      descripcion: 'Un juego de plataformas.',
    });

    render(
      <MemoryRouter initialEntries={[`/categorias/${category.id}`]}>
        <Routes>
          <Route path="/categorias/:id" element={<CategoryDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Aventura' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Celeste' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Celeste.*4\.500/i }).getAttribute('href'))
      .toBe(`/producto/${productoService.getAll().find((product) => product.nombre === 'Celeste').id}`);
  });
});
