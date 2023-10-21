import React, { useState } from 'react';
import { Button,Box } from '@chakra-ui/react';
import AddProduct from './AddProduct';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box pos={'relative'} top={100}>
      <Button onClick={() => setIsModalOpen(true)}>Agregar Producto</Button>
      <AddProduct isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
     
    </Box>
  );
};

export default AdminDashboard;

