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
    import EditCategory from "./EditCategory";
    import axios from "axios";
    import { FaEdit, FaTrash } from "react-icons/fa";

    
    const ListCategories = ({token}) => {   

    const [isModalCategoriaOpen, setIsModalCategoriaOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [categoryPage, setCategoryPage] =useState (1);
    const [totalCategoryPages, setTotalCategoryPages] = useState (1);
    const [categoryList, setCategoryList] = useState([]);
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const [selectedCategory, setSelectedCategory] = useState(null);
    

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

   // Función para abrir la ventana de confirmación y borrar la categoría si es aceptada
    const openDeleteDialog = (category) => {
    const isConfirmed = window.confirm("¿Está seguro de que desea eliminar esta categoría?");
    if (isConfirmed) {
        handleDeleteCategory(category.id);
    }
};


      // Eliminar categoría
    const handleDeleteCategory = async (categoryId) => {
        try {
        await axios.delete(`${baseUrl}/api/v1/admin/category/${categoryId}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        getCategories(); // Actualizar la lista de categorías después de eliminar
        } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        }
    };

    // Editar categoría
    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

    
    
    return (
        <Flex justify={"center"}>
        <Box marginTop={20}>
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
            <Box w={830} mt={3}>
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
                            <Th>
                            <Text fontWeight="bold">Acciones</Text>
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
                            <Td>
                            {/* Botones de editar y borrar */}
                            <FaEdit
                                style={{
                                    cursor: "pointer",
                                    color: "green",
                                    fontSize: "1.2em",
                                    marginBottom: "10px"
                                }}
                                onClick={() => handleEditCategory(category)}
                                />
                             <FaTrash
                                style={{
                                    cursor: "pointer",
                                    color: "red",
                                    fontSize: "1.2em",
                                    marginbottom: "10px" // Agregar margen a la izquierda para separar del botón de editar
                                }}
                                onClick={() => openDeleteDialog(category)}
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
                w={250}  // Ancho igual al ancho de la tabla
                mt={150}   // Espacio arriba del botón
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
            {/* Componente del modal para editar categoría */}
                {selectedCategory && (
                <EditCategory
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    categoryToEdit={selectedCategory}
                    getCategories={getCategories}
                    token={token}
                />
                )}
            
        </Flex>
    );
};

export default ListCategories;