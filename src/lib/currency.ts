const currency_items = [
  { id: "MYR", name: "Ringgit Malaysia" },
  { id: "SGD", name: "Singapore Dollar" },
  { id: "JPY", name: "Japan Yen" },
  { id: "USD", name: "US Dollar" },
];

export const spending_categories = [
  {
    id: "FOOD",
    name: "Food & Beverages",
    icon: "utensils",
    color: "orange",
  },
  {
    id: "ENTERTAINMENT",
    name: "Entertainment",
    icon: "film",
    color: "purple",
  },
  {
    id: "KARAOKE",
    name: "Karaoke",
    icon: "mic-2",
    color: "pink",
  },
  {
    id: "ELECTRIC_BILL",
    name: "Electric Bill",
    icon: "zap",
    color: "yellow",
  },
  {
    id: "PHONE_BILL",
    name: "Phone Bill",
    icon: "smartphone",
    color: "blue",
  },
  {
    id: "WIFI_BILL",
    name: "WiFi / Internet Bill",
    icon: "wifi",
    color: "cyan",
  },
  {
    id: "WATER_BILL",
    name: "Water Bill",
    icon: "droplets",
    color: "sky",
  },
  {
    id: "TRANSPORT",
    name: "Transport",
    icon: "bus",
    color: "indigo",
  },
  {
    id: "FUEL",
    name: "Fuel / Petrol",
    icon: "fuel",
    color: "red",
  },
  {
    id: "TOLL",
    name: "Toll",
    icon: "road",
    color: "amber",
  },
  {
    id: "PARKING",
    name: "Parking",
    icon: "square-parking",
    color: "slate",
  },
  {
    id: "VEHICLE_SERVICE",
    name: "Vehicle Service & Maintenance",
    icon: "wrench",
    color: "gray",
  },
  {
    id: "SHOPPING",
    name: "Shopping",
    icon: "shopping-bag",
    color: "rose",
  },
  {
    id: "GROCERIES",
    name: "Groceries",
    icon: "shopping-cart",
    color: "green",
  },
  {
    id: "HEALTHCARE",
    name: "Healthcare & Medical",
    icon: "heart-pulse",
    color: "red",
  },
  {
    id: "EDUCATION",
    name: "Education",
    icon: "graduation-cap",
    color: "blue",
  },
  {
    id: "SUBSCRIPTION",
    name: "Subscriptions",
    icon: "repeat",
    color: "violet",
  },
  {
    id: "RENT",
    name: "Rent",
    icon: "house",
    color: "stone",
  },
  {
    id: "INSURANCE",
    name: "Insurance",
    icon: "shield-check",
    color: "emerald",
  },
  {
    id: "SAVINGS",
    name: "Savings",
    icon: "piggy-bank",
    color: "lime",
  },
  {
    id: "INVESTMENT",
    name: "Investment",
    icon: "chart-column",
    color: "teal",
  },
  {
    id: "TRAVEL",
    name: "Travel",
    icon: "plane",
    color: "sky",
  },
  {
    id: "GIFTS",
    name: "Gifts & Donations",
    icon: "gift",
    color: "pink",
  },
  {
    id: "PERSONAL_CARE",
    name: "Personal Care",
    icon: "sparkles",
    color: "fuchsia",
  },
  {
    id: "SPORTS",
    name: "Sports & Fitness",
    icon: "dumbbell",
    color: "orange",
  },
  {
    id: "HOME",
    name: "Home & Utilities",
    icon: "sofa",
    color: "zinc",
  },
  {
    id: "WORK",
    name: "Work Expenses",
    icon: "briefcase",
    color: "neutral",
  },
  {
    id: "OTHER",
    name: "Other",
    icon: "ellipsis",
    color: "muted",
  },
];
export const UniversalDataService = {
  // currency
  getCurrency: () => [...currency_items],
  getById: (id: any) => currency_items.find((item) => item.id === id),
  getAllCurrencies: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(currency_items), 500); // 500ms delay
    });
  },

  //   spending categories
  getByIdSpendingCategories: (id: any) =>
    spending_categories.find((item) => item.id === id),
  getAllSpendingCategories: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(spending_categories), 500); // 500ms delay
    });
  },
};
