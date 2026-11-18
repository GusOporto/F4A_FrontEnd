import { Link, useParams } from 'react-router-dom';
import Text from '../components/atoms/Text';
import { categoriaService, productoService } from '../data/dbService';

function CategoryDetailPage() {
  const { id } = useParams();
  const categoryId = Number(id);
  const category = categoriaService.getAll().find((item) => item.id === categoryId);
  const products = productoService.getAllWithCategory()
    .filter((product) => product.categoriaId === categoryId);

  if (!category) {
    return (
      <section className="route-page">
        <Text variant="h1" className="page-title">Categoría no encontrada</Text>
        <Link className="page-action" to="/categorias">Volver a categorías</Link>
      </section>
    );
  }

  return (
    <section className="route-page">
      <Text variant="p" className="page-eyebrow">CATÁLOGO F4A</Text>
      <Text variant="h1" className="page-title">{category.nombre}</Text>
      {category.descripcion && <Text className="page-description">{category.descripcion}</Text>}

      {products.length === 0 ? (
        <p className="route-empty-state">Todavía no hay productos en esta categoría.</p>
      ) : (
        <div className="row g-4 mt-2">
          {products.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
              <Link className="card h-100 text-decoration-none" to={`/producto/${product.id}`}>
                {product.imagen && <img className="card-img-top" src={product.imagen} alt={product.nombre} />}
                <div className="card-body">
                  <h2 className="card-title h5">{product.nombre}</h2>
                  <p className="card-text">{product.descripcion}</p>
                  <strong>${Number(product.precio).toLocaleString('es-CL')}</strong>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryDetailPage;
