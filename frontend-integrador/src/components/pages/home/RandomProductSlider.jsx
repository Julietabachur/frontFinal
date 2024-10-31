import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useProductContext } from "./Global.context";
import { useState, useEffect } from "react";
import ProductCardContainer from "./ProductCardContainer";
import ProductCard from "./ProductCard";

const RandomProductSlider = () => {
  const { paginatedData } = useProductContext();
  const [randomProducts, setRandomProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const selectRandomProducts = () => {
      const shuffled = paginatedData.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 15); // Seleccionar 15 productos aleatorios
    };
    setRandomProducts(selectRandomProducts());
  }, [paginatedData]);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [randomProducts]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 5) % randomProducts.length
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? randomProducts.length - 5 : prevIndex - 5
    );
  };

  return (
    <Flex direction="column" alignItems="center" m={8}>
      <HStack spacing={6}>
        {randomProducts.slice(currentIndex, currentIndex + 5).map((product) => (
          <ProductCardContainer key={product.id}>
            <ProductCard item={product} />
          </ProductCardContainer>
        ))}
      </HStack>
      <HStack mt={4} spacing={4}>
        <Button onClick={goToPrevious}>
          <ArrowBackIcon />
        </Button>
        <Button onClick={goToNext}>
          <ArrowForwardIcon />
        </Button>
      </HStack>
    </Flex>
  );
};

export default RandomProductSlider;