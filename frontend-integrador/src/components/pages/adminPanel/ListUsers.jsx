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

  const adminHandle = async (user) => {
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
      getUsers()
    } 
  };

  return (
    <Flex justify={"center"}>
      <Box>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() =>
              handlePageChange(userPage > 1 ? userPage - 1 : userPage)
            }
            disabled={userPage === 0}
          >
            &lt;&lt;&lt;
          </Button>
          <Text>- {userPage} -</Text>
          <Button onClick={() => handlePageChange(userPage + 1)}>
            &gt;&gt;&gt;
          </Button>
        </div>
        <Box w={830}>
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>
                  <Text fontWeight="bold">ID</Text>
                </Th>
                <Th>
                  <Text fontWeight="bold">Nombre de usuario</Text>
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
                    <Td>{user.id}</Td>
                    <Td>{user.clientName}</Td>
                    <Td>
                      <Checkbox
                        isChecked={user.roles[1] === "ADMIN"}
                        onChange={() => adminHandle(user)}
                        onClick={() => adminHandle(user)}
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
