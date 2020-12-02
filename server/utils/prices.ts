export const taxRate = 0.2

export interface Prices {
  itemsPrice: number
  shippingPrice: number | string
  taxPrice: number | string
  totalPrice: number | string
}
export function calculatePrices(itemsPrice: number): Prices {
  const shippingPrice = Number(itemsPrice > 100 ? 0 : 10).toFixed(2)
  const taxPrice = Number(taxRate * itemsPrice).toFixed(2)
  const totalPrice = Number(Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(
    2
  )
  return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}
