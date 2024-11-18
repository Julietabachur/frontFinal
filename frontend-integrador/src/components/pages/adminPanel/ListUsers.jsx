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

  /* const adminHandle = async (user) => {
    const updatedUser = { ...user };
    const response = await axios.put(
      `${baseUrl}/api/v1/admin/clients/${updatedUser.id}`,
      updatedUser,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data) {
      getUsers();
    }
  }; */

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
  
  return (
    <Flex justify={"center"}>
      <Box mt={10}>
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
              backgroungColor: "#e1bc6a",
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
              backgroungColor: "#e1bc6a",
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
                {/*<Th>
                  <Text fontWeight="bold">ID</Text>
                </Th>*/}
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
                    {/*<Td>{user.id}</Td>*/}
                    <Td>{user.firstName + " " + user.lastName}</Td>
                    <Td>{user.clientName}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Checkbox
                        colorScheme="gray"
                        borderColor="gray.800"
                        borderWidth="2px"
                        //isDisabled={user.clientName === "admin1"}
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
