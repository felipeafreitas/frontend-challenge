import { Box, Flex, Grid, Switch, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TabLink from './components/TabLink';
import Card from './components/Card';
import Sidebar from './components/Sidebar';
import Panel from './components/Panel';

function App() {
  const [tabs, setTabs] = useState([]);
  const [tabsData, setTabsData] = useState({});
  const [pluginsEnabled, setPluginsEnabled] = useState(undefined);
  const [plugins, setPlugins] = useState([]);
  const [currentTabPluginsFormatted, setCurrentTabPluginsFormatted] = useState([]);

  useEffect(() => {
    axios
      .get('https://dataguard-db.herokuapp.com/tabs')
      .then(({ data }) => setTabs(data))
      .catch((err) => console.log(err));

    axios
      .get('https://dataguard-db.herokuapp.com/tabdata')
      .then(({ data }) => setTabsData(data))
      .catch((err) => console.log(err));

    axios
      .get('https://dataguard-db.herokuapp.com/plugins')
      .then(({ data }) => setPlugins(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!!Object.keys(tabsData).length) {
      const currentPluginsActivesFormatted = tabsData?.[
        currentTab
      ]?.active?.map((plugin) => ({
        id: plugin,
        status: 'active',
      }));

      const currentPluginsDisabledFormatted = tabsData?.[
        currentTab
      ]?.disabled?.map((plugin) => ({
        id: plugin,
        status: 'disabled',
      }));

      const currentPluginsInactiveFormatted = tabsData?.[
        currentTab
      ]?.inactive?.map((plugin) => ({
        id: plugin.toLowerCase().replace(' ', ''),
        status: 'inactive',
      }));

      const newState = [
        ...currentPluginsActivesFormatted,
        ...currentPluginsDisabledFormatted,
        ...currentPluginsInactiveFormatted,
      ];

      setCurrentTabPluginsFormatted(newState);
    }
  }, [tabsData]);

  const currentTab = window.location.pathname.replace('/', '') || tabs[0];

  const togglePlugin = (event) => {
    const pluginChecked = event.target.checked;
    const pluginSelected = event.target.value;

    if (pluginChecked) {
      const updatedTabsData = { ...tabsData };
      updatedTabsData[currentTab].disabled = updatedTabsData[
        currentTab
      ].disabled.filter((plugin) => plugin !== pluginSelected);
      updatedTabsData[currentTab].active = [
        ...updatedTabsData[currentTab].active,
        pluginSelected,
      ];
      setTabsData(updatedTabsData);

      setCurrentTabPluginsFormatted((prevState) => {
        const changedPlugin = prevState.findIndex(
          (plugin) => plugin.id === pluginSelected
        );
        let newState = [...prevState];
        newState[changedPlugin] = {
          ...newState[changedPlugin],
          status: 'active',
        };
        return newState;
      });

      axios.post(
        `https://dataguard-db.herokuapp.com/tabdata?${currentTab}`,
        updatedTabsData
      );
    } else {
      const updatedTabsData = { ...tabsData };
      updatedTabsData[currentTab].active = updatedTabsData[
        currentTab
      ].active.filter((plugin) => plugin !== pluginSelected);
      updatedTabsData[currentTab].disabled = [
        ...updatedTabsData[currentTab].disabled,
        pluginSelected,
      ];

      setCurrentTabPluginsFormatted((prevState) => {
        const changedPlugin = prevState.findIndex(
          (plugin) => plugin.id === pluginSelected
        );
        let newState = [...prevState];
        newState[changedPlugin] = {
          ...newState[changedPlugin],
          status: 'disabled',
        };
        return newState;
      });

      axios.put(`https://dataguard-db.herokuapp.com/tabdata`, updatedTabsData);
    }
  };

  const handleEnablingPlugins = (value) => {
    const isEnabled = value.target.checked;
    setPluginsEnabled(isEnabled);

    if (isEnabled) {
      setCurrentTabPluginsFormatted((prevState) => {
        const newState = prevState.map((plugin) => {
          if (plugin.status === 'inactive') {
            return plugin;
          }
          return {
            id: plugin.id,
            status: 'active',
          };
        });
        return newState;
      });

      const updatedTabsData = { ...tabsData };

      for (const tab in tabsData) {
        updatedTabsData[tab].active = [
          ...updatedTabsData[tab].active,
          ...updatedTabsData[tab].disabled,
        ];
        updatedTabsData[tab].disabled = [];
      }

      axios.put(`https://dataguard-db.herokuapp.com/tabdata`, updatedTabsData);
    } else {
      setCurrentTabPluginsFormatted((prevState) => {
        const newState = prevState.map((plugin) => {
          if (plugin.status === 'inactive') {
            return plugin;
          }
          return {
            id: plugin.id,
            status: 'disabled',
          };
        });
        return newState;
      });

      const updatedTabsData = { ...tabsData };

      for (const tab in tabsData) {
        updatedTabsData[tab].disabled = [
          ...updatedTabsData[tab].active,
          ...updatedTabsData[tab].disabled,
        ];
        updatedTabsData[tab].active = [];
      }

      axios.put(`https://dataguard-db.herokuapp.com/tabdata`, updatedTabsData);
    }
  };

  return (
    <Grid templateColumns='repeat(20, 1fr)' minH='100vh'>
      <Sidebar
        handleEnablingPlugins={handleEnablingPlugins}
        pluginsEnabled={pluginsEnabled}
      >
        {tabs.map((tab) => (
          <TabLink
            selected={currentTab === tab}
            icon={tabsData[tab]?.icon}
            link={tab}
            key={tab}
          >
            {tabsData[tab]?.title}
          </TabLink>
        ))}
      </Sidebar>
      <Panel>
        {currentTabPluginsFormatted?.map((plugin) => (
          <Card key={plugin.id} disabled={plugin.status === 'inactive'}>
            <Flex justifyContent='space-between'>
              <Text
                fontSize='xl'
                marginBottom='30px'
                color={plugin.status === 'inactive' ? 'gray.200' : 'gray'}
              >
                {plugins?.[plugin.id].title}
              </Text>
              <Box display='flex' flexDirection='column'>
                <Switch
                  size='lg'
                  value={plugin.id}
                  isDisabled={plugin.status === 'inactive'}
                  isChecked={plugin.status === 'active'}
                  onChange={togglePlugin}
                  colorScheme='green'
                />
                {plugin.status === 'active' ? (
                  <Text fontSize='smaller' fontWeight={600} color='green.500'>
                    Allowed
                  </Text>
                ) : (
                  <Text fontSize='smaller' fontWeight={600} color='red.500'>
                    Blocked
                  </Text>
                )}
              </Box>
            </Flex>
            <Text color={plugin.status === 'inactive' ? 'gray.200' : 'gray'}>
              {plugins[plugin.id].description}
            </Text>
          </Card>
        ))}
      </Panel>
    </Grid>
  );
}

export default App;
