export const SAR_RATE = 3.75;
export const SAR_SYMBOL = "ر.س";

export function usdToSAR(usdPrice: number): string {
    const price = Number(usdPrice || 0) * SAR_RATE;
    return `${price.toLocaleString("en-US")} ${SAR_SYMBOL}`;
}


