import { Button, FormControl, FormLabel, Input} from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios';

const EditPolicy = ({token, policyToEdit, getPolicyAll, handleCancel, handleChange}) => {
    
    const [dataEdit, setDataEdit] = useState (policyToEdit)

    const onSubmit = (e) => {
        e.preventDefault();
        putPolicy(dataEdit);
        handleChange();
    }
    
    const putPolicy = () => {
        console.log(policyToEdit.id)
        console.log(policyToEdit)
        console.log(dataEdit)
        // Realiza la solicitud PUT al endpoint para actualizar la politica
        axios.put(`http://localhost:8080/api/v1/admin/policy/${policyToEdit.id}`, dataEdit, 
        { headers: 
            { Authorization: `Bearer ${token}` } 
        })
        .then((response) => {
            window.alert("Politica actualizada con exito");
            console.log('Politica actualizada con éxito:', response.data);
            getPolicyAll();
            
        })
        .catch((error) => {
            if (error.response && error.response.status === 400) {
            // Si el error es 400, muestra una alerta con el mensaje de error del servidor
            window.alert(error.response.data.error);
            } else {
            // Para otros errores, muestra un mensaje de error genérico
            console.error("Error al actualizar la politica", error);
            }
        });
    }

    return (
    <>
    <form>
        <FormControl>
            <FormLabel> Nombre de la politica</FormLabel>
            <Input
            name="policyName"
            mb={3}
            value={dataEdit.policyName}
            onChange={(e) => setDataEdit({...dataEdit, policyName: (e.target.value).toUpperCase()})}
            />
            <FormLabel> Descripcion </FormLabel>
            <Input
            name="description"
            mb={3}
            value={dataEdit.description}
            onChange={(e) => setDataEdit({...dataEdit, description: e.target.value})}
            />
            <Button mr={3} onClick={handleCancel}> Cancelar </Button>
            <Button colorScheme='green' onClick={onSubmit}> Guardar Cambios </Button>
        </FormControl>
    </form>
    </>
    )
    }

export default EditPolicy;