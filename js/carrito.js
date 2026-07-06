// Lógica del Carrito de Compras — Bloom & Gold

const CART_KEY = 'bloom_gold_cart';

// Obtener productos del carrito
function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        console.error("Error al leer el carrito desde localStorage:", e);
        return [];
    }
}

// Guardar carrito y actualizar contadores
function guardarCarrito(carrito) {
    localStorage.setItem(CART_KEY, JSON.stringify(carrito));
    actualizarContadoresHeader();
    // Disparar un evento para que otras partes de la página sepan que el carrito cambió
    window.dispatchEvent(new Event('cart-updated'));
}

// Obtener cantidad total de artículos
function obtenerTotalArticulos() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
    // producto debe ser un objeto:
    // { id, nombre, precio, imagen, cantidad, personalizacion: { nombre: '', detalle: '' } }
    let carrito = obtenerCarrito();
    
    // Generar una clave única combinando el ID y la personalización
    const persKey = producto.personalizacion ? JSON.stringify(producto.personalizacion) : '';
    
    const indexExistente = carrito.findIndex(item => {
        const itemPersKey = item.personalizacion ? JSON.stringify(item.personalizacion) : '';
        return item.id === producto.id && itemPersKey === persKey;
    });

    if (indexExistente !== -1) {
        carrito[indexExistente].cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }
    
    guardarCarrito(carrito);
    mostrarToast(`¡${producto.nombre} agregado al carrito!`);
}

// Actualizar cantidad de un artículo
function actualizarCantidad(id, personalizacionStr, cantidad) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(item => {
        const itemPersKey = item.personalizacion ? JSON.stringify(item.personalizacion) : '';
        return item.id === id && itemPersKey === personalizacionStr;
    });

    if (index !== -1) {
        if (cantidad <= 0) {
            carrito.splice(index, 1);
        } else {
            carrito[index].cantidad = cantidad;
        }
        guardarCarrito(carrito);
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(id, personalizacionStr) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(item => {
        const itemPersKey = item.personalizacion ? JSON.stringify(item.personalizacion) : '';
        return item.id === id && itemPersKey === personalizacionStr;
    });

    if (index !== -1) {
        const nombreProducto = carrito[index].nombre;
        carrito.splice(index, 1);
        guardarCarrito(carrito);
        mostrarToast(`Se eliminó ${nombreProducto} del carrito`);
    }
}

// Vaciar carrito
function vaciarCarrito() {
    guardarCarrito([]);
}

// Actualizar el contador del header
function actualizarContadoresHeader() {
    const total = obtenerTotalArticulos();
    const contadores = document.querySelectorAll('#cart-counter');
    contadores.forEach(contador => {
        contador.textContent = total;
        if (total > 0) {
            contador.classList.remove('hidden');
        } else {
            contador.classList.add('hidden');
        }
    });
}

// Mostrar notificación Toast
function mostrarToast(mensaje) {
    // Buscar si ya existe el contenedor de toasts
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-primary text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-auto max-w-sm';
    toast.innerHTML = `
        <span class="material-symbols-outlined text-md">check_circle</span>
        <span class="font-body-md text-sm font-semibold">${mensaje}</span>
    `;

    toastContainer.appendChild(toast);

    // Animación de entrada
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Eliminar después de 3.5 segundos
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-[-10px]');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// Inicialización cuando carga el documento
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadoresHeader();
    
    // Asegurar que el icono de carrito en el header sea un link a carrito.html
    const cartBtn = document.querySelector('header button span[data-original-icon="shopping_cart"]');
    if (cartBtn) {
        const parentBtn = cartBtn.closest('button');
        if (parentBtn) {
            const link = document.createElement('a');
            link.href = 'carrito.html';
            link.className = parentBtn.className;
            link.innerHTML = parentBtn.innerHTML;
            
            // Asignar ID al elemento contador si no lo tiene
            const counterSpan = link.querySelector('span.absolute');
            if (counterSpan) {
                counterSpan.id = 'cart-counter';
            }
            
            // Reemplazar el botón por el link
            parentBtn.parentNode.replaceChild(link, parentBtn);
        }
    }
    
    // Otra búsqueda por si tiene otra estructura en algunas páginas
    const cartCounterSpan = document.querySelector('header span.absolute');
    if (cartCounterSpan && !cartCounterSpan.id) {
        cartCounterSpan.id = 'cart-counter';
    }
    
    actualizarContadoresHeader();
});
