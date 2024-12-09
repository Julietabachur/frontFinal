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
  const [reportSalesList, setReportSalesList] = useState([]);

  useEffect(() => {
    getSales();
  }, [salesPage]);
  
  useEffect(() => {
    getAllSales();
  }, []);


  const getAllSales = async ()=>{
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/private/sales`,          
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );     
      if (response.data) {
        console.log('Traigo todas las ventas: ', response.data);    
        setReportSalesList(response.data)  
      }
    } catch (error) {
      console.log("error con getAllSales", error);
    }
  }

  const handleDownloadSalesReportExcel = async () => {
    // let allSales = [];
    // const pageSize = 20; // Tamaño de página estándar
    // let currentPage = 1; // Comenzamos desde la primera página
    // let hasMoreSales = true;

    // while (hasMoreSales) {
    //   try {
    //     const response = await axios.get(`${baseUrl}/api/v1/admin/sales`, {
    //       params: { page: currentPage, size: pageSize },
    //       headers: {
    //         Authorization: `Bearer ${token}`, // Token requerido
    //       },
    //     });

    //     const sales = response.data.data || []; // Si las ventas están en 'data'

    //     if (sales.length === 0) {
    //       hasMoreSales = false; // Si no hay ventas, terminamos
    //     } else {
    //       allSales = [...allSales, ...sales]; // Acumulamos las ventas
    //       currentPage++; // Pasamos a la siguiente página
    //     }
    //   } catch (error) {
    //     console.error("Error al obtener ventas:", error.response ? error.response.data : error);
    //     alert("Error al obtener las ventas.");
    //     hasMoreSales = false; // Detenemos la ejecución si ocurre un error
    //   }
    // }

    // if (allSales.length === 0) {
    //   alert("No se encontraron ventas.");
    //   return;
    // }

    // Generación de la hoja de Excel
    if (reportSalesList.length > 0) {
      
    const worksheet = XLSX.utils.json_to_sheet(
      reportSalesList.map((sale) => ({

        Fecha: new Date(sale.saleDate).toLocaleDateString() || "N/A",
      Productos: sale.productList?.map((producto) => (
        `${producto.productName}, ${producto.size}, ${producto.amount}`
      )).join("; ") || "N/A", // Unir los productos con un separador, por ejemplo, ";"
      Entrega: sale.entrega?.toUpperCase() + (sale.entrega === 'envio' ? `: ${sale.domicilio}` : '') || "N/A",
      "Medio de pago": sale.medioDePago || "N/A",
      "Total de compra": `$${sale.totalPrice || 0}`,      
      }))
    );

    // Configuración de estilos para el encabezado
  const header = worksheet['!rows'] || [];
  const headerRow = ['Fecha', 'Productos', 'Entrega', 'Medio de pago', 'Total de compra'];
  
  // Añadir un estilo básico de encabezado
  worksheet['!cols'] = [
    { width: 20 }, // Ancho para la columna Fecha
    { width: 30 }, // Ancho para la columna Productos
    { width: 25 }, // Ancho para la columna Entrega
    { width: 20 }, // Ancho para la columna Medio de pago
    { width: 15 }, // Ancho para la columna Total de compra
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
      sale.productList?.map((producto) => (
        `${producto.productName} T: ${producto.size} x ${producto.amount} U.`
      )).join("; ") || "N/A", 
      sale.entrega?.toUpperCase() + (sale.entrega === "envio" ? `: ${sale.domicilio}` : "") || "N/A",
      sale.medioDePago || "N/A", 
      `$${sale.totalPrice || 0}` 
    ]);

    // Añadir título
    doc.text("Reporte de Ventas", 14, 15);

    // Generar tabla
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      headStyles: {
        fillColor: '#e1bc6a', // Color de fondo del encabezado (en formato RGB)
        fontStyle: 'bold', // Estilo de fuente del encabezado
        halign: 'center', // Centrar el texto horizontalmente
        valign: 'middle',
        fontSize: 10,
      },
      bodyStyles: {
        lineWidth: 0.1, // Grosor de las líneas que separan las celdas
        lineColor: [0, 0, 0], // Color de las líneas separadoras (en formato RGB, aquí es negro)
        halign: 'center', // Centrar el texto horizontalmente en el cuerpo de la tabla
        valign: 'middle',
        fontSize: 8,
      },
    });

    // Guardar el archivo
    doc.save("reporte_ventas.pdf");
  }
  };

  return (
    <Flex justify="center" >
      <Box mt={10}>
        {/* Botones para descargar reportes */}
        <Flex mb={4}>
          <Button
            onClick={handleDownloadSalesReportExcel}
            isDisabled={reportSalesList.length == 0}
                mr={2}
                border={"1px solid"}      
                borderColor={'color'}    
                color={'color'}               
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
            borderColor={'color'}    
            color={'color'}               
            variant="outline"
            _hover={{
              backgroundColor: "color",
              color: "white",
            }}
          >
            Descargar reporte en PDF
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

            <Box w={1000} mt={3} mb={10}>
                <Table variant="simple" >
                    <Thead backgroundColor="rgba(225, 188, 106, 0.5)">
                        <Tr >
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
                        {salesList.map((sale) => (
                            <Tr key={sale.id} h="30px">
                                <Td textAlign={'center'} fontSize={'12px'} width={'15%'} p={'10px'}>{sale.saleDate}</Td>     
                                <Td textAlign={'center'} fontSize={'12px'} width={'30%'}>
                                    <Box as="ul" listStyleType="circle">
                                    {sale.productList?.map((producto, index) => (
                                        <ul key={index}>
                                        {producto.productName}, {producto.size}, {producto.amount}
                                        </ul>
                                    ))}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} fontSize={'12px'} width={'25%'} >
                                    {sale.entrega?.toUpperCase()}
                                    {sale.entrega === 'envio' && `: ${sale.domicilio}`}
                                </Td>
                                <Td textAlign={'center'} fontSize={'12px'} width={'20%'} >{sale.medioDePago}</Td>
                                <Td textAlign={'center'} fontSize={'12px'} width={'10%'}>${sale.totalPrice}</Td>
                                
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
