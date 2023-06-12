import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthGoalsScreen = () => (
  <View style={styles.container}>
    <Text>Health goals</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HealthGoalsScreen;
