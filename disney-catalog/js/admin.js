/**
 * DISNEY100 x ROMERO BRITTO - ADMIN PANEL
 * CRUD de productos y gestión del JSON
 */

// ============================================
// ESTADO GLOBAL
// ============================================

let products = [];
let editingProductId = null;

// ============================================
// CARGAR PRODUCTOS
// ============================================

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar products.json');
        }

        products = await response.json();
        renderProductsList();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('⚠️ No se pudo cargar products.json. Asegúrate de que el archivo existe.');
    }
}

// ============================================
// RENDERIZAR LISTA DE PRODUCTOS
// ============================================

function renderProductsList() {
    const container = document.getElementById('admin-products-container');

    if (products.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <p>No hay productos registrados aún</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    products.forEach(product => {
        const item = createProductItem(product);
        container.appendChild(item);
    });
}

// ============================================
// CREAR ITEM DE PRODUCTO
// ============================================

function createProductItem(product) {
    const item = document.createElement('div');
    item.className = 'product-item';

    item.innerHTML = `
        <div class="product-item-info">
            <h3>${product.name}</h3>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Descripción:</strong> ${product.description.substring(0, 80)}...</p>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
            <span class="product-item-price">€${parseFloat(product.price).toFixed(2)}</span>
            <div class="product-item-actions">
                <button class="btn btn-secondary btn-small" onclick="editProduct('${product.id}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteProduct('${product.id}')">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `;

    return item;
}

// ============================================
// AGREGAR / ACTUALIZAR PRODUCTO
// ============================================

function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value || generateId();
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value.trim();
    const image = document.getElementById('product-image').value.trim() || 'assets/placeholder.png';

    // Validaciones
    if (!name || !price || !category || !description) {
        alert('⚠️ Por favor completa todos los campos obligatorios');
        return;
    }

    if (price <= 0) {
        alert('⚠️ El precio debe ser mayor a 0');
        return;
    }

    // Crear objeto producto
    const product = {
        id,
        name,
        price,
        category,
        description,
        image
    };

    // Si estamos editando, actualizar; si no, agregar
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = product;
            alert('✅ Producto actualizado correctamente');
        }
        editingProductId = null;
    } else {
        products.push(product);
        alert('✅ Producto agregado correctamente');
    }

    // Resetear formulario y re-renderizar
    resetForm();
    renderProductsList();
}

// ============================================
// EDITAR PRODUCTO
// ============================================

function editProduct(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert('⚠️ Producto no encontrado');
        return;
    }

    // Rellenar formulario
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;

    editingProductId = productId;

    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================

function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        alert('⚠️ Producto no encontrado');
        return;
    }

    const confirmed = confirm(`¿Seguro que deseas eliminar "${product.name}"?`);

    if (confirmed) {
        products = products.filter(p => p.id !== productId);
        alert('✅ Producto eliminado correctamente');
        renderProductsList();
    }
}

// ============================================
// RESETEAR FORMULARIO
// ============================================

function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-image').value = 'assets/placeholder.png';
    editingProductId = null;
}

// ============================================
// GENERAR ID ÚNICO
// ============================================

function generateId() {
    // Generar ID basado en timestamp + random
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

// ============================================
// DESCARGAR JSON
// ============================================

function downloadJSON() {
    // Convertir array de productos a JSON con formato bonito
    const jsonString = JSON.stringify(products, null, 2);

    // Crear blob
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Crear URL temporal
    const url = URL.createObjectURL(blob);

    // Crear elemento <a> temporal para descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Archivo products.json descargado. Reemplázalo en tu proyecto y sube a Railway.');
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos al iniciar
    loadProducts();

    // Submit del formulario
    const form = document.getElementById('product-form');
    form.addEventListener('submit', handleSubmit);

    // Botón reset
    const resetButton = document.getElementById('reset-form');
    resetButton.addEventListener('click', resetForm);

    // Botón descargar JSON
    const downloadButton = document.getElementById('download-json');
    downloadButton.addEventListener('click', downloadJSON);
});
