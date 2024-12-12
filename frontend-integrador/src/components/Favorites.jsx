import React from 'react'
import { Box, VStack } from '@chakra-ui/react'
import ShowList from './pages/home/ShowList'

const Favorites = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box w={"99vw"} bg={"blanco"} mt={10}>
      <VStack>
        <ShowList/>
      </VStack>
    </Box>
  )
}

Favorites.propTypes = {}

export default Favorites