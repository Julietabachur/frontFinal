import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  Flex,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ListUsers = ({ token, getUsers, userPage, handlePageChange, userList }) => {
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
      const updatedUser = {
        ...user,
        roles: isChecked
          ? [...(user.roles || []), "ADMIN"]
          : (user.roles || []).filter((role) => role !== "ADMIN"),
      };

      try {
        await axios.put(
          `${baseUrl}/api/v1/admin/clients/${updatedUser.id}`,
          updatedUser,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Usuario actualizado correctamente.");
        getUsers();
      } catch (error) {
        alert("Error al actualizar el usuario.");
        console.error("Error:", error);
      }
    }
  };

  // Generación de la hoja de Excel
  const handleDownloadUsersReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      userList.map((user) => ({
        ID: user.id || "N/A",
        Nombre: `${user.firstName || ""} ${user.lastName || ""}`,
        Username: user.clientName || "N/A",
        Email: user.email || "N/A",
        Admin: (user.roles || []).includes("ADMIN") ? "Sí" : "No",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Usuarios");

    XLSX.writeFile(workbook, "reporte_usuarios.xlsx");
  };

  // Generación del PDF
  const handleDownloadUsersPDF = () => {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text("Reporte de Usuarios", 14, 20);

    // Generar tabla con los datos
    const tableColumn = ["ID", "Nombre", "Username", "Email", "Admin"];
    const tableRows = userList.map((user) => [
      user.id || "N/A",
      `${user.firstName || ""} ${user.lastName || ""}`,
      user.clientName || "N/A",
      user.email || "N/A",
      (user.roles || []).includes("ADMIN") ? "Sí" : "No",
    ]);

    // Insertar tabla en el PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Descargar el archivo PDF
    doc.save("reporte_usuarios.pdf");
  };

  return (
    <Flex justify="center">
      <Box mt={10}>
        <Button
          border="1px solid #e1bc6a"
          _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
          onClick={handleDownloadUsersReport}
          colorScheme="yellow"
          variant="outline"
          _hover={{ backgroundColor: "#e1bc6a", color: "white" }}
          mb={4}
        >
          Descargar reporte en Excel
        </Button>
        <Button
          border="1px solid #e1bc6a"
          _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
          onClick={handleDownloadUsersPDF}
          colorScheme="yellow"
          variant="outline"
          _hover={{ backgroundColor: "#e1bc6a", color: "white" }}
          mb={4}
          ml={4}
        >
          Descargar reporte en PDF
        </Button>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            border="1px solid #e1bc6a"
            _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
            onClick={() => handlePageChange(userPage > 1 ? userPage - 1 : userPage)}
            disabled={userPage === 1}
          >
            &lt;&lt;
          </Button>
          <Text>- {userPage} -</Text>
          <Button
            border="1px solid #e1bc6a"
            _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
            onClick={() => handlePageChange(userPage + 1)}
          >
            &gt;&gt;
          </Button>
        </div>

        <Box w={830} mt={3}>
          <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
            <Thead>
              <Tr>
                <Th>Nombre y Apellido</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Admin</Th>
              </Tr>
            </Thead>
            <Tbody>
              {userList.map((user) => (
                <Tr key={user.id}>
                  <Td>{`${user.firstName || ""} ${user.lastName || ""}`}</Td>
                  <Td>{user.clientName || "N/A"}</Td>
                  <Td>{user.email || "N/A"}</Td>
                  <Td>
                    <Checkbox
                      colorScheme="gray"
                      borderColor="gray.800"
                      borderWidth="2px"
                      isChecked={(user.roles || []).includes("ADMIN")}
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
