import React, { useEffect } from "react";
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

const ProductGallery = ({ ...gallery }) => {
  const lista = gallery.gallery;



  return (
    lista && (
      <Grid
        h={["auto"]}
        w={["auto", "100%"]}
        templateRows={["repeat(2, 1fr)", "repeat(2, 1fr)"]}
        templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
        gap={2}
      >
        <GridItem rowSpan={2} colSpan={2}>
          <Image objectFit="cover" src={lista[0]} alt="photo" />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Image objectFit="cover" src={lista[0]} alt="photo" />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Image objectFit="cover" src={lista[0]} alt="photo" />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Image objectFit="cover" src={lista[0]} alt="photo" />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1}>
          <Image objectFit="cover" src={lista[0]} alt="photo" />
        </GridItem>
      </Grid>
    )
  );
};

export default ProductGallery;
