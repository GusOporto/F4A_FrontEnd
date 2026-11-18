import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OffersPage from '../../pages/OffersPage';
import { productoService } from '../../data/dbService';

describe('Ofertas: acceso al detalle de producto', () => {
  beforeEach(() => localStorage.removeItem('f4a_database'));
  afterEach(() => {
    cleanup();
    localStorage.removeItem('f4a_database');
  });

  it('enlaza el título de cada oferta con su producto', () => {
    const oferta = productoService.create({
      nombre: 'Celeste',
      categoriaId: 1,
      precio: 4500,
      stock: 6,
      imagen: '',
      descripcion: 'Un juego de plataformas.',
      esOferta: true,
    });

    render(
      <MemoryRouter>
        <OffersPage isLoggedIn={false} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Celeste' }).getAttribute('href'))
      .toBe(`/producto/${oferta.id}`);
  });
});
