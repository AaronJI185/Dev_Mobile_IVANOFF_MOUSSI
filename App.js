import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HealthGoalsScreen from './HealthGoals';
import FoodDatabaseScreen from './FoodDatabase';
import MealPlanningScreen from './MealPlanning';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;

      if (route.name === 'Health Goals') {
        iconName = 'ios-heart';
      } else if (route.name === 'Food Database') {
        iconName = 'ios-restaurant';
      } else if (route.name === 'MealPlanningScreen') {
        iconName = 'ios-calendar';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
  })}
>
  <Tab.Screen name="Health Goals" component={HealthGoalsScreen} />
  <Tab.Screen name="Food Database" component={FoodDatabaseScreen} />
  <Tab.Screen name="MealPlanningScreen" component={MealPlanningScreen} />
</Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
