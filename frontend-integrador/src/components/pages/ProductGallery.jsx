import React from 'react';

const ProductGallery = ({ productImages }) => {
  const images = productImages
  return (
    <div className="image-gallery">
      <div className="main-image">
        <img src={images[0]} alt="Main" />
      </div>
      <div className="thumbnail-grid">
        {images.slice(1, 5).map((image, index) => (
          <img key={index} src={image} alt={`Thumbnail ${index}`} />
        ))}
        <div className="view-more">Ver más</div>
      </div>
    </div>
  );
};

export default ProductGallery;