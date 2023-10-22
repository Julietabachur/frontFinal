import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import AddProduct from './AddProduct';

const AdminDashboard = () => {
  // Estado para controlar si el modal de "Agregar Producto" está abierto o cerrado
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Valor mínimo de ancho para considerar como versión de computadora
  const MIN_DESKTOP_WIDTH = 768;

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= MIN_DESKTOP_WIDTH) {
        setIsModalOpen(true); // Abre el modal de productos si la resolución es suficientemente grande
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
      {/* Componente del modal para agregar producto */}
      <AddProduct isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Mensaje de error que cubre toda la página si la resolución es menor que la de computadora */}
      {window.innerWidth < MIN_DESKTOP_WIDTH && (
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
