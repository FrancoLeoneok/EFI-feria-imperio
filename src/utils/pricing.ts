export const COMMISSION_PERCENT = 10;

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

// Product prices are always the seller's base price. Apply the commission only
// at customer display boundaries and when freezing an order's price snapshot.
export function customerPrice(basePrice: number): number {
  return roundMoney(basePrice + roundMoney(basePrice * COMMISSION_PERCENT / 100));
}
