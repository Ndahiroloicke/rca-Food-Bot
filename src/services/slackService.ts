import axios from 'axios';
import { SLACK_CONFIG } from '../config/slack';

type NotificationType = 'meal' | 'status';

export const sendSlackNotification = async (message: string, type: NotificationType = 'meal') => {
  try {
    const finalMessage = type === 'meal' 
      ? `Time for *${message}*` 
      : message;
    
    await axios.post(SLACK_CONFIG.WEBHOOK_URL, {
      text: finalMessage,
      channel: SLACK_CONFIG.CHANNEL,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return false;
  }
}; 