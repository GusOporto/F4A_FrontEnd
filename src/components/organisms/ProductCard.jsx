import { Link } from 'react-router-dom';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Boton from '../atoms/Boton';
import '../../styles/organisms/ProductCard.css';

function ProductCards({ producto, isLoggedIn = false, onAddToCart }) {
    const { nombre, imagen, categoria, precio, stock } = producto;
    const formatoPrecio = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(precio);
    const agotado = Number(stock) === 0;

    return (
        <article className="tarjeta-producto">
            <Image
                src={imagen}
                alt={nombre}
                className="imagen-producto"
            />
            <Text variant="h3" className="titulo-producto">
                {nombre}
            </Text>

            <Text className="categoria-producto">
                {categoria}
            </Text>

            <Text className="precio-producto">
                {formatoPrecio}
            </Text>

            {isLoggedIn ? (
                <Boton
                    className="boton-carrito"
                    onClick={() => onAddToCart?.(producto)}
                    disabled={agotado}
                >
                    {agotado ? 'Agotado' : 'Agregar al carrito'}
                </Boton>
            ) : (
                <div className="product-card-gate" role="note">
                    <span>Inicia sesión para comprar</span>
                    <Link to="/registro" className="product-card-gate-link">
                        Crear cuenta
                    </Link>
                </div>
            )}
        </article>
    );
}

export default ProductCards;
