import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MealPlanningScreen = () => (
  <View style={styles.container}>
    <Text>Meal planning</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MealPlanningScreen;
