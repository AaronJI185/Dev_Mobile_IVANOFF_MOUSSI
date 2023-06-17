import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const FoodItem = ({ food, onSelect }) => {
  const handleSelect = () => {
    onSelect(food);
  };

  return (
    <TouchableOpacity style={styles.foodItem} onPress={handleSelect}>
      <Text style={styles.foodName}>{food.label}</Text>
      <Text style={styles.calories}>{food.nutrients.ENERC_KCAL} Calories</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  foodItem: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calories: {
    fontSize: 14,
  },
});

export default FoodItem;
