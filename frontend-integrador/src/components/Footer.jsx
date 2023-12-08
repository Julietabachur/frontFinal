import { useEffect, useState } from 'react'
import { Box, Text, Image, VStack, Spacer, HStack } from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {

  const instagramLink = "https://instagram.com/";
  const facebookLink = "https://facebook.com/";

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

    <>
      {media ? (
        <VStack bg={'#444444'} p={3} textAlign="center" w="99vw">
          <HStack spacing='16px' py={'20px'}>
            <Box w='40px' h='40px'>
              <FaFacebook size={35} color={'#EDF2F7'} />
            </Box>
            <Box w='40px' h='40px'>
              <FaInstagram size={35} color={'#EDF2F7'} />
            </Box>
            <Box w='40px' h='40px'>
              <Text>HOLA</Text>
            </Box>
          </HStack>
          <VStack
            spacing={4}
            align='stretch'
            d='flex'
            justifyContent="center"
            alignItems="center"
            my={3}
          >
            <Box h='40px' d='flex' justifyContent="center" alignItems="center">
              <Image ml={2} src="https://images-g3.s3.amazonaws.com/logoFooter.png" alt="Logo" />
            </Box>
            <Box h='40px' d='flex' justifyContent="center" alignItems="center">
              <Text ml={2} fontSize="sm" color='gray.100' textAlign="left" as='b'>
                Copyright - 2023 - Digital House
              </Text>
            </Box>
          </VStack>
        </VStack>
      )
        :
        (
          <HStack bg={'#444444'} p={3} textAlign="center" w="99vw">
            <VStack
              spacing={4}
              align='stretch'
              d='flex'
              justifyContent="center"
              alignItems="start"
              my={5}

            >
              <Box h='40px' d='flex' justifyContent="center" alignItems="start">
                <Image ml={7} src="https://images-g3.s3.amazonaws.com/logoFooter.png" alt="Logo" />
              </Box>
              <Box h='40px' d='flex' justifyContent="center" alignItems="start">
                <Text ml={7} fontSize="sm" color='gray.100' textAlign="left" as='b'>
                  Copyright - 2023 - Digital House
                </Text>
              </Box>
            </VStack>
            <Spacer />
            <HStack spacing='16px' pb={'50px'} mr={7}>

              <Box w='40px' h='40px'>
                <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={35} color={'#EDF2F7'} />
                </a>
              </Box>

              <Box w='40px' h='40px'>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={35} color={'#EDF2F7'} />
                </a>
              </Box>

              <Box w='60px' h='40px'>
              </Box>

            </HStack>
          </HStack>
        )
      }
    </>
  )
}

export default Footer