// Checkout hacia WhatsApp — Bloom & Gold

const WHATSAPP_NUMERO = '51967959557'; // Número de la tienda

function enviarPedidoAWhatsApp() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de realizar tu pedido.");
        return;
    }

    let mensaje = "*¡Hola Bloom & Gold! Quisiera realizar el siguiente pedido:*\n\n";
    mensaje += "*Detalles del Pedido:*\n";

    let total = 0;

    carrito.forEach((item, index) => {
        const precioItem = parseFloat(item.precio) || 0;
        const subtotalItem = precioItem * item.cantidad;
        total += subtotalItem;

        mensaje += `*${index + 1}. ${item.nombre}*\n`;
        mensaje += `   Cantidad: ${item.cantidad}\n`;
        mensaje += `   Precio unitario: S/. ${precioItem.toFixed(2)}\n`;
        
        // Agregar personalización si existe
        if (item.personalizacion) {
            let detallesPers = [];
            if (item.personalizacion.nombre) {
                detallesPers.push(`Nombre: "${item.personalizacion.nombre}"`);
            }
            if (item.personalizacion.detalle) {
                detallesPers.push(`Detalles: "${item.personalizacion.detalle}"`);
            }
            if (item.personalizacion.talla) {
                detallesPers.push(`Talla: ${item.personalizacion.talla}`);
            }
            if (item.personalizacion.color) {
                detallesPers.push(`Color: ${item.personalizacion.color}`);
            }
            
            if (detallesPers.length > 0) {
                mensaje += `   Personalización: ${detallesPers.join(', ')}\n`;
            }
        }
        
        mensaje += `   Subtotal: S/. ${subtotalItem.toFixed(2)}\n\n`;
    });

    mensaje += `*Total a pagar: S/. ${total.toFixed(2)}*\n\n`;
    mensaje += "_Por favor, indícame los pasos para realizar el pago y coordinar el envío._";

    // Codificar mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensajeCodificado}`;

    // Abrir en una nueva pestaña
    window.open(url, '_blank');
}
