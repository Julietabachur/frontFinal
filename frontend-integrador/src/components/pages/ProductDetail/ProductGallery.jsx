import React from 'react';

const ProductGallery = ({ images }) => {

  return (
    <div className="product-gallery">
      <div className="main-image">
        <img src={images[0]} alt="Imagen Principal" />
      </div>
      <div className="thumbnail-grid">
        {images.slice(1, 5).map((image, index) => (
          <div className="thumbnail" key={index}>
            <img src={image} alt={`Imagen ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="view-more">
        <a href="/ver-todas-las-imagenes">Ver más</a>
      </div>
    </div>
  );
};

export default ProductGallery;