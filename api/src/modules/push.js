const webpush = require('web-push');

const email = process.env.EMAIL_ADDRESS;
const publicKey = process.env.VAPID_PUBLIC;
const privateKey = process.env.VAPID_PRIVATE;

// configure VAPID
webpush.setVapidDetails(
  `mailto: ${email}`,
  publicKey,
  privateKey
);

// Function to send a push notification
async function notifyNow(subscription, payload) {
  try {
    const response = await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log('Push notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

async function notifyAt(subscription, payload, date) {
  if(date < Date.now()) return;
  const delay = date - Date.now();
  setTimeout(() => notifyNow(subscription, payload), delay);
}

module.exports = {
  notifyNow, notifyAt
};