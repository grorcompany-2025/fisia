/**
 * DISNEY100 x ROMERO BRITTO - CATÁLOGO APP
 * Gestión del catálogo de productos
 */

// ============================================
// ESTADO GLOBAL
// ============================================

let allProducts = [];
let filteredProducts = [];

// ============================================
// CARGAR PRODUCTOS
// ============================================

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar products.json');
        }

        allProducts = await response.json();
        filteredProducts = [...allProducts];

        populateCategories();
        renderProducts();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showError('No se pudieron cargar los productos. Verifica que products.json existe.');
    }
}

// ============================================
// POBLAR CATEGORÍAS EN EL SELECT
// ============================================

function populateCategories() {
    const categoryFilter = document.getElementById('category-filter');

    // Obtener categorías únicas
    const categories = [...new Set(allProducts.map(p => p.category))];

    // Limpiar opciones existentes (excepto "Todas")
    categoryFilter.innerHTML = '<option value="">Todas las Categorías</option>';

    // Agregar cada categoría
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// ============================================
// RENDERIZAR PRODUCTOS
// ============================================

function renderProducts() {
    const container = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');

    // Limpiar contenedor
    container.innerHTML = '';

    // Si no hay productos, mostrar mensaje
    if (filteredProducts.length === 0) {
        container.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    // Ocultar mensaje de "no resultados"
    container.classList.remove('hidden');
    noResults.classList.add('hidden');

    // Renderizar cada producto
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// ============================================
// CREAR TARJETA DE PRODUCTO
// ============================================

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <img
            src="${product.image || 'assets/placeholder.png'}"
            alt="${product.name}"
            class="product-image"
            onerror="this.src='assets/placeholder.png'"
        >
        <div class="product-info">
            <span class="category-badge">${product.category}</span>
            <h2 class="product-name">${product.name}</h2>
            <p class="product-description">${product.description}</p>
            <p class="product-price">€${parseFloat(product.price).toFixed(2)}</p>
        </div>
    `;

    return card;
}

// ============================================
// FILTRAR PRODUCTOS
// ============================================

function filterProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase().trim();
    const selectedCategory = document.getElementById('category-filter').value;

    filteredProducts = allProducts.filter(product => {
        // Filtro de búsqueda
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);

        // Filtro de categoría
        const matchesCategory =
            selectedCategory === '' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderProducts();
}

// ============================================
// MOSTRAR ERROR
// ============================================

function showError(message) {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            background: white;
            border: 4px solid var(--britto-pink);
            border-radius: 20px;
        ">
            <p style="font-size: 1.5rem; color: var(--disney-purple); font-weight: 700;">
                ⚠️ ${message}
            </p>
        </div>
    `;
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar productos al iniciar
    loadProducts();

    // Escuchar cambios en búsqueda
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', filterProducts);

    // Escuchar cambios en filtro de categoría
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.addEventListener('change', filterProducts);
});
