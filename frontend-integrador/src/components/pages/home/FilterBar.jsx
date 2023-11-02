import { Checkbox, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const FilterBar = ({categories}) => {

    const [media, setMedia] = useState(false);
    const MIN_DESKTOP_WIDTH = 768;

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
  
      window.addEventListener("resize", handleResize);
  
      // Limpieza del event listener cuando el componente se desmonta
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [window.innerWidth]);

  return (
    <VStack align="start" justifyContent='start' bg={'black'} w={'200px'} p={4} h={'100vh'}>

        {/* {media ? 
        ()
        :
        ()
        } */}
   
      {categories.map((category) => (
        <Checkbox key={category.id} size="md">
          <Text fontSize="md" color={"verde2"} >{category.name}</Text>
        </Checkbox>
      ))}
    </VStack>
    
   
  )
}

export default FilterBar