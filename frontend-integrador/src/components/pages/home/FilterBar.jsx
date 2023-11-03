import { Checkbox, Text, VStack } from '@chakra-ui/react';
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
          onChange={() => {
            // Actualiza el estado de isChecked en función del cambio del checkbox
            category.isChecked = !category.isChecked;
            countFilteredProducts(); // Recuenta los productos filtrados
          }}
        >
          <Text fontSize="md" color="verde2">
            {category.name}
          </Text>
        </Checkbox>
      ))}
    </VStack>
  );
};

export default FilterBar;