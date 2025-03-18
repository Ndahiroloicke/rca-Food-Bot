import Constants from 'expo-constants';

export const SLACK_CONFIG = {
  WEBHOOK_URL: Constants.expoConfig?.extra?.slackWebhook || '',
  CHANNEL: '#discipline_staff-and-students', // Your channel name
}; 