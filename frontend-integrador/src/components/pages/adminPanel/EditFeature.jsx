import { Alert, Button, 
  FormControl, 
  FormLabel, 
  Input, 
} from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';

const EditFeature = ({featureToEdit, token, handleCancel, handleChange, getFeatures}) => {

  const [dataEdit, setDataEdit] = useState (featureToEdit)

  const adminUrl = import.meta.env.VITE_ADMIN_URL;

  const onSubmit = (e) => {
    e.preventDefault();
    putFeature(dataEdit);
    handleChange();
    } 
  
 const putFeature = () => {

  console.log(featureToEdit.id)
  console.log(featureToEdit)
  console.log(dataEdit)

    // Realiza la solicitud PUT al endpoint para actualizar la caracteristica
    axios.put(`${adminUrl}/char/${featureToEdit.id}`, dataEdit, 
      { headers: 
        { Authorization: `Bearer ${token}` } 
      })
      .then((response) => {
        window.alert("Característica actualizada con éxito");
        getFeatures();
        console.log('Característica actualizada con éxito:', response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Si el error es 400, muestra una alerta con el mensaje de error del servidor
          window.alert(error.response.data.error);
          } else {
          // Para otros errores, muestra un mensaje de error genérico
          console.error("Error al actualizar la característica:", error);
          }
      });
  }

  return (
  <>
  <form>
            
              <FormControl>
                <FormLabel> Nombre de la característica</FormLabel>
                <Input
                  name="charName"
                  mb={3}
                  value={dataEdit.charName}
                  onChange={(e) => setDataEdit({...dataEdit, charName: (e.target.value).toUpperCase()})}
                />
                <FormLabel> Ícono representativo </FormLabel>
                <Input
                  name="charIcon"
                  mb={3}
                  value={dataEdit.charIcon}
                  onChange={(e) => setDataEdit({...dataEdit, charIcon: e.target.value})}
                />
                <Button mr={3} onClick={handleCancel}> Cancelar</Button>
                <Button colorScheme='green' onClick={onSubmit}>Guardar Cambios</Button>
            </FormControl>
            </form>
  </>
  )
  }

export default EditFeature