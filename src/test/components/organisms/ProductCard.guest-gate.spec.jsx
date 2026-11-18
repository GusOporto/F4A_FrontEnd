import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../../../components/organisms/ProductCard';

describe('ProductCard organism: acceso de invitados', () => {
  it('oculta la compra, ofrece registro y no llama al callback sin sesión', () => {
    const producto = {
      id: 101,
      nombre: 'Minecraft',
      imagen: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      categoria: 'Videojuegos',
      precio: 13450,
      stock: 4,
    };

    const onAddToCart = jasmine.createSpy('onAddToCart');
    render(
      <MemoryRouter>
        <ProductCard producto={producto} isLoggedIn={false} onAddToCart={onAddToCart} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button', { name: 'Agregar al carrito' })).toBeNull();
    expect(screen.getByText('Inicia sesión para comprar')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Crear cuenta' }).getAttribute('href')).toBe('/registro');
    expect(onAddToCart).not.toHaveBeenCalled();
  });
});
