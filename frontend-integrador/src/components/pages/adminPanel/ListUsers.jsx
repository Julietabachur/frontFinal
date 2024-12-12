import { useState, useEffect, useMemo } from "react";
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
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ListUsers = ({ token, getUsers, userPage, handlePageChange, userList }) => {
  const [filterTermName, setFilterTermName] = useState(""); // Filtro por nombre
  const [filterTermUsername, setFilterTermUsername] = useState(""); // Filtro por username
  const [filterTermEmail, setFilterTermEmail] = useState(""); // Filtro por email
  const [filterAdmin, setFilterAdmin] = useState(false);
  const [reportUsersList, setReportUsersList] = useState(false);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    getUsers();
  }, [userPage]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/private/clients/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        console.log('Traigo todos los usuarios: ', response.data);
        setReportUsersList(response.data)
      }
    } catch (error) {
      console.log("error con getAllUsers", error);
    }
  };



  // // Filtrar usuarios según los filtros
  // const userList = useMemo(() => {
  //   return userList.filter((user) => {
  //     const fullName = ${user.firstName || ""} ${user.lastName || ""}.toLowerCase();
  //     const username = user.clientName ? user.clientName.toLowerCase() : "";
  //     const email = user.email ? user.email.toLowerCase() : "";
  //     const isAdmin = (user.roles || []).includes("ADMIN");

  //     return (
  //       fullName.includes(filterTermName.toLowerCase()) &&
  //       username.includes(filterTermUsername.toLowerCase()) &&
  //       email.includes(filterTermEmail.toLowerCase()) &&
  //       (filterAdmin ? isAdmin : true)
  //     );
  //   });
  // }, [filterTermName, filterTermUsername, filterTermEmail, filterAdmin, userList]);

  const filteredUserList = useMemo(() => {
    // Comprobar si hay filtros aplicados
    const hasFilters =
      filterTermName.trim() ||
      filterTermUsername.trim() ||
      filterTermEmail.trim() ||
      filterAdmin;

    if (!hasFilters) {
      // Si no hay filtros, devolver la lista original
      return userList;
    }

    // Si hay filtros, aplicar las condiciones
    return userList.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const username = user.clientName ? user.clientName.toLowerCase() : "";
      const email = user.email ? user.email.toLowerCase() : "";
      const isAdmin = (user.roles || []).includes("ADMIN");

      return (
        fullName.includes(filterTermName.toLowerCase()) &&
        username.includes(filterTermUsername.toLowerCase()) &&
        email.includes(filterTermEmail.toLowerCase()) &&
        (filterAdmin ? isAdmin : true)
      );
    });
  }, [filterTermName, filterTermUsername, filterTermEmail, filterAdmin, userList]);

  const filteredReportList = useMemo(() => {
    // Aplica los mismos filtros sobre reportUsersList
    const hasFilters =
      filterTermName.trim() ||
      filterTermUsername.trim() ||
      filterTermEmail.trim() ||
      filterAdmin;

    if (!hasFilters) {
      return reportUsersList;  // Si no hay filtros, devolver la lista original
    }

    return reportUsersList.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const username = user.clientName ? user.clientName.toLowerCase() : "";
      const email = user.email ? user.email.toLowerCase() : "";
      const isAdmin = (user.roles || []).includes("ADMIN");

      return (
        fullName.includes(filterTermName.toLowerCase()) &&
        username.includes(filterTermUsername.toLowerCase()) &&
        email.includes(filterTermEmail.toLowerCase()) &&
        (filterAdmin ? isAdmin : true)
      );
    });
  }, [filterTermName, filterTermUsername, filterTermEmail, filterAdmin, reportUsersList]);

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
    const tabla = filteredReportList.map((user) => ({
        ID: user.id || "N/A",
        Nombre: `${user.firstName || ""} ${user.lastName || ""}`,
        Username: user.clientName || "N/A",
        Email: user.email || "N/A",
        Admin: (user.roles || []).includes("ADMIN") ? "Sí" : "No",
      }))

      const worksheet = XLSX.utils.json_to_sheet(tabla, { origin: "A3" }); // La tabla empieza en la fila 3

      const titulo = [[`Reporte de usuarios: ${filteredReportList.length} resultados`]];
      XLSX.utils.sheet_add_aoa(worksheet, titulo, { origin: "A1" });

      worksheet['!cols'] = [
        { width: 40 }, // Ajusta el ancho de las columnas según sea necesario
        { width: 20 },
        { width: 20 },
        { width: 30 },
        { width: 15 },
      ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Usuarios");

    XLSX.writeFile(workbook, "reporte_usuarios.xlsx");
  };

  // Generación del PDF
  const handleDownloadUsersPDF = () => {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);

    // Generar tabla con los datos
    const tableColumn = ["ID", "Nombre", "Username", "Email", "Admin"];
    const tableRows = filteredReportList.map((user) => [
      user.id || "N/A",
      `${user.firstName || ""} ${user.lastName || ""}`,
      user.clientName || "N/A",
      user.email || "N/A",
      (user.roles || []).includes("ADMIN") ? "Sí" : "No",
    ]);

    doc.text(`Reporte de usuarios: ${filteredReportList.length} resultados`, 14, 15);


    // Insertar tabla en el PDF
    doc.autoTable({
      head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
            fontSize: 8,
            halign: "center",
            valign: "middle",
        },
        headStyles: {
            fillColor: "#e1bc6a",
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
            fontSize: 10,
        },
        bodyStyles: {
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
        },
    });

    // Descargar el archivo PDF
    doc.save("reporte_usuarios.pdf");
  };

  return (
    <Flex justify="center">
      <Box mt={10}>
      <Flex mb={4} justify="flex-start" wrap="wrap" gap={2}>
        <Button
          // border="1px solid #e1bc6a"
          // _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
          // onClick={handleDownloadUsersReport}
          // colorScheme="yellow"
          // variant="outline"
          // _hover={{ backgroundColor: "#e1bc6a", color: "white" }}
          // mb={4}
          // isDisabled={filteredUsersList.length === 0}
          onClick={handleDownloadUsersReport}
          mr={2}
          border={"1px solid"}
          borderColor={"color"}
          color={"color"}
          variant="outline"
          _hover={{
            backgroundColor: "color",
            color: "white",
          }}
        >
          Descargar reporte en Excel
        </Button>
        <Button
          // border="1px solid #e1bc6a"
          // _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
          // onClick={handleDownloadUsersPDF}
          // colorScheme="yellow"
          // variant="outline"
          // _hover={{ backgroundColor: "#e1bc6a", color: "white" }}
          // mb={4}
          // ml={4}
          // isDisabled={filteredProductsList.length === 0}
          onClick={handleDownloadUsersPDF}
          mr={2}
          border={"1px solid"}
          borderColor={"color"}
          color={"color"}
          variant="outline"
          _hover={{
            backgroundColor: "color",
            color: "white",
          }}
        >
          Descargar reporte en PDF
        </Button>
        </Flex>
        {/* Filtros */}
        <Flex mb={4} justify="space-between">
          <Input
            placeholder="Filtrar por nombre..."
            value={filterTermName}
            onChange={(e) => setFilterTermName(e.target.value)}
            mr={2}
            width="22%"
          />
          <Input
            placeholder="Filtrar por username..."
            value={filterTermUsername}
            onChange={(e) => setFilterTermUsername(e.target.value)}
            mr={2}
            width="22%"
          />
          <Input
            placeholder="Filtrar por email..."
            value={filterTermEmail}
            onChange={(e) => setFilterTermEmail(e.target.value)}
            mr={2}
            width="22%"
          />
          <Checkbox
            colorScheme="gray"
            isChecked={filterAdmin}
            onChange={(e) => setFilterAdmin(e.target.checked)}
            mt={2}
          >
            Mostrar solo administradores
          </Checkbox>
        </Flex>

        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
              <Text>Resultados: { filteredReportList.length > 0 ? filteredReportList.length : reportUsersList.length }</Text>
          </Box>
          <Box display={'flex'} >
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
          </Box>

        </Box>

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
              {filteredUserList.map((user) => (
                <Tr key={user.id || user.clientName}>
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