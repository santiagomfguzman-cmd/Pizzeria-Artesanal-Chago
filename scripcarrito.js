// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const modal = document.getElementById("modal-carrito");
const btnAbrir = document.querySelector(".cart-link");
const btnCerrar = document.querySelector(".close-btn");
const listaCarrito = document.getElementById("lista-carrito");
const precioTotal = document.getElementById("precio-total");
const btnComprar = document.getElementById("btn-comprar");

// Abrir modal
btnAbrir.onclick = function(e) {
    e.preventDefault();
    actualizarCarrito();
    modal.style.display = "block";
}

// Cerrar modal al dar clic en la (X)
btnCerrar.onclick = function() {
    modal.style.display = "none";
}

// Cerrar si hacen clic fuera de la ventana blanca
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Función para agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre && item.precio === precio);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito();
    actualizarContador();
}

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar contador del carrito
function actualizarContador() {
    const contador = document.querySelector('.cart-count');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

// Actualizar vista del carrito
function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p>El carrito está vacío 🍕</p>';
    } else {
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            listaCarrito.innerHTML += `
                <div class="item-carrito">
                    <span>${item.nombre} (x${item.cantidad})</span>
                    <span>$${subtotal}</span>
                    <button onclick="removerDelCarrito(${index})">❌</button>
                </div>
            `;
        });
    }

    precioTotal.textContent = total;
}

// Remover producto del carrito
function removerDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
    actualizarContador();
}

// Confirmar pedido
btnComprar.onclick = function() {
    if (carrito.length === 0) {
        alert('El carrito está vacío. Agrega productos primero.');
        return;
    }
    alert('¡Pedido confirmado! Gracias por elegir Chago Pizzería. Te contactaremos pronto.');
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    actualizarContador();
    modal.style.display = "none";
}

// Escuchar clics en botones de ordenar
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-ordenar-ahora')) {
            e.preventDefault();
            const card = e.target.closest('.pizza-item-card') || e.target.closest('.promo-card');
            if (card) {
                const nombre = card.querySelector('h3').textContent;
                let precio = 0;

                if (card.classList.contains('promo-card')) {
                    // Para promociones, extraer precio del price-tag
                    const priceTag = card.querySelector('.price-tag');
                    if (priceTag) {
                        const precioTexto = priceTag.textContent;
                        precio = parseFloat(precioTexto.replace(/[^\d.]/g, ''));
                    }
                } else {
                    // Para productos normales, usar el select
                    const select = card.querySelector('select');
                    if (select) {
                        const precioTexto = select.value.split('$')[1]; // Extraer precio después de $
                        precio = parseFloat(precioTexto);
                    }
                }

                if (precio > 0) {
                    agregarAlCarrito(nombre, precio);
                    alert(`${nombre} agregado al carrito por $${precio}`);
                } else {
                    alert('Precio no disponible para este producto.');
                }
            }
        }
    });

    // Inicializar contador al cargar
    actualizarContador();
});