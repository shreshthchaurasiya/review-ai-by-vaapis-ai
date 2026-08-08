import crypto from 'crypto';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase Web App for Node.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, businessId, isYearly } = data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !businessId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required parameters' }) };
    }

    // Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid Payment Signature' }) };
    }

    // Sign in using Admin Credentials to get permission to update Firestore
    const adminEmail = process.env.FIREBASE_ADMIN_EMAIL;
    const adminPassword = process.env.FIREBASE_ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    }

    // Update Firestore Document
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      plan: "pro",
      planStartDate: new Date().toISOString(),
      dailyAiCount: 0,
      lastAiGenDate: new Date().toISOString().split('T')[0],
      paymentId: razorpay_payment_id,
      isYearly: !!isYearly
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Payment verified successfully' })
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
