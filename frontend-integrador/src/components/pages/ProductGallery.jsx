import React, { useEffect, useState } from "react";
import { Image, Grid, GridItem } from "@chakra-ui/react";

const ProductGallery = ({ ...gallery }) => {
  const lista = gallery.gallery;
  const [main, setMain] = useState(0);

  useEffect(() => {
    if (Array.isArray(lista)) {
      setMain(lista[0]);
    }
  }, []);

  return (
    Array.isArray(lista) && (
      <Grid
        h={["auto"]}
        w={["auto", "100%"]}
        templateRows={["repeat(2, 1fr)", "repeat(2, 1fr)"]}
        templateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
        gap={2}
      >
        {lista[0] && (
          <GridItem rowSpan={2} colSpan={2}>
            <Image h={"100%"} objectFit={"cover"} src={lista[0]} alt="photo" />
          </GridItem>
        )}
        {lista[1] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image h={"100%"} objectFit={"cover"} src={lista[1]} alt="photo" />
          </GridItem>
        )}
        {lista[2] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image h={"100%"} objectFit={"cover"} src={lista[2]} alt="photo" />
          </GridItem>
        )}
        {lista[3] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image h={"100%"} objectFit={"cover"} src={lista[3]} alt="photo" />
          </GridItem>
        )}
        {lista[4] && (
          <GridItem rowSpan={1} colSpan={1}>
            <Image h={"100%"} objectFit={"cover"} src={lista[4]} alt="photo" />
          </GridItem>
        )}
      </Grid>
    )
  );
};

export default ProductGallery;
