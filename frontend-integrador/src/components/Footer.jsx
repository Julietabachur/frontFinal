import { useEffect, useState } from 'react'
import { Box, Text, Image, VStack, Spacer, HStack } from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaHeart  } from 'react-icons/fa';

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
        <VStack bg={'white'} p={3} textAlign="center" w="99vw" alignItems={'center'}>
          <HStack spacing='16px' py={'20px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <Box w='40px' h='40px' color={'verdeAgua'}>
              <a href={facebookLink} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={25} color={'verdeAgua'} />
              </a>
            </Box>

            <Box w='40px' h='40px' color={'verdeAgua'}>
              <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={25}  />
              </a>
            </Box>           
          </HStack>
          <HStack color={'verdeAgua'} fontWeight={'bold'} display={'flex'} fontSize={10}>
              <Text >MADE WITH  </Text>
              <FaHeart  size={25}  />
              <Text>BY VALKIRIA</Text>
            </HStack>
        </VStack>
      )
        :
        (      
      <HStack bg={'white'} p={3} px={10} textAlign="center" w="100vw"  boxShadow="0px 0px 6px 1px rgba(0, 0, 0, 0.25)" justifyContent={'space-between'}>
        <HStack
          spacing={4}
          align='stretch'
          d='flex'
          justifyContent="center"
          alignItems="start"
          my={5}

        >
          <a
        href="/"
        style={{
          textDecoration: "none",
          color: "black",
        }}
        // display={'flex'} alignItems={'center'} justifyContent={'center'}
      >
        <HStack display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <Image
            src="../Isotipo-Valkiria-Sand.png"
            alt="Logo Valkiria"
          style={{
            height: "40px",
          }}
        />

        <Text fontFamily={'Prociono'}  color={'verdeAgua'} fontWeight={"bold"} fontSize={'30px'}>VALKIRIA</Text>
        </HStack>
      </a>
          {/* <Box h='40px' d='flex' justifyContent="center" alignItems="start">
            <Image ml={7} h={'50px'} src="../Isotipo-Valkiria-Sand.png" alt="Logo" />
          </Box>
        <Text fontFamily={'Prociono'}  color={'verdeAgua'} fontWeight={"bold"} fontSize={'30px'}>VALKIRIA</Text> */}

          {/* <Box h='40px' d='flex' justifyContent="center" alignItems="start">
            <Text ml={7} fontSize="sm" color='black' textAlign="left" as='b'>
              Copyright - 2023 - Digital House
            </Text>
          </Box> */}
        </HStack>
        {/* <Spacer /> */}
        <HStack color={'verdeAgua'} fontWeight={'bold'} display={'flex'}>
          <Text >MADE WITH  </Text>
          <FaHeart  size={25}  />
          <Text>BY VALKIRIA</Text>
        </HStack>
        <HStack spacing='16px'>

          <Box w='40px' h='40px' color={'verdeAgua'}>
            <a href={facebookLink} target="_blank" rel="noopener noreferrer">
              <FaFacebook size={35} color={'verdeAgua'} />
            </a>
          </Box>

          <Box w='40px' h='40px' color={'verdeAgua'}>
            <a href={instagramLink} target="_blank" rel="noopener noreferrer">
              <FaInstagram size={35}  />
            </a>
          </Box>

        </HStack>
      </HStack>
        )
      }
    </>
  )
}

export default Footer