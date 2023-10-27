import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  VStack,
  Image,
  Text,
  Box,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import axios from "axios";
const DetailPage = () => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();

  const getDetail = async () => {
    const response = await axios.get(
      `${baseUrl}/api/v1/public/products/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      setDetail(response.data);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <Box w={"100vw"} display={"flex"} justifyContent={"center"} p={20}>
      {detail && (
        <VStack color={"blanco"} w={"70vw"} justifySelf={"center"}>
          <HStack
            justify={"space-between"}
            w={"100%"}
            h={"60px"}
            color={"blanco"}
            border={"1px solid black"}
            alignContent={"center"}
            justifyContent={"space-between"}
            padding={"10px"}
          >
            <Text fontFamily={"Saira"} color={"black"} fontSize={"24px"}>
              {detail.productName}
            </Text>
            <Button onClick={() => navigate(-1)}> atras </Button>
          </HStack>

          <Box h={"1030px"} border={"2px solid black"}>
            <VStack h={"300px"} border={"1px solid black"} p={20}>
              <Box
                h={"30px"}
                border={"1px solid black"}
                w={"30%"}
                textAlign="center"
              >
                <Text
                  fontFamily={"Saira"}
                  color={"black"}
                  fontSize={"14px"}
                  p={1}
                >
                  DESCRIPCION DEL PRODUCTO
                </Text>
              </Box>
              <Text
                fontFamily={"Podkova"}
                color={"black"}
                fontSize={"23px"}
                marginTop={"20px"}
              >
                {detail.detail}
              </Text>
            </VStack>

            <Grid
              h={["auto", "500px"]}
              w={["auto", "100%"]}
              templateRows={["repeat(2, 1fr)", "repeat(2, 1fr)"]}
              templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
              gap={2}
            >
              <GridItem rowSpan={2} colSpan={2}>
                <Image objectFit="cover" src={detail.thumbnail} alt="photo" />
              </GridItem>
              <GridItem rowSpan={1} colSpan={1} ><Image objectFit="cover" src={detail.thumbnail} alt="photo" /></GridItem>
              <GridItem rowSpan={1} colSpan={1} ><Image objectFit="cover" src={detail.thumbnail} alt="photo" /></GridItem>
              <GridItem rowSpan={1} colSpan={1} ><Image objectFit="cover" src={detail.thumbnail} alt="photo" /></GridItem>
              <GridItem rowSpan={1} colSpan={1} ><Image objectFit="cover" src={detail.thumbnail} alt="photo" /></GridItem>
            </Grid>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default DetailPage;
