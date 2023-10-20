import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import AddProduct from './AddProduct';

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Agregar Producto</Button>
      <AddProduct isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
     
    </>
  );
};

export default AdminDashboard;

