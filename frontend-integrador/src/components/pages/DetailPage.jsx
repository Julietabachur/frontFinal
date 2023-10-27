import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductGallery from "./ProductGallery";
import axios from "axios";

const DetailPage = () => {
  const [product, setProduct] = useState({});
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const { id } = useParams();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        console.log(response.data);
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      <div className="conteiner-product">
        {product && (
          <div key={product.id} data={product}>
            <figure className="container-img">
              <img src={product.thumbnail} alt={product.productName} />
              <div>
                {Array.isArray(product.gallery) && (
                  <ProductGallery productImages={product.gallery} />
                )}
                <h3>{product.productName}</h3>
                <p>{product.detail}</p>
                <h4>{product.collection}</h4>
              </div>
            </figure>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailPage;
