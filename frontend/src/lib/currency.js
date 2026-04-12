/**
 * Pakistani Rupee (PKR) formatter
 * Usage: formatPrice(1299) → "Rs. 1,299"
 */
export function formatPrice(amount) {
  const num = Number(amount);
  if (isNaN(num)) return 'Rs. 0';
  return 'Rs. ' + num.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export const CURRENCY_SYMBOL = 'Rs.';
export const FREE_SHIPPING_THRESHOLD = 5000;   // PKR — free shipping above this
export const SHIPPING_KARACHI = 350;            // PKR
export const SHIPPING_OTHER = 450;             // PKR
export const TAX_RATE = 0.04;                  // 4% on (subtotal + shipping)
