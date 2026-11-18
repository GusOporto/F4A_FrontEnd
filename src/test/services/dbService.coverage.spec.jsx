import {
  blogService,
  categoriaService,
  productoService,
  ticketService,
  usuarioService,
  ventaService,
} from '../../data/dbService';

describe('dbService: persistencia y consultas complementarias', () => {
  beforeEach(() => localStorage.removeItem('f4a_database'));

  describe('categorías', () => {
    it('inicializa las categorías del catálogo', () => {
      expect(categoriaService.getAll().some((category) => category.nombre === 'Juegos')).toBeTrue();
    });

    it('guarda la categoría nueva en localStorage', () => {
      const category = categoriaService.create({ nombre: 'Arcade', descripcion: 'Clásicos' });
      const saved = JSON.parse(localStorage.getItem('f4a_database'));
      expect(saved.categorias.some((item) => item.id === category.id && item.nombre === 'Arcade')).toBeTrue();
    });

    it('genera un ID superior al de las categorías existentes', () => {
      const previousMax = Math.max(...categoriaService.getAll().map((category) => category.id));
      expect(categoriaService.create({ nombre: 'RPG' }).id).toBe(previousMax + 1);
    });

    it('actualiza los datos de una categoría', () => {
      categoriaService.update(1, { nombre: 'Videojuegos', descripcion: 'Juegos digitales' });
      expect(categoriaService.getAll().find((category) => category.id === 1).nombre).toBe('Videojuegos');
    });

    it('elimina una categoría existente', () => {
      const created = categoriaService.create({ nombre: 'Temporal' });
      categoriaService.delete(created.id);
      expect(categoriaService.getAll().some((category) => category.id === created.id)).toBeFalse();
    });

    it('refleja el nombre actualizado al consultar productos con categoría', () => {
      categoriaService.update(1, { nombre: 'Consola y PC' });
      expect(productoService.getAllWithCategory().find((product) => product.categoriaId === 1).categoria).toBe('Consola y PC');
    });

    it('usa Sin categoría si el producto apunta a una categoría eliminada', () => {
      categoriaService.delete(1);
      expect(productoService.getAllWithCategory().find((product) => product.id === 101).categoria).toBe('Sin categoría');
    });

    it('mantiene el resto de los productos al borrar una categoría', () => {
      const before = productoService.getAll().length;
      categoriaService.delete(4);
      expect(productoService.getAll()).toHaveSize(before);
    });
  });

  describe('productos', () => {
    it('devuelve el inventario inicial', () => {
      expect(productoService.getAll().some((product) => product.nombre === 'Minecraft')).toBeTrue();
    });

    it('busca por ID numérico', () => {
      expect(productoService.getById(101).nombre).toBe('Minecraft');
    });

    it('busca por ID numérico recibido como texto', () => {
      expect(productoService.getById('101').nombre).toBe('Minecraft');
    });

    it('devuelve undefined cuando el producto no existe', () => {
      expect(productoService.getById(-1)).toBeUndefined();
    });

    it('incluye el nombre de categoría en el producto relacionado', () => {
      expect(productoService.getAllWithCategory().find((product) => product.id === 101).categoria).toBe('Juegos');
    });

    it('devuelve los productos cuyo stock está en nivel crítico', () => {
      expect(productoService.getCriticos().every((product) => product.stock <= 5)).toBeTrue();
    });

    it('permite cambiar el límite de stock crítico', () => {
      expect(productoService.getCriticos(0)).toHaveSize(0);
      expect(productoService.getCriticos(13).some((product) => product.id === 101)).toBeTrue();
    });

    it('devuelve solo los productos marcados como oferta', () => {
      expect(productoService.getOfertas().every((product) => product.esOferta)).toBeTrue();
    });

    it('persiste un producto recién creado', () => {
      const created = productoService.create({ nombre: 'Juego de prueba', categoriaId: 1, precio: 1234, stock: 2 });
      expect(productoService.getById(created.id).nombre).toBe('Juego de prueba');
    });

    it('actualiza solo los campos indicados', () => {
      productoService.update(101, { stock: 7 });
      const updated = productoService.getById(101);
      expect(updated.stock).toBe(7);
      expect(updated.nombre).toBe('Minecraft');
    });

    it('elimina un producto por ID', () => {
      productoService.delete(101);
      expect(productoService.getById(101)).toBeUndefined();
    });

    it('persiste las actualizaciones en localStorage', () => {
      productoService.update(101, { stock: 4 });
      const database = JSON.parse(localStorage.getItem('f4a_database'));
      expect(database.productos.find((product) => product.id === 101).stock).toBe(4);
    });
  });

  describe('usuarios', () => {
    it('devuelve las cuentas iniciales', () => {
      expect(usuarioService.getAll().some((user) => user.rol === 'admin')).toBeTrue();
    });

    it('autentica con correo y contraseña correctos', () => {
      expect(usuarioService.login('admin@f4a.cl', 'admin').rol).toBe('admin');
    });

    it('rechaza una contraseña incorrecta', () => {
      expect(usuarioService.login('admin@f4a.cl', 'incorrecta')).toBeNull();
    });

    it('rechaza un correo inexistente', () => {
      expect(usuarioService.login('nadie@example.com', 'admin')).toBeNull();
    });

    it('crea cuentas de cliente por defecto', () => {
      const user = usuarioService.create({ nombre: 'Cliente nuevo', correo: 'nuevo@example.com' });
      expect(user.rol).toBe('cliente');
      expect(usuarioService.getAll().some((saved) => saved.id === user.id)).toBeTrue();
    });

    it('conserva el rol admin al crear una cuenta administradora', () => {
      expect(usuarioService.create({ nombre: 'Admin 2', rol: 'admin' }).rol).toBe('admin');
    });

    it('actualiza los campos de una cuenta', () => {
      usuarioService.update(1, { nombre: 'Pedro actualizado' });
      expect(usuarioService.getAll().find((user) => user.id === 1).nombre).toBe('Pedro actualizado');
    });

    it('elimina una cuenta del listado', () => {
      usuarioService.delete(1);
      expect(usuarioService.getAll().some((user) => user.id === 1)).toBeFalse();
    });
  });

  describe('ventas', () => {
    it('devuelve el historial de ventas inicial', () => {
      expect(ventaService.getAll().length).toBeGreaterThan(0);
    });

    it('filtra ventas por ID de usuario numérico', () => {
      expect(ventaService.getByUsuarioId(1).every((sale) => sale.usuarioId === 1)).toBeTrue();
    });

    it('acepta el ID de usuario como texto', () => {
      expect(ventaService.getByUsuarioId('1').length).toBe(ventaService.getByUsuarioId(1).length);
    });

    it('crea y persiste una orden', () => {
      const order = ventaService.crearOrden({ usuarioId: 1, items: [], total: 0, estado: 'Pendiente' });
      expect(ventaService.getAll().some((sale) => sale.id === order.id)).toBeTrue();
    });

    it('asigna a la orden una fecha con formato ISO de día', () => {
      const order = ventaService.crearOrden({ usuarioId: 1, items: [], total: 0 });
      expect(order.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('descuenta el stock de cada producto comprado', () => {
      ventaService.crearOrden({ items: [{ productoId: 101, cantidad: 3 }] });
      expect(productoService.getById(101).stock).toBe(10);
    });

    it('no permite que el stock quede por debajo de cero', () => {
      ventaService.crearOrden({ items: [{ productoId: 101, cantidad: 100 }] });
      expect(productoService.getById(101).stock).toBe(0);
    });

    it('no altera inventario por IDs de producto inexistentes', () => {
      const stock = productoService.getById(101).stock;
      ventaService.crearOrden({ items: [{ productoId: 999999, cantidad: 5 }] });
      expect(productoService.getById(101).stock).toBe(stock);
    });
  });

  describe('tickets', () => {
    it('comienza sin tickets si no hay datos previos', () => {
      expect(ticketService.getAll()).toEqual([]);
    });

    it('crea un ticket pendiente con identificador', () => {
      const ticket = ticketService.create({ nombre: 'Ana', correo: 'ana@example.com', mensaje: 'Ayuda' });
      expect(ticket.id).toContain('TICKET-');
      expect(ticket.estado).toBe('Pendiente');
    });

    it('coloca los tickets nuevos al inicio de la lista', () => {
      ticketService.create({ nombre: 'Primero' });
      ticketService.create({ nombre: 'Segundo' });
      expect(ticketService.getAll()[0].nombre).toBe('Segundo');
    });

    it('actualiza el estado del ticket indicado', () => {
      const ticket = ticketService.create({ nombre: 'Ana' });
      ticketService.updateStatus(ticket.id, 'Resuelto');
      expect(ticketService.getAll()[0].estado).toBe('Resuelto');
    });

    it('no modifica tickets cuando el ID no existe', () => {
      const ticket = ticketService.create({ nombre: 'Ana' });
      ticketService.updateStatus('TICKET-inexistente', 'Resuelto');
      expect(ticketService.getAll()[0].estado).toBe(ticket.estado);
    });
  });

  describe('blogs', () => {
    it('devuelve las publicaciones iniciales', () => {
      expect(blogService.getAll().length).toBeGreaterThan(0);
    });

    it('busca una publicación usando su ID de texto', () => {
      expect(blogService.getById('1').titulo).toContain('Steam');
    });

    it('también busca una publicación usando su ID numérico', () => {
      expect(blogService.getById(1).id).toBe('1');
    });

    it('devuelve undefined para una publicación inexistente', () => {
      expect(blogService.getById('no-existe')).toBeUndefined();
    });
  });
});
