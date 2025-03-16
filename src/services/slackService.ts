import axios from 'axios';
import { SLACK_CONFIG } from '../config/slack';

export const sendSlackNotification = async (mealType: string, time: string) => {
  try {
    const message = `🍽️ *${mealType}* is ready! Students can come to the refectory at *${time}*`;
    
    await axios.post(SLACK_CONFIG.WEBHOOK_URL, {
      text: message,
      channel: SLACK_CONFIG.CHANNEL,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return false;
  }
}; 