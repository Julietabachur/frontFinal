import React, { useState } from "react";
import {
  HStack,
  Image,
  Text,
  Textarea,
  Icon,
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
  const [customMessage, setCustomMessage] = useState("");

  const handleCancel = () => {
    setOpenShareModal(false);
  };

  return (
    <Modal isOpen={openShareModal} onClose={handleCancel} size="sm">
      <ModalOverlay />
      <ModalContent
        mt={{ base: "20px", md: "130px" }}
        maxWidth={{ base: "90%", md: "40%" }}
      >
        <ModalHeader>Compartir</ModalHeader>
        <ModalCloseButton />
        <ModalBody borderColor="black">
          <Flex
            flexDirection="column"
            align="center"
            p={1}
            gap={5}
            my={1}
            maxHeight="65vh"
          >
            <Image
              w={{ base: "80px", md: "120px" }}
              h={{ base: "100px", md: "150px" }}
              src={shareImage}
              alt={shareTitle}
            />
            <Text size="sm" textAlign="center">
              {shareTitle}
            </Text>
            <Text
              size="sm"
              textAlign="center"
              wordBreak="break-word"
              maxWidth="100%"
            >
              {shareUrl}
            </Text>
            <Textarea
              placeholder="Agrega tu comentario..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <HStack justify="center" spacing={4}>
              <FacebookShareButton
                url={shareUrl}
                title={`${shareTitle}\n${customMessage}`}
                hashtag="riskko"
              >
                <Icon as={FaFacebookSquare} w={6} h={6} color="blue.900" />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareUrl}
                title={`${shareTitle}\n${customMessage}`}
                hashtags={["riskko"]}
              >
                <Icon as={FaTwitter} w={6} h={6} color="blue.400" />
              </TwitterShareButton>
              <WhatsappShareButton
                url={shareUrl}
                title={`${shareTitle}\n${customMessage}`}
              >
                <Icon as={FaWhatsapp} w={6} h={6} color="green.600" />
              </WhatsappShareButton>
            </HStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SocialShare;

