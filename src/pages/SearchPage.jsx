import { useSearchParams } from 'react-router-dom';
import Text from '../components/atoms/Text';
import ProductCard from '../components/organisms/ProductCard';
import { productoService } from '../data/dbService';
import { cartService } from '../services/cartService';

function SearchPage({ isLoggedIn }) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const normalized = query.toLocaleLowerCase('es-CL');

  const resultados = query
    ? productoService.getAllWithCategory().filter((producto) =>
        [producto.nombre, producto.categoria, producto.descripcion]
          .some((valor) => String(valor ?? '').toLocaleLowerCase('es-CL').includes(normalized))
      )
    : [];

  const handleAgregarAlCarrito = (producto) => {
    cartService.addItem(producto);
    alert(`¡Producto "${producto.nombre}" añadido al carrito con éxito!`);
  };

  return (
    <section className="route-page container my-4">
      <div className="mb-4">
        <Text variant="p" className="page-eyebrow">
          CATÁLOGO F4A
        </Text>
        <Text variant="h1" className="page-title display-5 fw-bold">
          {query ? `Resultados para «${query}»` : 'Buscar productos'}
        </Text>
        <Text className="page-description text-secondary">
          {query
            ? `${resultados.length} ${resultados.length === 1 ? 'producto encontrado' : 'productos encontrados'}.`
            : 'Escribe un término en el buscador superior para encontrar juegos, software y claves digitales.'}
        </Text>
      </div>

      {!query || resultados.length === 0 ? (
        <div className="alert alert-info text-center" role="status">
          {query
            ? 'No encontramos productos que coincidan con tu búsqueda. Prueba con otro término.'
            : 'Aún no has realizado una búsqueda.'}
        </div>
      ) : (
        <div className="row g-4">
          {resultados.map((producto) => (
            <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard
                producto={producto}
                isLoggedIn={isLoggedIn}
                onAddToCart={handleAgregarAlCarrito}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchPage;
