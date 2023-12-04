import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HStack,
  Image,
  Text,
  Textarea,
  Icon,
  IconButton,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  FaFacebookSquare,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const SocialShare = ({
  openShareModal,
  setOpenShareModal,
  shareTitle,
  shareText,
  shareImage,
  shareUrl,
}) => {


  const [customMessage, setCustomMessage] = useState(""); // Nuevo estado para el mensaje personalizado

  const handleCancel = () => {
    // Cierra el modal y resetea el formulario
    setOpenShareModal(false);
    //onClose();
  };

  console.log("SocialShare");
  console.log(shareTitle, shareUrl);

  return (
    <>
      <Modal isOpen={openShareModal} onClose={handleCancel} size={"sm"}>
        <ModalOverlay />
        <ModalContent mt={130} maxWidth="40%">
          <ModalHeader>Compartir</ModalHeader>
          <ModalCloseButton />
          <ModalBody borderColor={"black"}>
            <Flex
              border={1}
              flexDirection="column"
              align={"center"}
              p={1}
              gap={5}
              my={1}
              maxHeight="65vh"
            >
              <Image w={120} h={150} src={shareImage} alt={shareTitle} />
              <Text size="sm">{shareTitle}</Text>
              <Text size={"sm"}>{shareUrl}</Text>
              {/* Nuevo Textarea para el mensaje personalizado */}
              <Textarea
                placeholder="Agrega tu comentario..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
              <HStack>

                <FacebookShareButton
                  url={shareUrl}
                  title={shareTitle + '\n' + customMessage}
                  hashtag="riskko"
                >

                  <Icon as={FaFacebookSquare} w={8} h={8} color='blue.900' />

                </FacebookShareButton>


                <TwitterShareButton
                  url={shareUrl}
                  title={shareTitle + '\n' + customMessage}
                  hashtags={["riskko"]}
                >

                  <Icon as={FaTwitter} w={8} h={8} color='blue.400' />

                </TwitterShareButton>


                <WhatsappShareButton
                  url={shareUrl}
                  title={shareTitle + '\n' + customMessage}
                >

                  <Icon as={FaWhatsapp} w={8} h={8} color='green.600' />

                </WhatsappShareButton>

              </HStack>

            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SocialShare;
