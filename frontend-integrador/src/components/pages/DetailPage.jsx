import React from 'react'
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from "react-router-dom"
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
} from "@chakra-ui/react";

const DetailPage = () => {

  const [details, setDetails] = useState ({
    productName: "CAMPERA JEAN BLACK",
    size: "L",
    type: "JACKET",
    productionTime: 20,
    collection: "VERANO",
    thumbnail: "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/foto-26-231-d78a1139211823445c16940343745727-1024-1024.png",
    detail: "Campera de jean negro de 10 oz. Amplia estilo oversize.\nBolsillos delanteros inferiores y superiores.\nTiene un proceso de lavado y suavizado dandole mejor calidad y acabado.\nCierre delantero con botones metálicos.",
    gallery: ["https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/campe-jean-11-94ef454443a9f3569416939378158959-1024-1024.png" ,
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/campe-jean-21-7f4f3635487336570b16939378159297-1024-1024.png",
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/campe-jean-41-f78b4d10a96d8e624c16939378159959-1024-1024.png",
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/campe-jean-51-0aefc87d0f6a7d5ef216939378159030-1024-1024.png",
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/foto-26-101-eab28669eda616d84c16939507892020-1024-1024.png",
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/foto-26-231-d78a1139211823445c16940343745727-1024-1024.png",
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/foto-26-91-d6dae675ec0016ef5c16939507890258-1024-1024.png",
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/foto-27-11-229e81fb1b892c01c216939507887581-1024-1024.png",
    "https://images-g3.s3.amazonaws.com/products/Catalogo/A+-+Abrigos/CAMPERA+JEAN+BLACK/foto-27-21-c9574950a6a0f1c36316939507892518-1024-1024.png"]
  })


  return (

    <Card w={"80%"} color={"blanco"}>
      <CardHeader h={"60px"} color={"blanco"} border={"1px solid black"} alignContent={"center"} justifyContent={'space-between'}
      padding={"10px"}
      >
        <Text
          fontFamily={"Saira"}
          color={"black"}
          fontSize={"24px"}
        >
          {details.productName}
        </Text>
        <Button onClick={() => navigate(-1)} > Atras </Button>
      </CardHeader>

      <CardBody w={"1100px"} h={"1030px"} color={"blanco"} border={"1px solid black"}>

        <Box h={"300px"} bg={"blanco"} border={"1px solid black"} >
          <Box h={"30px"} bg={"blanco"} border={"1px solid black"}  textAlign="center" marginTop={"40px"} >
            <Text fontFamily={"Saira"} color={"black"} fontSize={"14px"}>
              DESCRIPCION DEL PRODUCTO
            </Text>
          </Box>
          <Text fontFamily={"Podkova"} color={"black"} fontSize={"13px"} marginTop={"20px"}>
            {details.detail}
          </Text>
        </Box>
    
        
        <Box>
          <Box w={"560px"} h={"730px"} border={"1px solid black"}>
            <Image w={"560px"} h={"730px"}>
              {details.thumbnail}
            </Image>
          </Box>

          <Box> Aca van las otras 4 imaganes
          </Box>
        </Box>
        
      </CardBody>

     

    </Card>
    )
  }

export default DetailPage