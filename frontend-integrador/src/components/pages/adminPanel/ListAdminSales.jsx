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
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx"; // Para Excel
import jsPDF from "jspdf"; // Para PDF
import "jspdf-autotable"; // Plugin para tablas en jsPDF

const ListAdminSales = ({ token, getSales, salesPage, handlePageChange, salesList, setSalesList, setSalesPage, setTotalSalesPages }) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [reportSalesList, setReportSalesList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    getSales();
  }, [salesPage]);

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
        console.log("Traigo todas las ventas al reporte: ", response.data);
        setReportSalesList(response.data);
      }
    } catch (error) {
      console.log("error todas las ventas al reporte getallsales", error);
    }
  };

  const getAllSalesFiltered = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/sales/byDateWithoutPage`, {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        console.log("Traigo las ventas filtradas sin paginar reporte: ", response.data);
        setReportSalesList(response.data);
      }
    } catch (error) {
      console.log("error con las ventas filtradas sin paginar reporte getAllSalesFiltered", error);
    }
  };

  const getAllSalesFilteredByPage = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/sales/byDate`, {
        params: {
          startDate: "2024-12-01",
          endDate: "2024-12-11",
          page: salesPage
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.content) {
        console.log("Traigo las ventas filtradas paginadas tabla: ", response.data);
        console.log("Traigo las ventas filtradas paginadas tabla: ", response.data);
        console.log("Traigo las ventas filtradas paginadas tabla: ", response.data);
        setSalesList(response.data.content);
        setTotalSalesPages(response.data.last);
        setSalesPage(response.data.current);
      }
    } catch (error) {
      console.log("error con las ventas filtradas paginadas tabla getAllSalesFilteredByPage", error);
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
          "Total de compra": `$${sale.totalPrice || 0}`,
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
    setIsFiltered(true);
    setSalesPage(1)
    getAllSalesFilteredByPage()
    getAllSalesFiltered()
  };

  const handleClearFilter = async () => {
    setIsFiltered(false);
    getSales(); // Recargar las ventas paginadas sin filtro
    await getAllSales(); // Obtener la lista completa sin filtros
  };

  return (
    <Flex justify="center">
      <Box mt={10}>
        <HStack>
          <VStack mb={4} justifyContent={'start'} alignItems={'start'}>
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
          </VStack>
          <FormControl as="fieldset" mb={4}>
            <FormLabel as="legend">Filtrar por fecha:</FormLabel>
            <HStack spacing={4} alignItems={'end'}>
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
              <Button 
                onClick={handleFilterSales}
                isDisabled={!startDate || !endDate}
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
                Buscar
              </Button>
              {isFiltered && (
                <Button 
                  onClick={handleClearFilter}
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
                  Limpiar Filtro
                </Button>
              )}
            </HStack>
          </FormControl>

        </HStack>


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

        <Box  w={{base:'600', md:'900'}} mt={3}>
          <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)" w={{base:'600', md:'900'}} >
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
              {salesList.map((sale) => (
                <Tr key={sale.id} h="30px">
                  <Td textAlign={"center"} fontSize={"12px"} width={{base:"15%", md:'150px'}} p={"10px"}>
                    {sale.saleDate}
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={{base:"25%", md:'250px'}}>
                    <Box as="ul" listStyleType="circle">
                      {sale.productList?.map((producto, index) => (
                        <ul key={index}>
                          {producto.productName}, {producto.size}, {producto.amount}
                        </ul>
                      ))}
                    </Box>
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={{base:"25%", md:'250px'}}>
                    {sale.entrega?.toUpperCase()}
                    {sale.entrega === "envio" && `: ${sale.domicilio}`}
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={{base:"20%", md:'200px'}}>
                    {sale.medioDePago}
                  </Td>
                  <Td textAlign={"center"} fontSize={"12px"} width={{base:"15%", md:'150px'}}>
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