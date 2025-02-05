const apiURL = "https://api.noroff.dev/api/v1/rainy-days";

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

async function displayProducts() {
    const productList = document.getElementById("product-list");

    productList.innerHTML = `<p id="loading">Loading products...</p>`;

    const products = await fetchProducts();
    const loadingMessage = document.getElementById("loading");
    if (loadingMessage) {
        loadingMessage.remove();
    }

    if (products) {
        products.forEach((product) => {
            const productLink = `product.html?id=${product.id}`;

            productList.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title || product.name}" />
                <h3>${product.title || product.name}</h3>
                <p>${product.price} NOK</p>
                <a href="${productLink}">View Product</a>
            </div>
            `;
        });
    } else {
        
        productList.innerHTML = `<p>No products found.</p>`;
    }
}
displayProducts();
