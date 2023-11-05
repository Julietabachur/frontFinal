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
    
    const ListCategories = ({
    getCategories,
    categoryPage,
    handleCategoryPageChange,
    categoryList,
    token,
    }) => {   

    const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);

    useEffect(() => {
        getCategories();
    }, [categoryPage]);

  
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
                <Button colorScheme="green"  onClick={() => handleCategoryPageChange(userPage + 1)}>
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