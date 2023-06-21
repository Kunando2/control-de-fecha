window.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('product-form');
  const productInput = document.getElementById('product-input');
  const codeInput = document.getElementById('code-input');
  const dateInput = document.getElementById('date-input');
  const quantityInput = document.getElementById('quantity-input');
  const productList = document.getElementById('product-list');
  const daysToExpiration = document.getElementById('days-to-expiration');

  const getStoredProducts = () => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
  };

  const updateProductList = (products) => {
    productList.innerHTML = '';

    products.forEach((product) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <b>Producto:</b> ${product.product}<br>
        <b>Código:</b> ${product.code}<br>
        <b>Fecha:</b> ${product.date}<br>
        <b>Cantidad:</b> ${product.quantity}
      `;
      productList.appendChild(li);
    });
  };

  const addProduct = (product, code, date, quantity) => {
    const products = getStoredProducts();
    products.push({ product, code, date, quantity });
    localStorage.setItem('products', JSON.stringify(products));
    updateProductList(products);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const product = productInput.value.trim();
    const code = codeInput.value.trim();
    const date = dateInput.value;
    const quantity = quantityInput.value.trim();

    if (product !== '' && code !== '' && date !== '' && quantity !== '') {
      addProduct(product, code, date, quantity);
      productInput.value = '';
      codeInput.value = '';
      dateInput.value = '';
      quantityInput.value = '';
    }
  };

  

  const calculateDaysToExpiration = (expirationDate) => {
    const expirationTime = new Date(expirationDate).getTime();

    const updateCountdown = () => {
      const currentTime = new Date().getTime();
      const timeDifference = expirationTime - currentTime;

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        daysToExpiration.textContent = `Días restantes para vencimiento: ${days}`;
      } else {
        daysToExpiration.textContent = 'Producto vencido';
      }
    };

    updateCountdown();

    setInterval(updateCountdown, 1000 * 60 * 60 * 24); // Actualizar cada 24 horas
  };

  const displayStoredProducts = () => {
    const storedProducts = getStoredProducts();
    updateProductList(storedProducts);

    if (storedProducts.length > 0) {
      const latestProduct = storedProducts[storedProducts.length - 1];
      calculateDaysToExpiration(latestProduct.date);
    }
  };

  displayStoredProducts();

  
});
