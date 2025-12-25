// Format amount for Paystack (convert to pesewas/kobo)
export function formatAmountForPaystack(amount) {
  return Math.round(amount * 100);
}

// Format amount from Paystack (convert from pesewas/kobo)
export function formatAmountFromPaystack(amount) {
  return amount / 100;
}

// Generate payment reference
export function generatePaymentReference(orderNumber) {
  return `${orderNumber}-${Date.now()}`;
}

// Verify payment signature
export function verifyPaystackSignature(payload, signature) {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest("hex");

  return hash === signature;
}
