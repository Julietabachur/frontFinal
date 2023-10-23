import React from "react";
import ProductGallery from "./ProductGallery";

const ProductDetails = () => {
    
    const product = {
      title: 'Nombre',
      description: 'Descripción del Producto',
      images: [ , ,],
    };
    return (
    
      <div className="product-details">
      <div className="product-header">
        <h1 className="product-title">{product.title}</h1>
        <div className="go-back">
            {/* Flecha */}
          </div>
        </div>
        <div className="product-body">
        <p>{product.description}</p>
          <ProductGallery images={product.images} />
        </div>
      </div>
    );
  };
  
  export default ProductDetails;