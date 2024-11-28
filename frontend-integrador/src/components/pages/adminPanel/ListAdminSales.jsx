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
} from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx"; // Para Excel
import jsPDF from "jspdf"; // Para PDF
import "jspdf-autotable"; // Plugin para tablas en jsPDF

const ListAdminSales = ({ token, getSales, salesPage, handlePageChange, salesList }) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    getSales();
  }, [salesPage]);

  const handleDownloadSalesReportExcel = async () => {
    let allSales = [];
    const pageSize = 20; // Tamaño de página estándar
    let currentPage = 1; // Comenzamos desde la primera página
    let hasMoreSales = true;

    while (hasMoreSales) {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/sales`, {
          params: { page: currentPage, size: pageSize },
          headers: {
            Authorization: `Bearer ${token}`, // Token requerido
          },
        });

        const sales = response.data.data || []; // Si las ventas están en 'data'

        if (sales.length === 0) {
          hasMoreSales = false; // Si no hay ventas, terminamos
        } else {
          allSales = [...allSales, ...sales]; // Acumulamos las ventas
          currentPage++; // Pasamos a la siguiente página
        }
      } catch (error) {
        console.error("Error al obtener ventas:", error.response ? error.response.data : error);
        alert("Error al obtener las ventas.");
        hasMoreSales = false; // Detenemos la ejecución si ocurre un error
      }
    }

    if (allSales.length === 0) {
      alert("No se encontraron ventas.");
      return;
    }

    // Generación de la hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(
      allSales.map((sale) => ({
        ID: sale.id || "N/A",
        Producto: sale.productName || "N/A",
        Cliente: `${sale.clientName || ""} (${sale.clientEmail || "N/A"})`,
        Cantidad: sale.quantity || 0,
        Total: `$${sale.totalAmount || 0}`,
        Fecha: new Date(sale.date).toLocaleDateString() || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
    XLSX.writeFile(workbook, "reporte_ventas.xlsx");
  };

  const handleDownloadSalesReportPDF = () => {
    const doc = new jsPDF();

    // Configuración de la tabla
    const tableColumn = ["ID", "Producto", "Cliente", "Cantidad", "Total", "Fecha"];
    const tableRows = salesList.map((sale) => [
      sale.id || "N/A",
      sale.productName || "N/A",
      `${sale.clientName || ""} (${sale.clientEmail || "N/A"})`,
      sale.quantity || 0,
      `$${sale.totalAmount || 0}`,
      new Date(sale.date).toLocaleDateString() || "N/A",
    ]);

    // Añadir título
    doc.text("Reporte de Ventas", 14, 15);

    // Generar tabla
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Guardar el archivo
    doc.save("reporte_ventas.pdf");
  };

  return (
    <Flex justify="center">
      <Box mt={10}>
        {/* Botones para descargar reportes */}
        <Flex mb={4}>
          <Button
            border="1px solid #e1bc6a"
            _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
            onClick={handleDownloadSalesReportExcel}
            colorScheme="yellow"
            variant="outline"
            _hover={{ backgroundColor: "#e1bc6a", color: "white" }}
            mr={2}
          >
            Descargar Excel
          </Button>
          <Button
            border="1px solid #e1bc6a"
            _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
            onClick={handleDownloadSalesReportPDF}
            colorScheme="yellow"
            variant="outline"
            _hover={{ backgroundColor: "#e1bc6a", color: "white" }}
          >
            Descargar PDF
          </Button>
        </Flex>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            border="1px solid #e1bc6a"
            _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
            onClick={() => handlePageChange(salesPage > 1 ? salesPage - 1 : salesPage)}
            disabled={salesPage === 1}
          >
            &lt;&lt;
          </Button>
          <Text>- {salesPage} -</Text>
          <Button
            border="1px solid #e1bc6a"
            _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
            onClick={() => handlePageChange(salesPage + 1)}
          >
            &gt;&gt;
          </Button>
        </div>

        <Box w={830} mt={3}>
          <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Producto</Th>
                <Th>Cliente</Th>
                <Th>Cantidad</Th>
                <Th>Total</Th>
                <Th>Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {salesList.map((sale) => (
                <Tr key={sale.id}>
                  <Td>{sale.id}</Td>
                  <Td>{sale.productName || "N/A"}</Td>
                  <Td>{`${sale.clientName || ""} (${sale.clientEmail || "N/A"})`}</Td>
                  <Td>{sale.quantity || 0}</Td>
                  <Td>${sale.totalAmount || 0}</Td>
                  <Td>{new Date(sale.date).toLocaleDateString() || "N/A"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
};

export default ListAdminSales;
