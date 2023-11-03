import { Checkbox, Text, VStack, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const FilterBar = ({ categories }) => {
  const [media, setMedia] = useState(false);
  const [filteredProductCount, setFilteredProductCount] = useState(0);
  const MIN_DESKTOP_WIDTH = 768;

  // Función para contar la cantidad de productos filtrados
  const countFilteredProducts = () => {
    const filteredCount = categories.filter((category) => category.isChecked).length;
    setFilteredProductCount(filteredCount);
  };

  // Función para limpiar los filtros
  const clearFilters = () => {
    categories.forEach((category) => {
      category.isChecked = false;
    });
    setFilteredProductCount(0);
  };

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
      } else {
        setMedia(false);
      }
    };

    if (window.innerWidth < MIN_DESKTOP_WIDTH) {
      setMedia(true);
    } else {
      setMedia(false);
    }

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <VStack align="start" justifyContent="start" bg="black" w="200px" p={4} h="100vh">
      <Text fontSize="md" color="verde2">
        Mostrando {filteredProductCount} de {categories.length} productos.
      </Text>

      {categories.map((category) => (
        <Checkbox
          key={category.id}
          size="md"
          isChecked={category.isChecked}
          onChange={() => {
            category.isChecked = !category.isChecked;
            countFilteredProducts();
          }}
        >
          <Text fontSize="md" color="verde2">
            {category.name}
          </Text>
        </Checkbox>
      ))}

      <Button
        size="md"
        colorScheme="red" // Puedes elegir el color que desees
        onClick={clearFilters}
        mt={4} // Margen superior para separar el botón de los checkboxes
      >
        Limpiar Filtro
      </Button>
    </VStack>
  );
};

export default FilterBar;