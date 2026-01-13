export const currency = {
    AED: { name: "الدرهم الإماراتي", symbol: "د.إ", rate: 3.67 },
    SAR: { name: "الريال السعودي", symbol: "ر.س", rate: 3.75 },
    KWD: { name: "الدينار الكويتي", symbol: "د.ك", rate: 0.31 },
    BHD: { name: "الدينار البحريني", symbol: "ب.د", rate: 0.38 },
    QAR: { name: "الريال القطري", symbol: "ر.ق", rate: 3.64 },
    OMR: { name: "الريال العماني", symbol: "ر.ع", rate: 0.38 },
    EGP: { name: "الجنيه المصري", symbol: "ج.م", rate: 48.5 },
    IQD: { name: "الدينار العراقي", symbol: "ع.د", rate: 1309 },
    SYP: { name: "الليرة السورية", symbol: "ل.س", rate: 14100 },
    LBP: { name: "الليرة اللبنانية", symbol: "ل.ل", rate: 89500 },
    DZD: { name: "الدينار الجزائري", symbol: "د.ج", rate: 134 },
    MAD: { name: "الدرهم المغربي", symbol: "د.م", rate: 9.8 },
    TND: { name: "الدينار التونسي", symbol: "د.ت", rate: 3.1 },
    LYD: { name: "الدينار الليبي", symbol: "ل.د", rate: 4.85 },
    SDG: { name: "الجنيه السوداني", symbol: "ج.س", rate: 600 },
    YER: { name: "الريال اليمني", symbol: "ر.ي", rate: 530 },
    MRU: { name: "الأوقية الموريتانية", symbol: "أ.م", rate: 39 },
    SOS: { name: "الشلن الصومالي", symbol: "ش.ص", rate: 570 },
    KMF: { name: "الفرنك القمري", symbol: "ف.ق", rate: 455 }
} as const;

export function convertPrice(usdPrice: number, currencyCode: keyof typeof currency) {
    const { rate, symbol } = currency[currencyCode];
    const price = usdPrice * rate;
    return `${price.toLocaleString("en-US")} ${symbol}`;
}
