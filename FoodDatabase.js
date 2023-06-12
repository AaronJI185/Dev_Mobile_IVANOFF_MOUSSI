import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FoodDatabaseScreen = () => (
  <View style={styles.container}>
    <Text>Food database</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FoodDatabaseScreen;
