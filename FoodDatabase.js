import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, Pressable, Alert } from 'react-native';
import FoodItem from './FoodItem';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const FoodDatabaseScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foodData, setFoodData] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [mealPlan, setMealPlan] = useState({
    Day: {
      Breakfast: [],
      Lunch: [],
      Snack: [],
      Dinner: []
    }
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [exportDay, setExportDay] = useState('');

  const navigation = useNavigation();

  const handleSearch = async () => {
    if(!searchQuery || searchQuery === ''){
      Alert.alert("Validation Error", "An error has occured. Please restart");
      return;
    }

    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(
          searchQuery
        )}&app_id=c5b5fea6&app_key=f339f9e03a1aefceb4f203719a1e8960`
      );
      const data = await response.json();
      setFoodData(data);
      setSelectedFood(null); // Clear the selected food on new search
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
  };

  const handleAddToMealPlan = () => {
    setModalVisible(true);
  };

  const handleConfirmAdd = () => {
    const newMealItem = {
      food: selectedFood,
      quantity,
      meal: selectedMeal,
    };

    const updatedMealPlan = {
      ...mealPlan,
      Day: {
        ...mealPlan.Day,
        [selectedMeal]: [...mealPlan.Day[selectedMeal], newMealItem]
      }
    };

    setMealPlan(updatedMealPlan);
    setModalVisible(false);
  };

  const handleCancelAdd = () => {
    setModalVisible(false);
  };

  const handleExport = () => {
    setExportDay('');
    Alert.alert('Export Meal Plan', 'Choose a day of the week to export to:', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sunday', onPress: () => handleExportDay('Sunday') },
      { text: 'Monday', onPress: () => handleExportDay('Monday') },
      { text: 'Tuesday', onPress: () => handleExportDay('Tuesday') },
      { text: 'Wednesday', onPress: () => handleExportDay('Wednesday') },
      { text: 'Thursday', onPress: () => handleExportDay('Thursday') },
      { text: 'Friday', onPress: () => handleExportDay('Friday') },
      { text: 'Saturday', onPress: () => handleExportDay('Saturday') },
    ]);
  };

  const handleExportDay = (day) => {
  const exportedMealPlan = {
    Day: { ...mealPlan.Day },
    exportDay: day,
  };

  navigation.navigate('MealPlanningScreen', {
    exportedMealPlan,
  });
};

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a food"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.leftColumn}>
          {selectedFood && (
            <View style={styles.selectedFoodContainer}>
              <Text style={styles.selectedFoodTitle}>Selected Food:</Text>
              <Text style={styles.selectedFoodName}>{selectedFood.label}</Text>
              <Text style={styles.selectedFoodCalories}>
                Calories: {selectedFood.nutrients.ENERC_KCAL}
              </Text>
              <Button title="Add to Meal Plan" onPress={handleAddToMealPlan} />
            </View>
          )}

          <ScrollView style={styles.resultContainer}>
            {foodData && (
              <>
                <Text style={styles.resultTitle}>Search Results:</Text>
                {foodData.hints.length > 0 ? (
                  foodData.hints.map((hint) => (
                    <FoodItem
                      key={hint.food.foodId}
                      food={hint.food}
                      onSelect={handleFoodSelect}
                    />
                  ))
                ) : (
                  <Text>No results found.</Text>
                )}
              </>
            )}
          </ScrollView>
        </View>

        <ScrollView style={styles.mealPlanContainer}>
          <Text style={styles.mealPlanTitle}>Meal Plan</Text>
          {Object.entries(mealPlan.Day).map(([meal, items]) => (
            <View key={meal} style={styles.mealContainer}>
              <Text style={styles.mealTitle}>{meal}</Text>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <View key={index} style={styles.mealItemContainer}>
                    <Text style={styles.mealItemName}>
                      {item.food.label} ({item.quantity}x)
                    </Text>
                    <Text style={styles.mealItemCalories}>
                      Calories: {item.food.nutrients.ENERC_KCAL * item.quantity}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noMealItemsText}>No items added for {meal}.</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.exportButtonContainer}>
        <Button title="Export Meal Plan" onPress={handleExport} />
        {exportDay !== '' && <Text>Exporting to: {exportDay}</Text>}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Meal Plan</Text>
            <View style={styles.modalButtonsContainer}>
              <Button title="Cancel" onPress={handleCancelAdd} />
              <Button title="Add" onPress={handleConfirmAdd} />
            </View>
            <Text style={styles.modalLabel}>Quantity:</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={(text) => setQuantity(parseInt(text))}
            />
            <Text style={styles.modalLabel}>Meal:</Text>
            <Picker
              style={styles.modalPicker}
              selectedValue={selectedMeal}
              onValueChange={(itemValue) => setSelectedMeal(itemValue)}
            >
              <Picker.Item label="Breakfast" value="Breakfast" />
              <Picker.Item label="Lunch" value="Lunch" />
              <Picker.Item label="Snack" value="Snack" />
              <Picker.Item label="Dinner" value="Dinner" />
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
  },
  selectedFoodContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  selectedFoodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedFoodName: {
    fontSize: 14,
    marginBottom: 5,
  },
  selectedFoodCalories: {
    fontSize: 12,
  },
  resultContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealPlanContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginLeft: 10,
  },
  mealPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealContainer: {
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mealItemContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
  mealItemName: {
    fontSize: 12,
    marginBottom: 3,
  },
  mealItemCalories: {
    fontSize: 10,
  },
  noMealItemsText: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  exportButtonContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  modalPicker: {
    marginBottom: 10,
  },
});

export default FoodDatabaseScreen;
