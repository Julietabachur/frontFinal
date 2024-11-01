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
      return shuffled.slice(0, 10); // Selecciona 10 productos aleatorios para mostrar en el slider
    };
    setRandomProducts(selectRandomProducts());
  }, [paginatedData]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 5 >= randomProducts.length ? 0 : prevIndex + 5
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? randomProducts.length - 5 : prevIndex - 5
    );
  };

  return (
    <Flex direction="column" alignItems="center" m={8}>
      <ProductCardContainer>
        <Flex direction="row" gap={4}>
          {randomProducts.slice(currentIndex, currentIndex + 5).map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </Flex>
      </ProductCardContainer>
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