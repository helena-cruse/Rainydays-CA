const apiURL = "https://api.noroff.dev/api/v1/rainy-days";

function getCheckoutCart() {
    return JSON.parse(localStorage.getItem("checkoutCart")) || [];
}

function clearCheckoutCart() {
    localStorage.removeItem("checkoutCart");
}

async function displayCheckoutCart() {
    const checkoutCart = getCheckoutCart();
    const cartContainer = document.getElementById("checkout-items");
    const totalElement = document.getElementById("checkout-total");

    if (checkoutCart.length === 0) {
        cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
        totalElement.textContent = "Total: 0 NOK";
        return;
    }

    let totalPrice = 0;
    cartContainer.innerHTML = "";

    for (const item of checkoutCart) {
        try {
            const response = await fetch(`${apiURL}/${item.id}`);
            if (!response.ok) {
                throw new Error(`HTTP-feil: ${response.status}`);
            }

            const product = await response.json();

            cartContainer.innerHTML += `
            <div class="checkout-item">
                <h3>${product.title || product.name}</h3>
                <p>Size: ${item.size}</p>
                <p>Price: ${product.price} NOK</p>
            </div>
            `;

            totalPrice += product.price;
        } catch (error) {
            console.error("Feil ved henting av produktdata:", error.message);
        }
    }

    totalElement.textContent = `Total: ${totalPrice.toFixed(2)} NOK`;
}

document.getElementById("complete-order-btn").addEventListener("click", () => {
    alert("Thank you for your purchase!");
    clearCheckoutCart();
    window.location.href = "checkout-success.html";
});

displayCheckoutCart();
