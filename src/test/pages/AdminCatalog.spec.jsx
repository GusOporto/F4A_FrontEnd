import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../../pages/AdminPage';
import { categoriaService, productoService } from '../../data/dbService';

const renderAdmin = () => render(<MemoryRouter><AdminPage currentUser={{ id: 2, nombre: 'Admin', rol: 'admin' }} /></MemoryRouter>);
const categoryRegion = () => screen.getByRole('region', { name: 'Gestión de categorías' });
const productRegion = () => screen.getByRole('region', { name: 'Gestión de productos' });

describe('AdminPage: gestión de catálogo persistente', () => {
  beforeEach(() => localStorage.removeItem('f4a_database'));
  afterEach(() => {
    cleanup();
    localStorage.removeItem('f4a_database');
  });

  it('crea una categoría y la muestra en la tabla', () => {
    renderAdmin();
    const region = categoryRegion();
    fireEvent.change(within(region).getByLabelText('Nombre'), { target: { value: 'Juegos indie' } });
    fireEvent.change(within(region).getByLabelText('Descripción'), { target: { value: 'Producciones independientes' } });
    fireEvent.click(within(region).getByRole('button', { name: 'Crear categoría' }));

    expect(within(region).getByText('Juegos indie')).toBeTruthy();
    expect(categoriaService.getAll().some((category) => category.nombre === 'Juegos indie')).toBeTrue();
  });

  it('crea un juego con sus datos numéricos convertidos y lo persiste', () => {
    renderAdmin();
    const region = productRegion();
    fireEvent.change(within(region).getByLabelText('Nombre'), { target: { value: 'Hollow Knight' } });
    fireEvent.change(within(region).getByLabelText('Precio (CLP)'), { target: { value: '8990' } });
    fireEvent.change(within(region).getByLabelText('Stock'), { target: { value: '12' } });
    fireEvent.click(within(region).getByRole('button', { name: 'Crear producto' }));

    const created = productoService.getAll().find((product) => product.nombre === 'Hollow Knight');
    expect(created.categoriaId).toBe(1);
    expect(created.precio).toBe(8990);
    expect(created.stock).toBe(12);
    expect(within(region).getByText('Hollow Knight')).toBeTruthy();
  });

  it('permite asignar un juego a una categoría creada durante la sesión', () => {
    renderAdmin();
    const categories = categoryRegion();
    fireEvent.change(within(categories).getByLabelText('Nombre'), { target: { value: 'Aventura' } });
    fireEvent.click(within(categories).getByRole('button', { name: 'Crear categoría' }));
    const createdCategory = categoriaService.getAll().find((category) => category.nombre === 'Aventura');

    const products = productRegion();
    fireEvent.change(within(products).getByLabelText('Nombre'), { target: { value: 'Celeste' } });
    fireEvent.change(within(products).getByLabelText('Categoría'), { target: { value: String(createdCategory.id) } });
    fireEvent.change(within(products).getByLabelText('Precio (CLP)'), { target: { value: '4500' } });
    fireEvent.change(within(products).getByLabelText('Stock'), { target: { value: '4' } });
    fireEvent.click(within(products).getByRole('button', { name: 'Crear producto' }));

    expect(productoService.getAll().find((product) => product.nombre === 'Celeste').categoriaId).toBe(createdCategory.id);
    expect(within(products).getAllByText('Aventura').length).toBeGreaterThan(0);
  });

  it('mantiene el juego y la categoría después de volver a montar el panel', () => {
    const firstRender = renderAdmin();
    const categories = categoryRegion();
    fireEvent.change(within(categories).getByLabelText('Nombre'), { target: { value: 'Arcade' } });
    fireEvent.click(within(categories).getByRole('button', { name: 'Crear categoría' }));
    const arcade = categoriaService.getAll().find((category) => category.nombre === 'Arcade');
    const products = productRegion();
    fireEvent.change(within(products).getByLabelText('Nombre'), { target: { value: 'Pac-Man' } });
    fireEvent.change(within(products).getByLabelText('Categoría'), { target: { value: String(arcade.id) } });
    fireEvent.change(within(products).getByLabelText('Precio (CLP)'), { target: { value: '3000' } });
    fireEvent.change(within(products).getByLabelText('Stock'), { target: { value: '6' } });
    fireEvent.click(within(products).getByRole('button', { name: 'Crear producto' }));

    firstRender.unmount();
    renderAdmin();

    expect(within(categoryRegion()).getByText('Arcade')).toBeTruthy();
    expect(within(productRegion()).getByText('Pac-Man')).toBeTruthy();
    expect(productoService.getAllWithCategory().find((product) => product.nombre === 'Pac-Man').categoria).toBe('Arcade');
  });

  it('evita borrar una categoría que todavía tiene juegos', () => {
    renderAdmin();
    const region = categoryRegion();
    fireEvent.click(within(region).getAllByRole('button', { name: 'Eliminar' })[0]);

    expect(screen.getByRole('alert').textContent).toContain('todavía tiene productos');
    expect(categoriaService.getAll().some((category) => category.id === 1)).toBeTrue();
  });

  it('limpia el formulario de categoría después de crearla', () => {
    renderAdmin();
    const region = categoryRegion();
    const name = within(region).getByLabelText('Nombre');
    fireEvent.change(name, { target: { value: 'RPG' } });
    fireEvent.click(within(region).getByRole('button', { name: 'Crear categoría' }));

    expect(name.value).toBe('');
    expect(within(region).getByRole('heading', { name: 'Nueva categoría' })).toBeTruthy();
  });
});
