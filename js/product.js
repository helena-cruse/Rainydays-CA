
const apiURL = "https://api.noroff.dev/api/v1/rainy-days";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    alert("No product ID found. Redirecting to homepage.");
    window.location.href = "../index.html";
}

async function fetchProductById(id) {
    try {
        console.log("Henter produkt med ID:", id);

        const response = await fetch(`${apiURL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP-feil: ${response.status} ${response.statusText}`);
        }

        const product = await response.json();
        return product;
    } catch (error) {
        console.error("Feil ved henting av produkt:", error.message);
        alert("Could not load product details. Please try again later.");
    }
}

async function displayProductDetails() {
    const productDetails = document.getElementById("product-details");
    const product = await fetchProductById(productId);

    const loadingMessage = document.getElementById("loading");
    if (loadingMessage) {
        loadingMessage.remove();
    }

    if (product) {
        productDetails.innerHTML = `
            <div class="product-container">
                <img src="${product.image}" alt="${product.title || product.name}" />
                <h1>${product.title || product.name}</h1>
                <p>${product.description}</p>
                <p><strong>Price:</strong> ${product.price} NOK</p>
                <div class="size-selector">
                    <label for="size">Choose Size:</label>
                    <select id="size">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">X-Large</option>
                    </select>
                </div>
                <div class="button-container">
                    <button id="add-to-cart" class="btn">Add to Cart</button>
                    <a href="index.html" class="btn">Back to Home</a>
                </div>
            </div>
        `;
    } else {
        productDetails.innerHTML = `<p>Product not found.</p>`;
    }
}

document.addEventListener("click", (event) => {
    if (event.target.id === "add-to-cart") {
        const size = document.getElementById("size").value;
        if (!size) {
            alert("Please select a size.");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ id: productId, size: size });
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Product added to cart! Size: ${size}`);
    }
});

displayProductDetails();
