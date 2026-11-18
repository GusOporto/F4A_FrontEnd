import Enlaces from '../components/atoms/Enlaces';
import Text from '../components/atoms/Text';
import { categoriaService } from '../data/dbService';

function CategoriesPage() {
  const categories = categoriaService.getAll();

  return (
    <section className="route-page">
      <Text variant="p" className="page-eyebrow">CATÁLOGO F4A</Text>
      <Text variant="h1" className="page-title">Categorías</Text>
      <div className="category-grid">
        {categories.map((category) => (
          <Enlaces className="category-card" href={`/categorias/${category.id}`} key={category.id}>
            <Text variant="h2" className="category-title">{category.nombre}</Text>
            {category.descripcion && <Text className="category-description">{category.descripcion}</Text>}
            <Text className="category-action">Ver categoría →</Text>
          </Enlaces>
        ))}
      </div>
      {categories.length === 0 && (
        <p className="route-empty-state">Todavía no hay categorías disponibles.</p>
      )}
    </section>
  );
}

export default CategoriesPage;
