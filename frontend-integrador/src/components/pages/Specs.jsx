import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Button } from '@chakra-ui/react';

function Specs({ detail }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
   
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    };

 
    window.addEventListener('resize', handleResize);

    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box
      width="100%"
      maxW="100%"
      paddingX={4}
      mt={5}
    >
      <Button
        variant="outline"
        onClick={toggleCollapse}
        display={{ base: 'block', md: 'none' }}
      >
        {isCollapsed ? 'Mostrar características' : 'Ocultar características'}
      </Button>

      {(!isCollapsed || window.innerWidth >= 768) && (
        <VStack>
          {detail && detail.features && detail.features.length > 0 ? (
            detail.features.map((feature, index) => (
              <Box
                key={index}
                width="100%"
                maxW="lg"
                padding={4}
                border="1px solid black"
                marginBottom={4}
              >
                <Text fontFamily="Saira" color="black" fontSize="1rem">
                  {feature.charIcon}
                </Text>
                <Text fontFamily="Saira" color="black" fontSize="1rem">
                  {feature.charName}
                </Text>
                {feature.charValue.map((value, valueIndex) => (
                  <Text
                    key={valueIndex}
                    fontFamily="Saira"
                    color="black"
                    fontSize="1rem"
                  >
                    {value}
                  </Text>
                ))}
              </Box>
            ))
          ) : (
            <Text fontFamily="Saira" color="black" fontSize="1rem">
              No hay características disponibles para este producto.
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}

export default Specs;