import { Link, useParams } from 'react-router-dom';
import Text from '../components/atoms/Text';
import ProductCard from '../components/organisms/ProductCard';
import { categoriaService, productoService } from '../data/dbService';
import { cartService } from '../services/cartService';

function CategoryDetailPage({ isLoggedIn }) {
  const { id } = useParams();
  const categoryId = Number(id);
  const category = categoriaService.getAll().find((item) => item.id === categoryId);
  const products = productoService.getAllWithCategory()
    .filter((product) => product.categoriaId === categoryId);

  const handleAgregarAlCarrito = (producto) => {
    cartService.addItem(producto);
    alert(`¡Producto "${producto.nombre}" añadido al carrito con éxito!`);
  };

  if (!category) {
    return (
      <section className="route-page">
        <Text variant="h1" className="page-title">Categoría no encontrada</Text>
        <Link className="page-action" to="/categorias">Volver a categorías</Link>
      </section>
    );
  }

  return (
    <section className="route-page container my-4">
      <div className="mb-4">
        <Text variant="p" className="page-eyebrow">CATÁLOGO F4A</Text>
        <Text variant="h1" className="page-title display-5 fw-bold">{category.nombre}</Text>
        {category.descripcion && (
          <Text className="page-description text-secondary">{category.descripcion}</Text>
        )}
      </div>

      {products.length === 0 ? (
        <p className="route-empty-state">Todavía no hay productos en esta categoría.</p>
      ) : (
        <div className="row g-4">
          {products.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <ProductCard
                producto={product}
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

export default CategoryDetailPage;
