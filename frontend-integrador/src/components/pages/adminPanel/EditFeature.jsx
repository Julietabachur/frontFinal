import { Alert, Button, 
  FormControl, 
  FormLabel, 
  Input, 
} from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';

const EditFeature = ({featureToEdit, token, handleCancel, handleChange}) => {

  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  console.log(featureToEdit)

  const [dataEdit, setDataEdit] = useState (featureToEdit)
  console.log(dataEdit.id)

  const onSubmit = (e) => {
    e.preventDefault();
    handleEditFeature(dataEdit);
    setTimeout(() =>{
      handleChange();
      setShow(false);
      setError(false)
    }, 2000)
  }
  

 const handleEditFeature = () => {
    // Realiza la solicitud PUT al endpoint para actualizar la caracteristica
    axios.put(`http://localhost:8080/api/v1/admin/char/${featureToEdit.id}`, dataEdit, 
      { headers: 
        { Authorization: `Bearer ${token}` } 
      })
      .then((response) => {
        console.log('Caracteristica actualizada con éxito:', response.data);
        // Cierra el modal y resetea el formulario
        setShow(true);
        setError(false);
      })
      .catch((error) => {
        setShow(false)
        setError(true)
        // Maneja el error de la solicitud POST aquí
        console.error('Error al actualizar la caracteristica:', error);
      });
  }

  return (
  <>
  <form>
            
              <FormControl>
                <FormLabel> Nombre de la caracteristica</FormLabel>
                <Input
                  name="charName"
                  mb={3}
                  value={dataEdit.charName}
                  onChange={(e) => setDataEdit({...dataEdit, charName: (e.target.value).toUpperCase()})}
                />
                <FormLabel> Icono representativo </FormLabel>
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
            {show && <Alert style={{color: 'green'}}>Caracteristica agregada con exito</Alert>}
            {error && <Alert style={{color: 'red'}}> Error al agregar la caracteristica, el nombre ya existe. Verifiquelo o elija otro nombre</Alert>}
            </>
    )
  }

export default EditFeature