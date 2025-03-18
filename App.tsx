import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Text, Card, Button, Icon, LinearProgress } from '@rneui/themed';
import { sendSlackNotification } from './src/services/slackService';
import { MealType } from './src/types';

// Icons for each meal type
const MEAL_ICONS = {
  Breakfast: 'coffee',
  Lunch: 'restaurant',
  Supper: 'local-dining',
};

export default function App() {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Breakfast');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Get theme colors
  const getThemeColors = () => {
    return theme === 'light' 
      ? {
          background: '#f8f9fa',
          card: '#ffffff',
          primary: '#6200ee',
          secondary: '#03dac6',
          text: '#212121',
          subtext: '#757575',
          border: '#e0e0e0',
          error: '#b00020',
          success: '#4caf50',
        }
      : {
          background: '#121212',
          card: '#1e1e1e',
          primary: '#bb86fc',
          secondary: '#03dac6',
          text: '#e0e0e0',
          subtext: '#b0b0b0',
          border: '#2c2c2c',
          error: '#cf6679',
          success: '#4caf50',
        };
  };

  const colors = getThemeColors();

  const handleMealSelection = (meal: MealType) => {
    setSelectedMeal(meal);
  };

  const handleNotification = async () => {
    setIsLoading(true);
    
    try {
      // Try up to 2 times if the first attempt fails
      for (let attempt = 0; attempt < 2; attempt++) {
        const success = await sendSlackNotification(selectedMeal);
        
        if (success) {
          Alert.alert('Success', `Notification sent for ${selectedMeal.toLowerCase()}!`);
          return;
        }
        
        // Small delay before retry
        if (attempt === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      Alert.alert('Error', 'Failed to send notification. Please check your internet connection and try again.');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStillCookingNotification = async () => {
    setIsLoading(true);
    
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        const success = await sendSlackNotification(
          "Hey y'all, Ferdinand is still cooking 🤷‍♂️, But the food will be ready soon.",
          'status'  // specify this is a status message, not a meal
        );
        
        if (success) {
          Alert.alert('Success', 'Cooking status notification sent!');
          return;
        }
        
        if (attempt === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      Alert.alert('Error', 'Failed to send notification. Please check your internet connection and try again.');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      
      {/* Theme toggle */}
      <TouchableOpacity 
        style={[styles.themeToggle, { backgroundColor: colors.card }]} 
        onPress={toggleTheme}
      >
        <Icon 
          name={theme === 'light' ? 'moon' : 'sun'} 
          type="feather" 
          color={colors.text} 
          size={20} 
        />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Icon
          name="notifications-active"
          type="material"
          color={colors.primary}
          size={40}
          containerStyle={styles.headerIcon}
        />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Food Notification Bot
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
          Schedule your meal reminders
        </Text>
      </View>

      <Card containerStyle={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Meal</Text>
        
        <View style={styles.mealButtonsContainer}>
          {(['Breakfast', 'Lunch', 'Supper'] as MealType[]).map((meal) => (
            <TouchableOpacity
              key={meal}
              style={[
                styles.mealButton,
                { 
                  backgroundColor: selectedMeal === meal ? colors.primary : colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => handleMealSelection(meal)}
            >
              <Icon
                name={MEAL_ICONS[meal]}
                type="material"
                color={selectedMeal === meal ? '#ffffff' : colors.primary}
                size={24}
                containerStyle={styles.mealIcon}
              />
              <Text style={[
                styles.mealButtonText,
                { color: selectedMeal === meal ? '#ffffff' : colors.text }
              ]}>
                {meal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Send Notification"
            icon={{
              name: "send",
              type: "feather",
              size: 20,
              color: "white"
            }}
            iconRight
            iconContainerStyle={{ marginLeft: 10 }}
            buttonStyle={[styles.sendButton, { backgroundColor: colors.primary }]}
            titleStyle={styles.sendButtonText}
            onPress={handleNotification}
            disabled={isLoading}
            disabledStyle={{ backgroundColor: colors.primary, opacity: 0.7 }}
            containerStyle={{ marginTop: 20 }}
          />
          
          <Button
            title="Still Cooking"
            icon={{
              name: "clock",
              type: "feather",
              size: 20,
              color: "white"
            }}
            iconRight
            iconContainerStyle={{ marginLeft: 10 }}
            buttonStyle={[styles.sendButton, { backgroundColor: colors.secondary }]}
            titleStyle={styles.sendButtonText}
            onPress={handleStillCookingNotification}
            disabled={isLoading}
            disabledStyle={{ backgroundColor: colors.secondary, opacity: 0.7 }}
            containerStyle={{ marginTop: 10 }}
          />
        </View>

        {isLoading && (
          <LinearProgress 
            color={colors.primary} 
            style={styles.progressBar} 
            variant="indeterminate" 
          />
        )}
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  themeToggle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10,
    right: 20,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  headerIcon: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  mealButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  mealIcon: {
    marginBottom: 8,
  },
  mealButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 10,
  },
  sendButton: {
    borderRadius: 12,
    paddingVertical: 15,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    marginTop: 15,
    borderRadius: 5,
    height: 6,
  },
});