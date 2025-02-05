const apiURL = "https://api.noroff.dev/api/v1/rainy-days";

function assignCategoryByIndex(products) {
    const totalProducts = products.length;
    const menProducts = Math.floor(totalProducts / 3);
    const womenProducts = Math.floor(totalProducts / 3);

    return products.map((product, index) => {
        if (index < menProducts) {
            return { ...product, category: "Men" };
        } else if (index < menProducts + womenProducts) {
            return { ...product, category: "Women" };
        } else {
            return { ...product, category: "Unisex" };
        }
    });
}

function filterProducts(products, category, sortByPrice) {
    let filteredProducts = [...products];

    if (category) {
        filteredProducts = filteredProducts.filter((product) => product.category === category);
    }

    if (sortByPrice === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortByPrice === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    return filteredProducts;
}

async function fetchProducts() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP-feil: ${response.status} ${response.statusText}`);
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Feil ved henting av produkter:", error.message);
        alert("Could not load products. Please try again later.");
    }
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = `<p>No products found.</p>`;
        return;
    }

    products.forEach((product) => {
        productList.innerHTML += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title || product.name}" />
            <h3>${product.title || product.name}</h3>
            <p>${product.price} NOK</p>
            <a href="product.html?id=${product.id}">View Product</a>
        </div>
        `;
    });
}

async function initProductList() {
    const rawProducts = await fetchProducts();
    const products = assignCategoryByIndex(rawProducts);

    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");

    priceFilter.value = "asc";

    const initialFilteredProducts = filterProducts(products, categoryFilter.value, priceFilter.value);
    displayProducts(initialFilteredProducts);

    categoryFilter.addEventListener("change", () => {
        const category = categoryFilter.value;
        const sortByPrice = priceFilter.value;
        const filteredProducts = filterProducts(products, category, sortByPrice);
        displayProducts(filteredProducts);
    });

    priceFilter.addEventListener("change", () => {
        const category = categoryFilter.value;
        const sortByPrice = priceFilter.value;
        const filteredProducts = filterProducts(products, category, sortByPrice);
        displayProducts(filteredProducts);
    });
}

initProductList();



