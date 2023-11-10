import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Alert, AlertIcon } from "@chakra-ui/react";
import ListAdminProduct from "./ListAdminProduct";
import ListUsers from "./ListUsers";
import AdminFeatures from "./AdminFeatures";
import ListCategories from "./ListCategories";
import NewProduct from "./NewProduct";

const AdminDashboard = ({ productData, token }) => {
  const [showAddProduct, setShowAddProduct] = useState(false);  // estado para mostrar formulario de producto
  const [prodId, setProdId] = useState(null);
  // Estado para mostrar el listado de productos, categorias, usuarios y caracteristicas cuando se clickea en el botón
  const [showList, setShowList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showCategoryList, setShowCategoyList] = useState(false);
  const [showAdminFeatures, setShowAdminFeatures] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false); // variable para controlar el aviso de exito.

  // Estado para controlar si se muestra el mensaje de error debido a la resolución de pantalla
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  // Valor mínimo de ancho para considerar como versión de computadora
  const MIN_DESKTOP_WIDTH = 768;

  // Constantes para getPruducts, getUsers, getFeatures y getCategories
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const pageSize = 10; // cantidad de items en el listado
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [totalCategoryPages, setTotalCategoryPages] = useState(1);
  const [featurePage, setFeaturePage] = useState(1);
  const [totalFeaturePages, setTotalFeaturesPages] = useState(1);
  const [featuresList, setFeaturesList] = useState([]);
  const [lista, setLista] = useState([]); // array de lista de productos
  const [userList, setUserList] = useState([]); // array de lista de usuarios
  const [categoryListAll, setCategoryListAll] = useState([]); // array de lista de categorias

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

  // LOGICA DE getCategoriesAll- LISTAR todas las categorias sin paginacion para usarlas en el select de productForm y EditProduct
  //no se precisa el token porque es publico
  const getCategoriesAll = async () => {
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de productos
        `${baseUrl}/api/v1/public/category/all`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
        setCategoryListAll(response.data);
        console.log("Datos recibidos:", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        //Petición GET a la api del listado de usuarios
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

  // LOGICA DE getCategories- LISTAR categorias
  const getCategories = async () => {
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de categorias
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

  //LOGICA de getFeatures. Listar Caracteristicas.
  const getFeatures = async () => {
    console.log("Inicia getFeatures");
    try {
      const response = await axios.get(
        //Petición GET a la api del listado de caracteristicas
        `${baseUrl}/api/v1/public/char?page=${featurePage}`
      );
      if (response.data && response.data.content) {
        // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
        setFeaturesList(response.data.content);
        setTotalFeaturesPages(response.data.last);
        setFeaturePage(response.data.current);
        console.log("Datos recibidos:", response.data);
        console.log("Datos recibidos:", response.data.content);
        console.log(featuresList);
      }
    } catch (error) {
      //Manejo de errores
      console.error(error);
    }
  };

  //LOGICA DE AGREGAR PRODUCTO - Solo llamado a API y manejo de respuesta.
  const addProduct = (productData) => {
    //console.log("TOKEN ADD PRODUCT", token);
    // Realiza la solicitud POST al endpoint para agregar el producto usando Axios
    axios
      .post(`${baseUrl}/api/v1/admin/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Producto agregado con éxito:", response.data);
        getProducts();
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

  //para llamar a todas las categorias
  useEffect(() => {
    getCategoriesAll();
  }, []);

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
  // Control de Paginación en las categorias
  const handleCategoryPageChange = (newPage) => {
    if (newPage <= totalCategoryPages && newPage >= 1) {
      setCategoryPage(newPage); // Actualiza el número de página
    }
  };
  // Control de Paginación en las caracteristicas
  const handleFeaturePageChange = (newPage) => {
    if (newPage <= totalFeaturePages && newPage >= 1) {
      setFeaturePage(newPage); // Actualiza el número de página
    }
  };

  const handleShow = (origin) => {
    if (origin === "user") {
      setShowUserList(true);
      setShowList(false);
      setShowAdminFeatures(false);
      setShowCategoyList(false);
      setShowAddProduct(false);
    } else if (origin === "addProd") {
      setShowAddProduct(true);
      setProdId(null);
      setShowUserList(false);
      setShowList(false);
      setShowAdminFeatures(false);
      setShowCategoyList(false);
    } else if (origin === "feature") {
      setShowUserList(false);
      setShowList(false);
      setShowAdminFeatures(true);
      setShowCategoyList(false);
      setShowAddProduct(false);
    } else if (origin === "item") {
      setShowUserList(false);
      setShowCategoyList(false);
      setShowList(true);
      setShowAdminFeatures(false);
      setShowAddProduct(false);
    } else if (origin === "category") {
      setShowCategoyList(true);
      setShowUserList(false);
      setShowList(false);
      setShowAdminFeatures(false);
      setShowAddProduct(false);
    }
  };

  // Renderizado del componente
  return (
    <Box pos={"relative"} top={45} w={"90vw"} minH={470} >
      {console.log("AlertSuccess:", showSuccess)}

      {showSuccess && (
        <Alert status="success" variant="subtle">
          <AlertIcon boxSize="20px" />
          Producto agregado con éxito!
        </Alert>
      )}

      <Box borderBottom="2px" p="10px" bg={"white"}>

        <Button
          colorScheme="green"
          ml={4}
          onClick={() => handleShow("addProd")}
        >
          Agregar Producto
        </Button>

        <Button colorScheme="green" ml={4} onClick={() => handleShow("item")}>
          Listar Productos
        </Button>
        <Button colorScheme="green" ml={4} onClick={() => handleShow("user")}>
          Listar Usuarios
        </Button>
        <Button
          colorScheme="green"
          ml={4}
          onClick={() => handleShow("category")}
        >
          Listar Categorías
        </Button>

        <Button
          colorScheme="green"
          ml={4}
          onClick={() => handleShow("feature")}
        >
          Administrar Características
        </Button>
      </Box>


      {/* Componente del modal para agregar producto */}

      {showAddProduct && (
        <NewProduct
          prodId={prodId}
          token={token}
          setShowAddProduct={setShowAddProduct}
          addProduct={addProduct}
          categoryListAll={categoryListAll}
          getCategoriesAll={getCategoriesAll}
        />
      )}

      {/* Logicas para mostrar las listas Productos Usuarios Categorias Caracteristicas*/}

      {showList == true && (
        <ListAdminProduct
          token={token}
          getProducts={getProducts}
          page={page}
          handlePageChange={handlePageChange}
          lista={lista}
          categoryListAll={categoryListAll}
          getCategoriesAll={getCategoriesAll}
          setShowList={setShowList}
          setShowAddProduct={setShowAddProduct}
          showAddProduct={showAddProduct}
          setProdId={setProdId}
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

      {/* Logicas para mostrar las listas Features  */}

      {showAdminFeatures == true && (
        <AdminFeatures
          token={token}
          getFeatures={getFeatures}
          featurePage={featurePage}
          handlePageChange={handleFeaturePageChange}
          featuresList={featuresList}
        />
      )}

      {/* Logicas para mostrar las listas Categorias */}

      {showCategoryList == true && <ListCategories token={token} />}

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
