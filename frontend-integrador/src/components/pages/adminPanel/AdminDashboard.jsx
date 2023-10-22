import React, { useState, useEffect } from 'react';
import { Button, Box } from '@chakra-ui/react';
import AddProduct from './AddProduct';
import ListAdminProduct from './ListAdminProduct';

const AdminDashboard = () => {
  // Estado para controlar si el modal de "Agregar Producto" está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para mostrar el listado de productos cuando se clickea en el botón
  const [showList, setShowList] = useState(false);

  // Estado para controlar si se muestra el mensaje de error debido a la resolución de pantalla
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Valor mínimo de ancho para considerar como versión de computadora
  const MIN_DESKTOP_WIDTH = 768;

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

  // Renderizado del componente
  return (
    <Box pos={'relative'} top={100}>
      {/* Mostrar el botón "Agregar Producto" solo si la resolución es de computadora */}
      {window.innerWidth >= MIN_DESKTOP_WIDTH && <Button onClick={() => setIsModalOpen(true)}>Agregar Producto</Button>}

      {/* Componente del modal para agregar producto */}
      <AddProduct isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Componente para listar productos (y eliminar y editar)*/}
      <Button onClick={() => setShowList(true)}>Listar Productos</Button>
      {showList && <ListAdminProduct isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}

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
          Por favor, utiliza un dispositivo con una pantalla más grande para acceder a esta funcionalidad.
        </div>
      )}
    </Box>
  );
};

export default AdminDashboard;