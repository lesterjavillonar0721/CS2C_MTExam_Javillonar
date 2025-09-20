document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from local storage or create an empty cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCartDisplay();

    // Add event listeners to all "Add to Cart" buttons
    const addButtons = document.querySelectorAll('.add-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', addItemToCart);
    });

    // Function to add an item to the cart
    function addItemToCart(event) {
        const productDiv = event.target.closest('.product');
        const productId = productDiv.dataset.id;
        const productName = productDiv.querySelector('h4').textContent;
        const productPrice = parseFloat(productDiv.querySelector('.price').textContent.replace('₱', ''));

        // Check if the item is already in the cart
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            // If item exists, increase quantity
            existingItem.quantity += 1;
        } else {
            // If item doesn't exist, add new item with quantity 1
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        // Save the updated cart to local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the cart display
        updateCartDisplay();

        // Enable the "Remove" button for the added item
        const removeButton = productDiv.querySelector('.remove-btn');
        removeButton.disabled = false;
    }

    // Add event listeners to all "Remove" buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });

    // Function to remove an item from the cart
    function removeItemFromCart(event) {
        const productDiv = event.target.closest('.product');
        const productId = productDiv.dataset.id;

        // Find the index of the item in the cart
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
            // Remove the item from the cart
            cart.splice(itemIndex, 1);

            // Save the updated cart to local storage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Update the cart display
            updateCartDisplay();

            // Disable the "Remove" button for the removed item
            event.target.disabled = true;
        }
    }

    // Function to update the cart display
    function updateCartDisplay() {
        let itemCount = 0;
        let cartTotal = 0;

        // Calculate the total number of items and the total price
        cart.forEach(item => {
            itemCount += item.quantity;
            cartTotal += item.price * item.quantity;
        });

        // Update the cart count and total in the cart summary
        document.getElementById('cart-count').textContent = itemCount;
        document.getElementById('cart-total').textContent = '₱' + cartTotal.toFixed(2);

        // Update the "Remove" button states based on the cart contents
        const productDivs = document.querySelectorAll('.product');
        productDivs.forEach(productDiv => {
            const productId = productDiv.dataset.id;
            const removeButton = productDiv.querySelector('.remove-btn');
            const isInCart = cart.some(item => item.id === productId);
            removeButton.disabled = !isInCart;
        });
    }
});