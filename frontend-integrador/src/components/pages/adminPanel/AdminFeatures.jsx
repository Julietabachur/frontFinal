import React from 'react'
import { useEffect, useState } from 'react';
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  Text
} from '@chakra-ui/react'


const AdminFeatures = ({getFeatures, token, listFeatures, pageFeatures, handlePageChange}) => {


  useEffect(() => {
    getFeatures();
  }, [pageFeatures]); // Agrega 'page' como dependencia para que se actualice cuando cambie el número de página



    return (
      <Text> Listado de caracteristicas</Text>
      
    )
  }
export default AdminFeatures