import { Link } from 'react-router-dom';
import Image from '../atoms/Image';
import Text from '../atoms/Text';
import Boton from '../atoms/Boton';
import '../../styles/organisms/ProductCard.css';

function ProductCards({ producto, isLoggedIn = false, onAddToCart, detailTo }) {
    const { id, nombre, imagen, categoria, precio, stock, esOferta } = producto;
    const detalle = detailTo ?? (id !== undefined ? `/producto/${id}` : null);
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
                {detalle ? (
                    <Link className="product-card-title-link" to={detalle}>{nombre}</Link>
                ) : (
                    nombre
                )}
            </Text>

            <Text className="categoria-producto">
                {categoria}
            </Text>

            <div className="product-card-price-row">
                <Text className="precio-producto">
                    {formatoPrecio}
                </Text>
                {esOferta && <span className="badge bg-danger">OFERTA</span>}
            </div>

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
