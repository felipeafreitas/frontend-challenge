import { Box, GridItem, Spacer, Switch } from '@chakra-ui/react';
import Logo from '../Logo';

function Sidebar({ children, handleEnablingPlugins, pluginsEnabled }) {
  return (
    <GridItem
      colSpan={4}
      bg='#f1f1f1'
      minWidth={250}
      display='flex'
      flexDirection='column'
    >
      <Box padding='50px'>
        <Logo />
      </Box>
      {children}
      <Spacer />
      <Box
        padding='50px'
        height='100px'
        display='flex'
        gap='20px'
        alignItems='center'
        justifyContent='center'
      >
        <span>All plugins enabled</span>
        <Switch
          size='lg'
          colorScheme='green'
          onChange={handleEnablingPlugins}
          isChecked={pluginsEnabled}
        />
      </Box>
    </GridItem>
  );
}

export default Sidebar;
