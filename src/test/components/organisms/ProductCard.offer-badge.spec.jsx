import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../../../components/organisms/ProductCard';

describe('ProductCard organism: indicador de oferta', () => {
  afterEach(cleanup);

  const producto = (esOferta) => ({
    id: 101,
    nombre: 'Minecraft',
    imagen: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
    categoria: 'Videojuegos',
    precio: 13450,
    stock: 4,
    esOferta,
  });

  it('muestra el badge de oferta cuando el producto está en oferta', () => {
    render(
      <MemoryRouter>
        <ProductCard producto={producto(true)} isLoggedIn={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('OFERTA')).toBeTruthy();
    expect(screen.getByText('$13.450')).toBeTruthy();
  });

  it('no muestra el badge cuando el producto no está en oferta', () => {
    render(
      <MemoryRouter>
        <ProductCard producto={producto(false)} isLoggedIn={false} />
      </MemoryRouter>
    );

    expect(screen.queryByText('OFERTA')).toBeNull();
  });
});
