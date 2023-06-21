import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

// Separate component for rendering the list of food items for a meal
const MealList = ({ meals }) => {
  return (
    <View style={styles.mealListContainer}>
      {Object.keys(meals).map((meal) => (
        <View key={meal}>
          <Text style={styles.mealText}>{meal}</Text>
          {meals[meal].map((food, index) => (
            <Text key={index} style={styles.foodItem}>{food.name}</Text>
          ))}
        </View>
      ))}
    </View>
  );
};


const MealPlanningScreen = () => {
  const [exportedCalories, setExportedCalories] = useState(0);
  const scrollViewRef = useRef(null);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayPress = (day) => {
    setActiveDay((prevDay) => (prevDay === day ? '' : day)); // Toggle the active day
    setMealPlan((prevMealPlan) => {
      const updatedMealPlan = { ...prevMealPlan };
      if (day in updatedMealPlan) {
        return updatedMealPlan;
      } else {
        updatedMealPlan[day] = {
          Breakfast: [],
          Lunch: [],
          Snack: [],
          Dinner: []
        };
        return updatedMealPlan;
      }
    });
    scrollToDay(day);
  };

  const scrollToDay = (day) => {
    const index = daysOfWeek.findIndex((d) => d === day);
    scrollViewRef.current.scrollTo({ x: 0, y: index * 300, animated: true });
  };

  // Sample meal plan data for each day
  const route = useRoute();
  const { exportedMealPlan, exportDay } = route.params || {};
  const [mealPlan, setMealPlan] = useState(exportedMealPlan || {});
  const [activeDay, setActiveDay] = useState(exportDay || '');

  const calculateMealCalories = (meal) => {
    return meal.reduce((total, food) => total + food.calories, 0);
  };

const calculateDayCalories = (day) => {
  const dayMeals = mealPlan[day] || {};
  const totalCalories = Object.values(dayMeals).reduce((total, meal) => {
    return total + calculateMealCalories(meal);
  }, 0);
  if (exportDay === day) {
    return exportedCalories;
  }
  return totalCalories;
};


  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
      <View style={styles.buttonContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              activeDay === day && styles.activeDayButton,
            ]}
            onPress={() => handleDayPress(day)}
          >
            <Text style={styles.dayButtonText}>{day[0]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {daysOfWeek.map((day) => (
        <View key={day} style={[styles.dayContainer, activeDay === day ? styles.activeDayContainer : null]}>
          <Text style={styles.dayText}>{day}</Text>

          {activeDay === day && mealPlan[day] && (
            <MealList meals={mealPlan[day]} />
          )}

			{activeDay === day && (
				<Text style={styles.totalCaloriesText}>Total Calories: {calculateDayCalories(day)}</Text>
		)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDayButton: {
    backgroundColor: '#5cb6f2',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayContainer: {
    marginBottom: 16,
  },
  activeDayContainer: {
    borderWidth: 2,
    borderColor: '#5cb6f2',
    borderRadius: 8,
    padding: 8,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mealContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  mealText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mealListContainer: {
    marginLeft: 16,
  },
  foodItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalCaloriesText: {
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default MealPlanningScreen;
