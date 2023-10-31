import React, { useState } from 'react'



const ListUsers = ({token}) => {
  const [userList,setUserList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  
  return (
    <>
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          onClick={() => handlePageChange(page > 1 ? page - 1 : page)}
          disabled={page === 0}
        >
          &lt;&lt;&lt;
        </Button>
        <Text>- {page} -</Text>
        <Button onClick={() => handlePageChange(page + 1)}>
          &gt;&gt;&gt;
        </Button>
      </div>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Text fontWeight="bold">ID</Text>
            </Th>
            <Th>
              <Text fontWeight="bold">Nombre de usuario</Text>
            </Th>
            <Th>
              <Text fontWeight="bold">Roles</Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {lista &&
            lista.map((item) => (
              <Tr key={item.id} h="10px">
                <Td>{item.productId}</Td>
                <Td>{item.productName}</Td>
                <Td>
                  <Img
                    src={item.thumbnail}
                    alt={item.productName}
                    w={50}
                    h={50}
                  />
                </Td>
                <Td>
                  <FaEdit
                    style={{
                      cursor: "pointer",
                      color: "green",
                      fontSize: "1.2em",
                    }}
                    onClick={() => handleEdit(item)}
                  />
                </Td>
                <Td>
                  <FaTrash
                    style={{
                      cursor: "pointer",
                      color: "red",
                      fontSize: "1.2em",
                    }}
                    onClick={() => openDeleteDialog(item)}
                  />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
    <AlertDialog
      isOpen={isDeleteDialogOpen}
      leastDestructiveRef={cancelRef}
      onClose={closeDeleteDialog}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmación
          </AlertDialogHeader>
          <AlertDialogBody>
            ¿Seguro que quiere eliminar el item?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeDeleteDialog}>
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                handleDelete(itemToDelete.id);
                closeDeleteDialog();
              }}
              ml={3}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>

    {/* Render condicional, solo se llama a EditProduct si la variable productToEdit es valida */}
    {productToEdit !== null && (
      <EditProduct
        token={token}
        productToEdit={productToEdit}
        isOpen={isModalOpen}
        onClose={() => {
          setProductToEdit(null);
          setIsModalOpen(false);
        }}
        getProducts={getProducts}
      />
    )}
  </>
  )
}

export default ListUsers