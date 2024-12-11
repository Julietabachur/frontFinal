import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Img, Button, Input, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Text, Flex } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx"; // Para exportar a Excel
import { jsPDF } from "jspdf"; // Para exportar a PDF

const ListAdminProduct = ({
  getProducts,
  page,
  handlePageChange,
  lista,
  token,
  getCategoriesAll,
  categoryListAll,
  featuresListAll,
  getFeaturesAll,
  showAddProduct,
  setShowAddProduct,
  setShowProdList,
}) => {
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [filters, setFilters] = useState({
    productId: "",
    category: "",
    stockDesde: "",
    stockHasta: "",
  });

  const [allProductsLoaded, setAllProductsLoaded] = useState([]);
  const [filteredProductsList, setFilteredProductsList] = useState([]);

  useEffect(() => {
    getProducts();
  }, [page]);

  useEffect(() => {
    getAllProducts();
  }, []);  

  useEffect(() => {
    applyFilters();
  }, [filters, allProductsLoaded]);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/products/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        setAllProductsLoaded(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProductsLoaded];  

    if (filters.productId) {
      filtered = filtered.filter((product) =>
        product.productId.toString().toLowerCase().includes(filters.productId.toLowerCase())
      );
    }
    if (filters.category) {
      filtered = filtered.filter((product) =>
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    if (filters.stockDesde) {
      filtered = filtered.filter((product) => product.stock >= parseInt(filters.stockDesde));
    }

    if (filters.stockHasta) {
      filtered = filtered.filter((product) => product.stock <= parseInt(filters.stockHasta));
    }

    setFilteredProductsList(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      productId: "",
      category: "",
      stockDesde: "",
      stockHasta: "",
    });
  };

  const handleDownloadExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProductsList.map((product) => ({
        ID: product.productId,
        Nombre: product.productName,
        Categoría: product.category,
        Stock: product.stock,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Productos");
    XLSX.writeFile(workbook, "reporte_productos.xlsx");
  };

  const handleDownloadPDFReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Nombre", "Categoría", "Stock"];
    const tableRows = filteredProductsList.map((product) => [
        product.productId || "N/A",
        product.productName || "N/A",
        product.category || "N/A",
        product.stock || 0,
    ]);

    // Título del documento
    doc.text("Reporte de Productos", 14, 15);

    // Generar la tabla con estilos personalizados
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
    doc.save("reporte_productos.pdf");
};


  return (
    <Flex justify="center">
    <Box mt={10} w="100%" maxW="1200px" px={4}>
      <Flex mb={4} justify="flex-start" wrap="wrap" gap={2}>
        <Button
            onClick={handleDownloadExcelReport}
            isDisabled={filteredProductsList.length == 0}
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
            isDisabled={filteredProductsList.length === 0}
            onClick={handleDownloadPDFReport}
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
       {/* Filtrado de productos */}
      <Accordion allowToggle mb={4}>
        <AccordionItem>
          <AccordionButton>
            <Text>Filtros</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Flex direction="column" gap={2}>
              <Input
                placeholder="Buscar por ID"
                name="productId"
                value={filters.productId}
                onChange={handleFilterChange}
              />
              <Input
                placeholder="Categoría"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              />
              <Input
                placeholder="Stock desde"
                name="stockDesde"
                type="number"
                value={filters.stockDesde}
                onChange={handleFilterChange}
              />
              <Input
                placeholder="Stock hasta"
                name="stockHasta"
                type="number"
                value={filters.stockHasta}
                onChange={handleFilterChange}
              />
              <Button onClick={clearFilters}>Limpiar filtros</Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Categoría</Th>
            <Th>Imagen</Th>
            <Th>Stock</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredProductsList.map((item) => (
            <Tr key={item.id}>
              <Td>{item.productId}</Td>
              <Td>{item.productName}</Td>
              <Td>{item.category}</Td>
              <Td>
                <Img src={item.thumbnail} alt={item.productName} w={50} h={50} />
              </Td>
              <Td>{item.stock}</Td>
              <Td>
                <FaEdit style={{ cursor: "pointer", color: "black" }} />
                <FaTrash style={{ cursor: "pointer", color: "red" }} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    </Flex>
  );
};

export default ListAdminProduct;
