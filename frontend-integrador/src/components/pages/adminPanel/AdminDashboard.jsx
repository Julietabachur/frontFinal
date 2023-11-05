import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import ListAdminProduct from "./ListAdminProduct";
import ProductForm from "./ProductForm";
import ListUsers from "./ListUsers";
import AdminFeatures from "./AdminFeatures";
import ListCategories from "./ListCategories"

const AdminDashboard = ({ productToEdit, productData, token }) => {
  // Estado para controlar si el modal de "Agregar Producto" está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para mostrar el listado de productos cuando se clickea en el botón
  const [showList, setShowList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showCategoryList,setShowCategoyList] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // variable para controlar el aviso de exito.
  // Estado para mostrar el panel Administrar caracteristicas
  const [showAdminFeatures, setShowAdminFeatures] = useState(false)
  const [listFeatures, setListFeatures] = useState([])
  const [pageFeatures, setFeaturesPage] = useState(1)
  const [totalFeaturesPages, setTotalFeaturesPages] = useState(1)
  

  // Estado para controlar si se muestra el mensaje de error debido a la resolución de pantalla
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  // Valor mínimo de ancho para considerar como versión de computadora
  const MIN_DESKTOP_WIDTH = 768;

  // Constantes para getPruducts
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // cantidad de items en el listado
  const [lista, setLista] = useState([]); // array de lista de productos
  const [userList, setUserList] = useState([]); // array de lista de usuarios
  const [categoryList, setCategoryList] = useState([]); // array de lista de categorias
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalCategoryPages, setTotalCategoryPages] = useState (1);
  const [userPage, setUserPage] = useState(1);
  const [categoryPage, setCategoryPage] =useState (1);
  

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setShowErrorMessage(true);
      } else {
        setShowErrorMessage(false);
      }
    };
    window.addEventListener("resize", handleResize);
    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // La dependencia vacía [] asegura que el efecto solo se ejecute una vez, al montar el componente

  // LOGICA DE getProducts - LISTAR
  const getProducts = async () => {
    console.log("Inicia getProducts");
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de productos
        `${baseUrl}/api/v1/public/products?page=${page}&size=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.content) {
        // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
        setLista(response.data.content);
        setTotalPages(response.data.last);
        setPage(response.data.current);
        console.log("Datos recibidos:", response.data);
      }
    } catch (error) {
      //Manejo de errores
      console.error(error);
    }
  };
// LOGICA DE getUsers- LISTAR usuarios
  const getUsers = async () => {
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de productos
        `${baseUrl}/api/v1/admin/clients?page=${userPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.content) {
        // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
        setUserList(response.data.content);
        setTotalUserPages(response.data.last);
        setUserPage(response.data.current);
        console.log("Datos recibidos:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Logica de getFeatures. Listado de todas las caracteristicas que estan en la base de datos.
  const getFeatures = async () => {
    console.log("Inicia getFeatures");
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de caracteristicas
        `${baseUrl}/api/v1/public/char?page=${pageFeatures}`,
      );
      if (response.data && response.data.content) {
        // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
        setListFeatures(response.data.content);
        setTotalFeaturesPages(response.data.last);
        setFeaturesPage(response.data.current);
        console.log("Datos recibidos:", response.data);
        console.log("Datos recibidos:", response.data.content);
        console.log(listFeatures)
      }
    } catch (error) {
      //Manejo de errores
      console.error(error);
    }
  };

  // Control de Paginación
  // LOGICA DE getCategories- LISTAR categorias
  const getCategories = async () => {
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de productos
        `${baseUrl}/api/v1/public/category?page=${categoryPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  // Control de Paginación en los productos
  const handlePageChange = (newPage) => {
    console.log(newPage);
    if (newPage <= totalPages && newPage >= 1) {
      console.log(totalPages);
      setPage(newPage); // Actualiza el número de página
    }
  };
// Control de Paginación en los usuarios
  const handleUserPageChange = (newPage) => {
    if (newPage <= totalUserPages && newPage >= 1) {
      setUserPage(newPage); // Actualiza el número de página
    }
  };

  const handleFeaturesPageChange = (newPage) => {
    if (newPage <= totalFeaturesPages && newPage >= 1) {
      setFeaturesPage(newPage); // Actualiza el número de página
    }
  };
  // Control de Paginación en las categrias
  const handleCategoryPageChange = (newPage) => {
    if (newPage <= totalCategoryPages && newPage >= 1) {
      setCategoryPage(newPage); // Actualiza el número de página
    }
  };


  //LOGICA DE AGREGAR PRODUCTO - Solo llamado a API y manejo de respuesta.
  const addProduct = (productData) => {
    console.log("TOKEN ADD PRODUCT", token);
    // Realiza la solicitud POST al endpoint para agregar el producto usando Axios
    axios
      .post("http://localhost:8080/api/v1/admin/products", productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Producto agregado con éxito:", response.data);
        setShowSuccess(true);

        // Oculta el mensaje de éxito después de 1.5 segundos (1500 milisegundos)
        setTimeout(() => {
          setShowSuccess(false);
        }, 1500);
      })
      .catch((error) => {
        // Maneja el error de la solicitud POST aquí - VERIFICAR.
        alert("Error al agregar producto!");
        console.error("Error al agregar el producto:", error);
        // Muestra un mensaje de error al usuario
      });
  };

  const handleShow = (origin) => {
    if (origin === "user") {
      setShowUserList(true);
      setShowList(false);
      setShowAdminFeatures(false)
      setShowCategoyList(false);
    } if(origin === "feature") {
      setShowUserList(false);
      setShowList(false);
      setShowAdminFeatures(true)   
      setShowCategoyList(false);
    } else if (origin === "item") {
      setShowUserList(false);
      setShowCategoyList(false);
      setShowList(true);
      setShowAdminFeatures(false)
    } else if (origin === "category"){
      setShowCategoyList(true);
      setShowUserList(false);
      setShowList(false);
      setShowAdminFeatures(false)
    }
  };

  // Renderizado del componente
  return (
    <Box pos={"relative"} top={100} w={"99vw"} h={"170vh"}>
      {console.log("AlertSuccess:", showSuccess)}

      {showSuccess && (
        <Alert status="success" variant="subtle">
          <AlertIcon boxSize="20px" />
          Producto agregado con éxito!
        </Alert>
      )}

      {/* Mostrar el botón "Agregar Producto" solo si la resolución es de computadora */}
      {window.innerWidth >= MIN_DESKTOP_WIDTH && (
        <Button colorScheme="green" ml={4} onClick={() => setIsModalOpen(true)}>
          Agregar Producto
        </Button>
      )}

      <Button colorScheme="green" ml={4} onClick={() => handleShow("item")}>
        Listar Productos
      </Button>

      <Button colorScheme="green" ml={4} onClick={() => handleShow("user")}>
        Listar Usuarios
      </Button>

      <Button colorScheme="green" ml={4} onClick={() => handleShow("category")}>
        Listar Categorías
      </Button>

      {/* Componente del modal para agregar producto */}

      <Button ml={4} onClick={() => handleShow("feature")}>
        Administrar Caracteristicas
      </Button>
      {/* Componente del modal para agregar producto */}


      <ProductForm
        isOpen={isModalOpen}
        token={token}
        addProduct={addProduct}
        getProducts={getProducts}
        setIsModalOpen={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

       {/* Logicas para mostrar las listas Productos Usuarios Categorias */}
            
      {showList == true && (
        <ListAdminProduct
          token={token}
          getProducts={getProducts}
          page={page}
          handlePageChange={handlePageChange}
          lista={lista}
        />
      )}

      
      {showUserList == true && (
        <ListUsers
          token={token}
          getUsers={getUsers}
          userPage={userPage}
          handlePageChange={handleUserPageChange}
          userList={userList}
        />
      )}

      {showAdminFeatures == true && (
        <AdminFeatures
          token={token}
          getFeatures={getFeatures}       
          listFeatures={listFeatures}
          pageFeatures={pageFeatures}
          handlePageChange={handleFeaturesPageChange}
        />
      )}


      {showCategoryList == true && (
        <ListCategories
          token={token}
          getCategories={getCategories}
          categoryPage={categoryPage}
          handlePageChange={handleCategoryPageChange}
          categoryList={categoryList}
        />
      )}
      
      {/* Mensaje de error que cubre toda la página si la resolución es menor que la de computadora */}
      {showErrorMessage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "24px",
          }}
        >
          Utilice un dispositivo desktop para acceder a la página de
          administración.
        </div>
      )}
    </Box>
  );
};
  

export default AdminDashboard;
