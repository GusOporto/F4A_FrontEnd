import Enlaces from '../components/atoms/Enlaces';
import Text from '../components/atoms/Text';
import FaqSection from '../components/organisms/FaqSection';
import { categoriaService } from '../data/dbService';

function HomePage() {
  const categories = categoriaService.getAll();

  return (
    <>
      <div className="home-content">
        <section className="home-hero">
          <Text variant="p" className="page-eyebrow">BIENVENIDO A F4A</Text>
          <Text variant="h1" className="home-title">Tu próximo mundo digital empieza aquí</Text>
          <Text className="home-description">
            Explora videojuegos, software y productos digitales desde un solo lugar.
          </Text>
        </section>

        <section className="home-categories" aria-label="Categorías de la tienda">
          <Text variant="h2" className="page-title">
            Explora nuestras categorías
          </Text>
          <div className="category-grid">
            {categories.map((category) => (
              <Enlaces className="category-card" href={`/categorias/${category.id}`} key={category.id}>
                <Text variant="h3" className="category-title">{category.nombre}</Text>
                <Text className="category-description">
                  {category.descripcion || 'Explora los productos de esta categoría.'}
                </Text>
                <span className="category-action" aria-hidden="true">Explorar →</span>
              </Enlaces>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="route-empty-state">Todavía no hay categorías disponibles.</p>
          )}
        </section>
      </div>
      <FaqSection />
    </>
  );
}

export default HomePage;
