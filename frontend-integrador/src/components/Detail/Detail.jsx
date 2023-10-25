import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Detail = () => {
  const [product, setProduct] = useState({});
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const { id } = useParams();

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/public/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  return (
    <>
      <div className="conteiner-product">
        {product && (
          <div key={product.id} data={product}>
            <figure className="container-img">
              <img src={product.image} alt={product.title} />
              <div>
                <h3>{product.title}</h3>
                <p>{product.price}</p>
              </div>
            </figure>
          </div>
        )}
      </div>
    </>
  );
};

export default Detail;