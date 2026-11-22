import "./styles/base.css";
import "./app";

document.addEventListener("cart:add", (event) => {
    const { product, quantity } = (
        event as CustomEvent<{
            product: Product;
            quantity: number;
        }>
    ).detail;

    addToCart(product, quantity);

    document.dispatchEvent(new Event("cart:updated"));
});