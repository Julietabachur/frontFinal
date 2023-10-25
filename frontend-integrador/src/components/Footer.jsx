import React from 'react'
import { Box, Text, Image, VStack, Spacer, HStack  } from '@chakra-ui/react';
import { FaFacebook,FaInstagram,FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (

        <Box bg="gray.600" p={4} textAlign="center">         
          <HStack>
            <VStack
              spacing={4}
              align='stretch'
              d='flex'
              justifyContent="center"
              alignItems="start"
              my={5}
            >
              <Box h='40px' d='flex' justifyContent="center" alignItems="start">
                <Image ml={2} src="https://images-g3.s3.amazonaws.com/logoFooter.png" alt="Logo"/>
              </Box>
              <Box h='40px' d='flex' justifyContent="center" alignItems="start">
                <Text ml={2} fontSize="sm" color='gray.100' textAlign="left" as='b'>
                  Copyright - 2023 - Digital House
                </Text>
              </Box>
            </VStack>
            <Spacer />
            <Box>
              <HStack spacing='16px'>
                <Box w='60px' h='60px'>
                  <FaFacebook size={56} color={'#EDF2F7'}/>
                </Box>
                <Box w='60px' h='60px'>
                  <FaInstagram size={56} color={'#EDF2F7'}/>
                </Box>
                <Box w='60px' h='60px'>
                  <FaWhatsapp size={56} color={'#EDF2F7'}/>
                </Box>
              </HStack>
            </Box>
          </HStack>
          
        </Box>


  )
}

export default Footer