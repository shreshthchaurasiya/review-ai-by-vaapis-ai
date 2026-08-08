import Razorpay from 'razorpay';

export const handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { isYearly, businessId, couponCode } = data;

    if (!businessId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Business ID is required' }) };
    }

    // Amount in paise (1 INR = 100 Paise)
    // Monthly: 149 * 100 = 14900
    // Yearly: 1499 * 100 = 149900
    let amount = isYearly ? 149900 : 14900;

    // Apply Coupon Code Logic
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === "REVIEWAI50") {
        // 50% discount
        amount = Math.floor(amount * 0.5);
      } else if (code === "FREEBIRD") {
        // Flat Rs 100 on monthly, Rs 1000 on yearly (in paise)
        amount = isYearly ? 49900 : 4900; 
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
