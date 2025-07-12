import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';

import HomeScreen from '../pages/home';

const Drawer = createDrawerNavigator();

const NavigationDrawer = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator 
                drawerContent={(props) => <CustomDrawer {...props} />}
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#3b82f6',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    drawerStyle: {
                        backgroundColor: '#f8fafc',
                        width: 240,
                    },
                    drawerActiveTintColor: '#3b82f6',
                    drawerInactiveTintColor: '#64748b',
                }}
            >
                <Drawer.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{
                        drawerLabel: 'Home',
                        title: 'Home',
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default NavigationDrawer;
