import { GridItem, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { Text } from '@chakra-ui/react';

function Panel({ title, children }) {
  return (
    <GridItem colSpan={16} padding='50px'>
      <Text fontSize='xl' marginBottom='20px'>
        {title && `${title} Plugins`}
      </Text>
      <SimpleGrid columns={3} spacing={10}>
        {children}
      </SimpleGrid>
    </GridItem>
  );
}

export default Panel;
