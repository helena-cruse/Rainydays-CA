const apiURL = "https://api.noroff.dev/api/v1/rainy-days";

function getCartItems() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCartItems(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(index) {
    let cart = getCartItems();
    cart.splice(index, 1);
    saveCartItems(cart);
    displayCart();
}

async function displayCart() {
    const cartItems = getCartItems();
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
        cartTotal.textContent = "Total: 0 NOK";
        document.getElementById("checkout-btn").disabled = true;
        return;
    }

    document.getElementById("checkout-btn").disabled = false;

    let totalPrice = 0;
    cartContainer.innerHTML = "";

    for (const [index, item] of cartItems.entries()) {
        try {
            const response = await fetch(`${apiURL}/${item.id}`);
            if (!response.ok) {
                throw new Error(`HTTP-feil: ${response.status}`);
            }

            const product = await response.json();

            cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.title || product.name}">
                <div class="cart-item-info">
                    <h3>${product.title || product.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Price: ${product.price} NOK</p>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                </div>
            </div>
            `;

            totalPrice += product.price;
        } catch (error) {
            console.error("Feil ved henting av produkt fra handlekurv:", error.message);
        }
    }

    cartTotal.textContent = `Total: ${totalPrice.toFixed(2)} NOK`;

    addRemoveEventListeners();
}

function addRemoveEventListeners() {
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            removeFromCart(index);
        });
    });
}

document.getElementById("checkout-btn").addEventListener("click", () => {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    localStorage.setItem("checkoutCart", JSON.stringify(cartItems));
    window.location.href = "checkout.html";
});

displayCart();
