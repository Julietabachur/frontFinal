import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box } from '@chakra-ui/react';
import ListAdminProduct from './ListAdminProduct';
import ProductForm from './ProductForm';

const AdminDashboard = ({productToEdit, productData}) => {
  // Estado para controlar si el modal de "Agregar Producto" está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para mostrar el listado de productos cuando se clickea en el botón
  const [showList, setShowList] = useState(false);
  const [listaOn, setListaOn] = useState(false)
 
  // Estado para controlar si se muestra el mensaje de error debido a la resolución de pantalla
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  // Valor mínimo de ancho para considerar como versión de computadora
  const MIN_DESKTOP_WIDTH = 768;


  // Constantes para getPruducts
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJjbGllbnROYW1lIjoiYWRtaW4xIiwic3ViIjoiYWRtaW4xQGFkbWluMS5jb20iLCJpYXQiOjE2OTg1OTY2MjYsImV4cCI6MTY5OTIwMTQyNn0.lEN5fevoixjN4WXzCC3iSn9P4XTkoMfoDmpALGvbEPE"
  const [page, setPage] = useState(1);
  const[totalPages, setTotalPages]= useState(1)
  const pageSize = 10; // cantidad de items en el listado
  const [lista, setLista] = useState([]);

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setShowErrorMessage(true);
      } else {
        setShowErrorMessage(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // La dependencia vacía [] asegura que el efecto solo se ejecute una vez, al montar el componente


  // LOGICA DE getProducts - LISTAR
const getProducts = async () => {
  console.log("Inicia geProducts");
  try {
      const response = await axios.get(  //Petición GET a la api del listado de productos 
        `${baseUrl}/api/v1/public/products?page=${page}&size=${pageSize}`,
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
          });
      if (response.data && response.data.content) {  // Si hay datos en la respuesta, cargar en la lista y consologuear la respuesta
          setLista(response.data.content);
          setTotalPages(response.data.last)
          setPage(response.data.current)
          console.log("Datos recibidos:", response.data);
      }
  } catch (error) { //Manejo de errores
      console.error(error);
  }
};


// Control de Paginación
const handlePageChange = (newPage) => {
  console.log(newPage);
  if(newPage <= totalPages && newPage >= 1){

    console.log(totalPages);
    setPage(newPage); // Actualiza el número de página
  }
};
  
{/*LOGICA DE AGREGAR PRODUCTO - Solo llamado a API y manejo de respuesta.*/}
const addProduct = (productData) => {

  // Realiza la solicitud POST al endpoint para agregar el producto usando Axios
  axios
    .post("http://localhost:8080/api/v1/admin/products", productData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {

      console.log("Producto agregado con éxito:", response.data);
      //setShowList(true);

    })
    .catch((error) => {
      // Maneja el error de la solicitud POST aquí
      console.error("Error al agregar el producto:", error);
      // Muestra un mensaje de error al usuario
    });
};



  // Renderizado del componente
  return (
    <Box pos={'relative'} top={100} w={'99vw'} h={'170vh'}>
       {/* Mostrar el botón "Agregar Producto" solo si la resolución es de computadora */}
       {window.innerWidth >= MIN_DESKTOP_WIDTH && (
        <Button ml={4} onClick={() => setIsModalOpen(true)}>
          Agregar Producto
        </Button>
      )}

      {/* Botón para listar productos (y eliminar y editar) */}
      <Button ml={4} onClick={() => setShowList(true)}>
        Listar Productos
      </Button>

      {/*console.log("HASTA ACA RENDEREA - ShowList", showList)*/}
      {showList == true && <ListAdminProduct getProducts={getProducts} page={page} handlePageChange={handlePageChange} lista={lista}/>}

      {/* Mensaje de error que cubre toda la página si la resolución es menor que la de computadora */}
      {showErrorMessage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            fontSize: '24px',
          }}
        >
          Utilice un dispositivo desktop para acceder a la página de administración.
        </div>
      )}
    </Box>
  );
};

export default AdminDashboard;