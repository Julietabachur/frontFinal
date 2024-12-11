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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ListAdminSales = ({
  token,
  getSales,
  salesPage,
  handlePageChange,
  salesList,
}) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [reportSalesList, setReportSalesList] = useState([]);
  const [filters, setFilters] = useState({
    fechaDesde: "",
    fechaHasta: "",
    producto: "",
    entrega: "",
    medioDePago: "",
    totalDesde: "",
    totalHasta: "",
  });

  useEffect(() => {
    // Solo obtener las ventas de la página actual
    getSales();
  }, [salesPage]);

  useEffect(() => {
    // Cargar todas las ventas al principio
    getAllSales();
  }, []);

  const [filteredSalesList, setFilteredSalesList] = useState([]);

  useEffect(() => {
    // Aplicar los filtros cada vez que cambian las ventas o los filtros
    applyFilters();
  }, [filters, reportSalesList]);

  const getAllSales = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/private/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        console.log('Traigo todas las ventas: ', response.data);    
        setReportSalesList(response.data)  
      }
    } catch (error) {
      console.log("error con getAllSales", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      fechaDesde: "",
      fechaHasta: "",
      producto: "",
      entrega: "",
      medioDePago: "",
      totalDesde: "",
      totalHasta: "",
    });
  };

  const applyFilters = () => {
    let filtered = [...reportSalesList];  // Usamos reportSalesList para los filtros

    if (filters.fechaDesde) {
      const fechaDesde = new Date(filters.fechaDesde).setHours(0, 0, 0, 0);
      filtered = filtered.filter((sale) => new Date(sale.saleDate).setHours(0, 0, 0, 0) >= fechaDesde);
    }

    if (filters.fechaHasta) {
      const fechaHasta = new Date(filters.fechaHasta).setHours(23, 59, 59, 999);
      filtered = filtered.filter((sale) => new Date(sale.saleDate).setHours(0, 0, 0, 0) <= fechaHasta);
    }

    if (filters.producto) {
      filtered = filtered.filter((sale) =>
        sale.productList.some((producto) =>
          producto.productName.toLowerCase().includes(filters.producto.toLowerCase())
        )
      );
    }

    if (filters.entrega) {
      filtered = filtered.filter((sale) =>
        sale.entrega.toLowerCase().includes(filters.entrega.toLowerCase())
      );
    }

    if (filters.medioDePago) {
      filtered = filtered.filter((sale) =>
        sale.medioDePago.toLowerCase().includes(filters.medioDePago.toLowerCase())
      );
    }

    if (filters.totalDesde) {
      filtered = filtered.filter((sale) => sale.totalPrice >= parseFloat(filters.totalDesde));
    }

    if (filters.totalHasta) {
      filtered = filtered.filter((sale) => sale.totalPrice <= parseFloat(filters.totalHasta));
    }

    setFilteredSalesList(filtered);
  };

  const handleDownloadSalesReportExcel = async () => {
    const salesToExport = filteredSalesList.length > 0 ? filteredSalesList : reportSalesList; // Usamos filteredSalesList si tiene datos, de lo contrario usamos reportSalesList
    if (salesToExport.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(
        salesToExport.map((sale) => ({
          Fecha: new Date(sale.saleDate).toLocaleDateString() || "N/A",
          Productos:
            sale.productList
              ?.map((producto) =>
                `${producto.productName}, ${producto.size}, ${producto.amount}`
              )
              .join("; ") || "N/A",
          Entrega:
            sale.entrega?.toUpperCase() +
            (sale.entrega === "envio" ? `: ${sale.domicilio}` : "") ||
            "N/A",
          "Medio de pago": sale.medioDePago || "N/A",
          "Total de compra": `$${sale.totalPrice || 0}`,
        }))
      );
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
      XLSX.writeFile(workbook, "reporte_ventas.xlsx");
    } else {
      alert("No se encontraron ventas para exportar.");
    }
  };
  
  const handleDownloadSalesReportPDF = () => {
    const salesToExport = filteredSalesList.length > 0 ? filteredSalesList : reportSalesList; // Usamos filteredSalesList si tiene datos, de lo contrario usamos reportSalesList
    if (salesToExport.length > 0) {
      const doc = new jsPDF();
      const tableColumn = [
        "Fecha",
        "Productos",
        "Entrega",
        "Medio de pago",
        "Total de compra",
      ];
      const tableRows = salesToExport.map((sale) => [
        new Date(sale.saleDate).toLocaleDateString() || "N/A",
        sale.productList
          ?.map((producto) => `${producto.productName} T: ${producto.size} x ${producto.amount} U.`)
          .join("; ") || "N/A",
        sale.entrega?.toUpperCase() +
          (sale.entrega === "envio" ? `: ${sale.domicilio}` : "") ||
          "N/A",
        sale.medioDePago || "N/A",
        `$${sale.totalPrice || 0}`,
      ]);
  
      doc.text("Reporte de Ventas", 14, 15);
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
      doc.save("reporte_ventas.pdf");
    } else {
      alert("No se encontraron ventas para exportar.");
    }
  };
  
  return (
    <Flex justify="center">
      <Box mt={10} w="100%" maxW="1200px" px={4}>
        <Flex mb={4} justify="flex-start" wrap="wrap" gap={2}>
          <Button
            onClick={handleDownloadSalesReportExcel}
            isDisabled={reportSalesList.length === 0}
            mr={2}
            border="1px solid"
            borderColor="yellow.500"
            color="yellow.500"
            variant="outline"
            _hover={{
              backgroundColor: "yellow.500",
              color: "white",
            }}
          >
            Descargar reporte en Excel
          </Button>
          <Button
            isDisabled={reportSalesList.length === 0}
            onClick={handleDownloadSalesReportPDF}
            mr={2}
            border="1px solid"
            borderColor="yellow.500"
            color="yellow.500"
            variant="outline"
            _hover={{
              backgroundColor: "yellow.500",
              color: "white",
            }}
          >
            Descargar reporte en PDF
          </Button>
        </Flex>
        {/* Filtrado de ventas */}
        <Accordion allowToggle mb={4}>
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Filtros
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Flex direction="column">
                <Input
                  placeholder="Buscar por producto"
                  value={filters.producto}
                  onChange={handleFilterChange}
                  name="producto"
                  mb={2}
                />
                <Input
                  placeholder="Fecha desde"
                  type="date"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  name="fechaDesde"
                  mb={2}
                />
                <Input
                  placeholder="Fecha hasta"
                  type="date"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  name="fechaHasta"
                  mb={2}
                />
                <Input
                  placeholder="Medio de pago"
                  value={filters.medioDePago}
                  onChange={handleFilterChange}
                  name="medioDePago"
                  mb={2}
                />
                <Input
                  placeholder="Entrega"
                  value={filters.entrega}
                  onChange={handleFilterChange}
                  name="entrega"
                  mb={2}
                />
                <Input
                  placeholder="Total desde"
                  value={filters.totalDesde}
                  onChange={handleFilterChange}
                  name="totalDesde"
                  mb={2}
                />
                <Input
                  placeholder="Total hasta"
                  value={filters.totalHasta}
                  onChange={handleFilterChange}
                  name="totalHasta"
                  mb={2}
                />
                <Button onClick={clearFilters} variant="ghost">
                  Limpiar filtros
                </Button>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Tabla de ventas filtradas */}
        
        {/* <Box w={1000} mt={3} mb={10}> */}
            <Table variant="simple" >
              <Thead backgroundColor="rgba(225, 188, 106, 0.5)">
              <Tr>
              <Th>
              <Text textAlign={'center'} fontWeight="bold">Fecha</Text>
              </Th>    
              <Th>
              <Text textAlign={'center'} fontWeight="bold">Productos</Text>
              </Th>
              <Th>
              <Text textAlign={'center'} fontWeight="bold">Entrega</Text>
              </Th>
              <Th>
              <Text textAlign={'center'} fontWeight="bold">Medio de pago</Text>
              </Th>
              <Th>
              <Text textAlign={'center'} fontWeight="bold">Total de compra</Text>
              </Th>                        
              </Tr>
          </Thead>
          <Tbody>
            {filteredSalesList.length > 0
              ? filteredSalesList.map((sale) => (
                  <Tr key={sale._id}>
                    <Td>{new Date(sale.saleDate).toLocaleDateString()}</Td>
                    <Td>
                      {sale.productList
                        ?.map((producto) => `${producto.productName} - ${producto.amount}`)
                        .join(", ")}
                    </Td>
                    <Td>{sale.entrega}</Td>
                    <Td>{sale.medioDePago}</Td>
                    <Td>{sale.totalPrice}</Td>
                  </Tr>
                ))
              : salesList?.map((sale) => (
                  <Tr key={sale._id}>
                    <Td>{new Date(sale.saleDate).toLocaleDateString()}</Td>
                    <Td>
                      {sale.productList
                        ?.map((producto) => `${producto.productName} - ${producto.amount}`)
                        .join(", ")}
                    </Td>
                    <Td>{sale.entrega}</Td>
                    <Td>{sale.medioDePago}</Td>
                    <Td>{sale.totalPrice}</Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
        {/* Paginación
        <Flex justify="center" mt={4}>
          <Button
            variant="outline"
            onClick={() => handlePageChange(salesPage - 1)}
            isDisabled={salesPage === 1}
          >
            Anterior
          </Button>
          <Text mx={4}>Página {salesPage}</Text>
          <Button
            variant="outline"
            onClick={() => handlePageChange(salesPage + 1)}
            isDisabled={salesList.length < 5}
          >
            Siguiente
          </Button>
        </Flex> */}
      </Box>
    {/* </Box>  */}
    </Flex>
  );
};

export default ListAdminSales;
