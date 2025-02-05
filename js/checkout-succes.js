
document.addEventListener("DOMContentLoaded", () => {
    const orderTotalElement = document.getElementById("order-total");
    const orderTotal = localStorage.getItem("orderTotal") || "0 NOK";
    orderTotalElement.textContent = orderTotal;

    localStorage.removeItem("cart");
});
