import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faCog, faUser, faPiggyBank, faCalendar } from '@fortawesome/free-solid-svg-icons';

const TabsLayout = () => {
    return (


        <Tabs screenOptions={{tabBarActiveTintColor:'#036704'}}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={faHouse} color={color} size={size} />,
                    headerShown: false
                }}
            />

            <Tabs.Screen
                name="budget"
                options={{
                    title: 'Budget',
                    tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={faPiggyBank} color={color} size={size} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
            name="transaction"
            options={{
                title: 'Transactions',
                tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={faCalendar} color={color} size={size} />,
                headerShown: false
            }}
            />

            <Tabs.Screen
                name="account"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={faUser} color={color} size={size} />,
                    headerShown: false
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <FontAwesomeIcon icon={faCog} color={color} size={size} />,
                    headerShown: false
                }}
            />
            

        </Tabs>
    );
};

export default TabsLayout;
