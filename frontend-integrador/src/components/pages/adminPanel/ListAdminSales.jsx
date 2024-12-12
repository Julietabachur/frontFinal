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
  FormControl,
  FormLabel,
  Input,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx"; // Para Excel
import jsPDF from "jspdf"; // Para PDF
import "jspdf-autotable"; // Plugin para tablas en jsPDF

const ListAdminSales = ({ token, getSales, salesPage, handlePageChange, salesList }) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [reportSalesList, setReportSalesList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getSales();
  }, [salesPage, reportSalesList]);

  useEffect(() => {
    getAllSales();
  }, []);

  const getAllSales = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/private/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        console.log("Traigo todas las ventas: ", response.data);
        setReportSalesList(response.data);
      }
    } catch (error) {
      console.log("error con getAllSales", error);
    }
  };

  const handleDownloadSalesReportExcel = async () => {
    if (reportSalesList.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(
        reportSalesList.map((sale) => ({
          Fecha: new Date(sale.saleDate).toLocaleDateString() || "N/A",
          Productos: sale.productList
            ?.map((producto) => `${producto.productName}, ${producto.size}, ${producto.amount}`)
            .join("; ") || "N/A",
          Entrega: sale.entrega?.toUpperCase() + (sale.entrega === "envio" ? `: ${sale.domicilio}` : "") || "N/A",
          "Medio de pago": sale.medioDePago || "N/A",
          "Total de compra": $`${sale.totalPrice || 0}`,
        }))
      );

      worksheet["!cols"] = [
        { width: 20 },
        { width: 30 },
        { width: 25 },
        { width: 20 },
        { width: 15 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
      XLSX.writeFile(workbook, "reporte_ventas.xlsx");
    }
  };

  const handleDownloadSalesReportPDF = () => {
    if (reportSalesList.length > 0) {
      const doc = new jsPDF();

      const tableColumn = ["Fecha", "Productos", "Entrega", "Medio de pago", "Total de compra"];
      const tableRows = reportSalesList.map((sale) => [
        new Date(sale.saleDate).toLocaleDateString() || "N/A",
        sale.productList
          ?.map((producto) => `${producto.productName} T: ${producto.size} x ${producto.amount} U.`)
          .join("; ") || "N/A",
        sale.entrega?.toUpperCase() + (sale.entrega === "envio" ? `: ${sale.domicilio}` : "") || "N/A",
        sale.medioDePago || "N/A",
        `$${sale.totalPrice || 0}`,
      ]);

      doc.text("Reporte de Ventas", 14, 15);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
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
          halign: "center",
          valign: "middle",
          fontSize: 8,
        },
      });

      doc.save("reporte_ventas.pdf");
    }
  };

  const handleFilterSales = async () => {
    debugger
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/sales/byDate`, {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        console.log("Ventas filtradas:", response.data);
        setReportSalesList(response.data);
      }
    } catch (error) {
      console.log("Error al filtrar ventas:", error);
    }
  };

  return (
    <Flex justify="center">
      <Box mt={10}>
        <Flex mb={4}>
          <Button
            onClick={handleDownloadSalesReportExcel}
            isDisabled={reportSalesList.length == 0}
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
            isDisabled={reportSalesList.length == 0}
            onClick={handleDownloadSalesReportPDF}
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

        <FormControl as="fieldset" mb={4}>
          <FormLabel as="legend">Filtrar por fecha:</FormLabel>
          <HStack spacing={4}>
            <Box>
              <FormLabel htmlFor="startDate">Desde:</FormLabel>
              <Input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Box>
            <Box>
              <FormLabel htmlFor="endDate">Hasta:</FormLabel>
              <Input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Box>
            <Button colorScheme="blue" onClick={handleFilterSales}>
              Buscar
            </Button>
          </HStack>
        </FormControl>

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

        <Box w={1000} mt={3} mb={10}>
          <Table variant="simple">
            <Thead backgroundColor="rgba(225, 188, 106, 0.5)">
              <Tr>
                <Th>
                  <Text textAlign={"center"} fontWeight="bold">
                    Fecha
                  </Text>
                </Th>
                <Th>
                  <Text textAlign={"center"} fontWeight="bold">
                    Productos
                  </Text>
                </Th>

                <Th>
                  <Text textAlign={"center"} fontWeight="bold">
                    Entrega
                  </Text>
                </Th>

                <Th>
                  <Text textAlign={"center"} fontWeight="bold">
                    Medio de pago
                  </Text>
                </Th>
                <Th>
                  <Text textAlign={"center"} fontWeight="bold">
                    Total de compra
                  </Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {console.log("salesList:", salesList)}
              {reportSalesList.map((sale) => (
                <Tr key={sale.id} h="30px">
                  <Td textAlign={"center"} fontSize={"12px"} width={"15%"} p={"10px"}>
                    {sale.saleDate}
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={"30%"}>
                    <Box as="ul" listStyleType="circle">
                      {sale.productList?.map((producto, index) => (
                        <ul key={index}>
                          {producto.productName}, {producto.size}, {producto.amount}
                        </ul>
                      ))}
                    </Box>
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={"25%"}>
                    {sale.entrega?.toUpperCase()}
                    {sale.entrega === "envio" && `: ${sale.domicilio}`}
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={"20%"}>
                    {sale.medioDePago}
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={"10%"}>
                    ${sale.totalPrice}
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

export default ListAdminSales;