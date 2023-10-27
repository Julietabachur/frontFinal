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
        {lista[0] && (
          <GridItem rowSpan={2} colSpan={2}>
            <Image src={lista[0]} alt="photo" />
          </GridItem>
        )}
        {lista[1] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image src={lista[1]} alt="photo" />
          </GridItem>
        )}
        {lista[2] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image src={lista[2]} alt="photo" />
          </GridItem>
        )}
        {lista[3] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image src={lista[3]} alt="photo" />
          </GridItem>
        )}
        {lista[4] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image src={lista[4]} alt="photo" />
          </GridItem>
        )}
      </Grid>
    )
  );
};

export default ProductGallery;
