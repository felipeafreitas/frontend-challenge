import { Box } from '@chakra-ui/react';

function Card({ children, disabled }) {
  return (
    <Box
      maxW='sm'
      borderWidth='2px'
      borderRadius='lg'
      overflow='hidden'
      padding='20px'
      borderColor={disabled ? 'gray.100' : 'gray.300'}
    >
      {children}
    </Box>
  );
}

export default Card;
