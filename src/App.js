import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [productInput, setProductInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      fetchData(); // Llama a la función para obtener los datos si no hay datos almacenados
    }
  }, []);

  const fetchData = () => {
    axios
      .get('https://plataforma3.centum.com.ar:23990/BL1/')
      .then((response) => {
        const data = response.data;
        setProducts(data);
        localStorage.setItem('products', JSON.stringify(data));
        console.log('Datos de la API:', data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
        
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      productInput.trim() === '' ||
      codeInput.trim() === '' ||
      dateInput.trim() === '' ||
      quantityInput.trim() === ''
    ) {
      return;
    }

    if (editingProductId) {
      // Editar el producto existente
      const updatedProducts = products.map((product) => {
        if (product.id === editingProductId) {
          return {
            ...product,
            product: productInput,
            code: codeInput,
            date: dateInput,
            quantity: quantityInput,
          };
        }
        return product;
      });

      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setEditingProductId(null); // Finaliza la edición
    } else {
      // Agregar un nuevo producto
      const newProduct = {
        id: Date.now(),
        product: productInput,
        code: codeInput,
        date: dateInput,
        quantity: quantityInput,
      };

      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }

    setProductInput('');
    setCodeInput('');
    setDateInput('');
    setQuantityInput('');
  };

  const handleEdit = (product) => {
    setProductInput(product.product);
    setCodeInput(product.code);
    setDateInput(product.date);
    setQuantityInput(product.quantity);
    setEditingProductId(product.id);
  };

  const handleDelete = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const calculateDaysToExpiration = (expirationDate) => {
    const expirationTime = new Date(expirationDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = expirationTime - currentTime;
    const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysRemaining > 0) {
      return daysRemaining;
    } else {
      return 'Vencido';
    }
  };

  const getDaysRemainingColor = (daysRemaining) => {
    if (daysRemaining <= 30) {
      return 'red';
    } else if (daysRemaining <= 60) {
      return 'yellow';
    } else {
      return 'inherit';
    }
  };
  const sortProductsByDaysRemaining = () => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      const daysRemainingA = calculateDaysToExpiration(a.date);
      const daysRemainingB = calculateDaysToExpiration(b.date);
      return daysRemainingA - daysRemainingB;
    });
    setProducts(sortedProducts);
  };
  return (
    <div className="container">
      <h2 className="mt-4 mb-3">Productos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Código</th>
            <th>Fecha</th>
            <th>Cantidad</th>
            <th>Días Restantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.product}</td>
              <td>{product.code}</td>
              <td>{product.date}</td>
              <td>{product.quantity}</td>
              <td style={{ color: getDaysRemainingColor(calculateDaysToExpiration(product.date)) }}>
                {calculateDaysToExpiration(product.date)}
              </td>
              <td>
                <button className="btn btn-primary" onClick={() => handleEdit(product)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={sortProductsByDaysRemaining}>
        Ordenar por días restantes (Menor a Mayor)
      </button>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese un producto"
            value={productInput}
            onChange={(e) => setProductInput(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese el código"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Ingrese la cantidad"
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingProductId ? 'Guardar Cambios' : 'Agregar'}
        </button>
        {editingProductId && (
          <button className="btn btn-secondary ml-2" onClick={() => setEditingProductId(null)}>
            Cancelar
          </button>
        )}
      </form>
      
    </div>
  );
}

export default App;
