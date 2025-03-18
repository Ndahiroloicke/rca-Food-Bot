export default {
  expo: {
    name: "Food Notification",
    slug: "foodbot",
    version: "1.0.0",
    orientation: "portrait",
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.yourschool.foodnotification"
    },
    extra: {
      eas: {
        projectId: "a4c1d360-2d82-4768-8f0a-a053c2187966"
      },
      slackWebhook: process.env.SLACK_WEBHOOK_URL,
    },
    owner: "loic6"
  }
}; 