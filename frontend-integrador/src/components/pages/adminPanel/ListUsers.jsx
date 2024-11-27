import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Text,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  HStack,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import * as XLSX from 'xlsx';

const ListUsers = ({
  token,
  getUsers,
  userPage,
  handlePageChange,
  userList,
}) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  
  useEffect(() => {
    getUsers();
  }, [userPage]);

  const handleCheckboxChange = async (user, isChecked) => {
    const confirmationMessage = isChecked
      ? "¿Está seguro de que desea que el usuario sea administrador?"
      : "¿Está seguro de que desea que el usuario deje de ser administrador?";
  
    const isConfirmed = window.confirm(confirmationMessage);
  
    if (isConfirmed) {
      // Clonamos el objeto user
      const updatedUser = { ...user };
  
      // Actualizamos la propiedad roles según el estado del checkbox
      updatedUser.roles = isChecked
        ? [...(updatedUser.roles || []), "ADMIN"]
        : (updatedUser.roles || []).filter((role) => role !== "ADMIN");
  
      try {
        const response = await axios.put(
          `${baseUrl}/api/v1/admin/clients/${updatedUser.id}`,
          updatedUser, // Cambiado para enviar el objeto actualizado
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Usuario actualizado:", response.data);
  
        // Refrescar la lista de usuarios tras una actualización exitosa
        getUsers();
      } catch (error) {
        if (error.response) {
          console.error(`Error ${error.response.status}:`, error.response.data);
        } else {
          console.error("Error desconocido:", error.message);
        }
      }
    }
  };

  const handleDownloadUsersReport = async () => {
    let allUsers = [];  // Almacena todos los usuarios
    const pageSize = 20;  // Tamaño de página, puedes ajustarlo según lo que maneje tu API
    let currentPage = 1;  // Empezamos desde la primera página
    let hasMoreUsers = true;  // Flag para verificar si hay más usuarios
  
    while (hasMoreUsers) {
      try {
        // Realiza la solicitud para la página actual
        const response = await axios.get(`${baseUrl}/api/v1/admin/users`, {
          params: {
            page: currentPage,
            size: pageSize
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
        // Imprimir toda la respuesta para ver su estructura
        console.log("Respuesta completa de usuarios:", response.data);
  
        // Verifica si la respuesta tiene la estructura correcta
        const users = response.data.users || []; // Aseguramos que existe 'users'
  
        // Verifica si la respuesta es vacía
        if (users.length === 0) {
          console.log("No hay usuarios en esta página");
        }
  
        // Añadir los usuarios obtenidos
        allUsers = [...allUsers, ...users];
  
        // Si la respuesta tiene menos usuarios que el tamaño de página, es probable que sea la última página
        if (users.length < pageSize) {
          hasMoreUsers = false;
        } else {
          currentPage++;  // Si hay más usuarios, pasa a la siguiente página
        }
  
      } catch (error) {
        console.error("Error al obtener usuarios", error);
        hasMoreUsers = false;  // Si hay un error, detenemos la paginación
      }
    }
  
    // Imprimir todos los usuarios recolectados
    console.log("Todos los usuarios recolectados:", allUsers);
  
    // Si no hay usuarios, avisa al usuario
    if (allUsers.length === 0) {
      alert("No se encontraron usuarios.");
      return;
    }
  
    // Crea la hoja de trabajo con todos los usuarios
    const worksheet = XLSX.utils.json_to_sheet(allUsers.map(user => ({
      ID: user.userId,
      Nombre: user.name,
      Email: user.email,
      Estado: user.status,
    })));
  
    // Crea un libro de trabajo y agrega la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Usuarios");
  
    // Exporta el archivo Excel
    XLSX.writeFile(workbook, "reporte_usuarios_completo.xlsx");
  };

  return (
    <Flex justify={"center"}>
      <Box mt={10}>
        {/* Botón para descargar el reporte, arriba de la lista */}
        <Button
          border={"1px solid #e1bc6a"}
          _focus={{
            borderColor: "#e1bc6a",
            backgroundColor: "#e1bc6a",
          }}
          onClick={handleDownloadUsersReport}
          colorScheme="yellow"
          variant="outline"
          _hover={{
            backgroundColor: "#e1bc6a",
            color: "white",
          }}
          mb={4} // Añadido margen inferior para separación
        >
          Descargar reporte de usuarios
        </Button>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            border={"1px solid #e1bc6a"}
            _focus={{
              borderColor: "#e1bc6a",
              backgroundColor: "#e1bc6a",
            }}
            onClick={() =>
              handlePageChange(userPage > 1 ? userPage - 1 : userPage)
            }
            disabled={userPage === 0}
          >
            &lt;&lt;
          </Button>
          <Text>- {userPage} -</Text>
          <Button
            border={"1px solid #e1bc6a"}
            _focus={{
              borderColor: "#e1bc6a",
              backgroundColor: "#e1bc6a",
            }}
            onClick={() => handlePageChange(userPage + 1)}
          >
            &gt;&gt;
          </Button>
        </div>
        <Box w={830} mt={3}>
          <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
            <Thead>
              <Tr>
                <Th>
                  <Text fontWeight="bold">Nombre y apellido</Text>
                </Th>
                <Th>
                  <Text fontWeight="bold">Username</Text>
                </Th>
                <Th>
                  <Text fontWeight="bold">Email</Text>
                </Th>
                <Th>
                  <Text fontWeight="bold">Admin</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {userList &&
                userList.map((user) => (
                  <Tr key={user.id} h="10px">
                    <Td>{user.firstName + " " + user.lastName}</Td>
                    <Td>{user.clientName}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Checkbox
                        colorScheme="gray"
                        borderColor="gray.800"
                        borderWidth="2px"
                        isChecked={
                          user.roles &&
                          user.roles.length > 1 &&
                          user.roles[1] === "ADMIN"
                        }
                        onChange={(e) => handleCheckboxChange(user, e.target.checked)}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
};

export default ListUsers;

