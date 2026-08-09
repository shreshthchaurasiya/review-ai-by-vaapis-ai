import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  try {
    await setDoc(doc(db, 'subscription_plans', 'free'), {
      name: "Free Trial",
      description: "Perfect for trying out ReviewAI.",
      monthlyPrice: 0,
      yearlyPrice: 0,
      isActive: true,
      trialDays: 3,
      features: [
        "3-day trial period",
        "10 AI review drafts per day",
        "Basic review tracking dashboard",
        "Custom QR code generator",
        "Standard Google review linking"
      ]
    });

    await setDoc(doc(db, 'subscription_plans', 'pro'), {
      name: "Pro Merchant",
      description: "For growing businesses needing scale.",
      monthlyPrice: 149,
      yearlyPrice: 1499,
      isActive: true,
      trialDays: 0,
      features: [
        "100 AI review drafts per month",
        "Unlimited trial duration",
        "Advanced analytics dashboard",
        "Priority customer support",
        "Custom branding options"
      ]
    });

    console.log("Successfully seeded plans!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
