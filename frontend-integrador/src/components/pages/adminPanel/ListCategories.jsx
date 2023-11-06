import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Image,
    Text,
    Tr,
    Th,
    Td,
    Flex,
    } from "@chakra-ui/react";
    import CategoryForm from "./CategoryForm";
    import axios from "axios";

       
    const ListCategories = ({token}) => {   

    const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
    const [categoryPage, setCategoryPage] =useState (1);
    const [totalCategoryPages, setTotalCategoryPages] = useState (1);
    const [categoryList, setCategoryList] = useState([]);
    const baseUrl = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        getCategories();
    }, [categoryPage]);

    
    // LOGICA DE getCategories- LISTAR categorias con paginación
    const getCategories = async () => {
        try {
        const response = await axios.get(
            //Petición GET a la api del listado de productos
            `${baseUrl}/api/v1/public/category?page=${categoryPage}`,
            {
            headers: {
                "Content-Type": "application/json",
                },
            }
        );
        if (response.data && response.data.content) {
            // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
            console.log("se cumple");
            setCategoryList(response.data.content);
            setTotalCategoryPages(response.data.last);
            setCategoryPage(response.data.current);
            console.log("Datos recibidos:", response.data);
        }
        } catch (error) {
        console.log(error);
        }
    };

    // Control de Paginación en las categorías
    const handleCategoryPageChange = (newPage) => {
        if (newPage <= totalCategoryPages && newPage >= 1) {
        setCategoryPage(newPage); // Actualiza el número de página
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
                <Button colorScheme="green" 
                    onClick={() =>
                    handleCategoryPageChange(categoryPage > 1 ? categoryPage - 1 : categoryPage)
                    }
                    disabled={categoryPage === 0}
                >
                    &lt;&lt;&lt;
                </Button >
                <Text>- {categoryPage} -</Text>
                <Button colorScheme="green"  onClick={() => handleCategoryPageChange(categoryPage + 1)}>
                    &gt;&gt;&gt;
                </Button>
            </div>
            <Box w={830}>
                <Table variant="striped" colorScheme="green">
                    <Thead>
                        <Tr>
                            <Th>
                                <Text fontWeight="bold">Nombre de la categoría</Text>
                            </Th>
                            <Th>
                                <Text fontWeight="bold">Descripción</Text>
                            </Th>
                            <Th>
                                <Text fontWeight="bold">Imagen</Text>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                    {categoryList &&
                        categoryList.map((category) => (
                        <Tr key={category.id} h="10px">
                            <Td>{category.categoryName}</Td>
                            <Td>{category.description}</Td>
                            <Td>
                                <Image
                                src={category.imageUrl}
                                alt={category.categoryName}
                                w={50}
                                h={50}
                                />
                            </Td>
                        </Tr>
                        ))}
                    </Tbody>
                </Table>
                </Box>
            </Box>
            <Flex
                justifyContent="flex-end"  // Alinea el botón a la derecha
                w={200}  // Ancho igual al ancho de la tabla
                mt={100}   // Espacio arriba del botón
            >
                <Button
                    colorScheme="green"
                    onClick={() => setIsModalCategoriaOpen(true)}
                >
                    Agregar Categoría
                </Button>

                 {/* Componente del modal para agregar categoria */}
                <CategoryForm
                    isModalCategoriaOpen={isModalCategoriaOpen}
                    setIsModalCategoriaOpen={setIsModalCategoriaOpen}
                    token={token}
                    getCategories={getCategories}
                    onClose={() => setIsModalCategoriaOpen(false)}
                />

            </Flex>
        </Flex>
    );
};

export default ListCategories;