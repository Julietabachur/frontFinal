import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    HStack,
    VStack,
    Image,
    Text,
    Box,
    Button,
    IconButton,
    Stack,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { FaFacebookSquare, FaInstagram, FaTwitter } from "react-icons/fa";
import { FcShare } from "react-icons/fc";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon } from "react-share";

const SocialShare = ({ openShareModal, setOpenShareModal, shareTitle, shareText, shareImage, shareUrl }) => {

    console.log("Titulo: ", shareTitle);
    console.log("Texto: ", shareText);
    console.log("Imagen: ", shareImage);
    console.log("Url: ", shareUrl);


    const setShare = (origin) => {
        if (origin == "facebook") {

            alert("PUBLICAR EN FACEBOOK");





        } else if (origin == "instagram") {

            alert("PUBLICAR EN Instagram");

        } else if (origin == "twitter") {

            alert("PUBLICAR EN Twitter");

        }

    };

    const handleCancel = () => {
        // Cierra el modal y resetea el formulario
        setOpenShareModal(false);
        //onClose();

    };

    // Icono cuadrado con funcionalidad "onClick"
    //<IconButton colorScheme='gray' variant='outline' size='lg' aria-label='Share' icon={<FaInstagram />} onClick={() => setShare('instagram')} />


    return (
        <>

            <Modal isOpen={openShareModal} onClose={handleCancel} size={'sm'}>
                <ModalOverlay />
                <ModalContent mt={130} maxWidth="40%">
                    <ModalHeader>Compartir</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody borderColor={"black"}>
                        <Flex border={1}
                            flexDirection="column"
                            align={'center'}
                            p={1}
                            gap={5}
                            my={1}
                            maxHeight="45vh"
                        >
                            <Image w={120} h={150} src={shareImage} alt={shareTitle} />
                            <Text size='sm'>{shareTitle}</Text>
                            <Text size={'sm'}>{shareUrl}</Text>
                            <HStack>

                                <div>
                                    <FacebookShareButton
                                        url={shareUrl}
                                        quote={shareTitle}
                                        hashtag="#riskko"
                                    >
                                        <IconButton colorScheme='gray' variant='outline' size='lg' aria-label='Share' icon={<FaFacebookSquare />} />

                                    </FacebookShareButton>

                                </div>

                                <TwitterShareButton
                                    url={shareUrl}
                                    quote={shareTitle}
                                    hashtag="#riskko"
                                >
                                    <IconButton colorScheme='gray' variant='outline' size='lg' aria-label='Share' icon={<FaTwitter />} />
                                </TwitterShareButton>

                            </HStack>

                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>



        </>
    );

};

export default SocialShare;