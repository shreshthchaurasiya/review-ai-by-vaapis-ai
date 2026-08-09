import Razorpay from 'razorpay';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export const handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { isYearly, businessId, couponCode, planId } = data;

    if (!businessId || !planId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Business ID and Plan ID are required' }) };
    }

    // Fetch Plan Details from Firestore
    const planRef = doc(db, 'subscription_plans', planId);
    const planSnap = await getDoc(planRef);
    
    if (!planSnap.exists()) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Plan not found' }) };
    }
    
    const planData = planSnap.data();
    
    // Amount in paise (1 INR = 100 Paise)
    let amount = isYearly ? (planData.yearlyPrice * 100) : (planData.monthlyPrice * 100);

    // Apply Coupon Code Logic
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      const couponRef = doc(db, 'coupons', code);
      const couponSnap = await getDoc(couponRef);
      
      if (couponSnap.exists()) {
        const couponData = couponSnap.data();
        if (couponData.isActive && (couponData.usageLimit === 0 || couponData.usedCount < couponData.usageLimit)) {
          // Apply discount
          amount = Math.max(0, Math.floor(amount * (1 - couponData.discountPercentage / 100)));
        } else {
          return { statusCode: 400, body: JSON.stringify({ error: 'Coupon is invalid, expired, or has reached its usage limit.' }) };
        }
      } else {
        return { statusCode: 404, body: JSON.stringify({ error: 'Coupon not found.' }) };
      }
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${businessId}_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    };
  }
};
