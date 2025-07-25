export interface TranslationMap {
  // Landing page
  welcome: string;
  bartenderLogin: string;
  guestLogin: string;
  createBar: string;
  barName: string;
  bartenderPassword: string;
  guestPassword: string;
  language: string;
  create: string;
  login: string;
  enterPassword: string;
  enterName: string;

  // Bartender interface
  pendingOrders: string;
  noPendingOrders: string;
  markProcessed: string;
  acceptOrder: string;
  rejectOrder: string;
  markReady: string;
  drinkMenu: string;
  addDrink: string;
  editDrink: string;
  deleteDrink: string;
  toggleStock: string;
  inStock: string;
  outOfStock: string;
  analytics: string;
  popularDrinks: string;
  peakHours: string;
  totalOrders: string;
  ordersToday: string;

  // Drink form
  drinkTitle: string;
  drinkImage: string;
  uploadImage: string;
  or: string;
  recipe: string;
  save: string;
  cancel: string;

  // Customer interface
  availableDrinks: string;
  order: string;
  viewRecipe: string;
  yourOrder: string;
  orderStatus: string;
  new: string;
  accepted: string;
  rejected: string;
  ready: string;
  processed: string;
  howToOrder: string;
  howToOrderInstructions: string;
  surpriseMe: string;
  yourRandomDrink: string;
  baseSpirit: string;
  orderThis: string;
  tryAnother: string;
  pastOrders: string; // Added
  reorder: string; // Added
  status: string; // Added

  // Status messages
  oneOrderLimit: string;
  orderPlaced: string;
  loading: string;
  error: string;
  retry: string;
  logout: string;
}

export const translations: { en: TranslationMap; da: TranslationMap } = {
  en: {
    // Landing page
    welcome: "Welcome to",
    bartenderLogin: "Bartender Login",
    guestLogin: "Guest Login",
    createBar: "Create New Bar",
    barName: "Bar Name",
    bartenderPassword: "Bartender Password",
    guestPassword: "Guest Password",
    language: "Language",
    create: "Create",
    login: "Login",
    enterPassword: "Enter Password",
    enterName: "Enter Your Name",

    // Bartender interface
    pendingOrders: "Pending Orders",
    noPendingOrders: "No pending orders",
    markProcessed: "Mark as Processed",
    acceptOrder: "Accept",
    rejectOrder: "Reject",
    markReady: "Mark Ready",
    drinkMenu: "Drink Menu",
    addDrink: "Add Drink",
    editDrink: "Edit Drink",
    deleteDrink: "Delete",
    toggleStock: "Toggle Stock",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    analytics: "Analytics",
    popularDrinks: "Popular Drinks",
    peakHours: "Peak Hours",
    totalOrders: "Total Orders",
    ordersToday: "Orders Today",

    // Drink form
    drinkTitle: "Drink Title",
    drinkImage: "Image URL",
    uploadImage: "Upload Image",
    or: "or",
    recipe: "Recipe (Markdown)",
    save: "Save",
    cancel: "Cancel",

    // Customer interface
    availableDrinks: "Available Drinks",
    order: "Order",
    viewRecipe: "View Recipe",
    yourOrder: "Your Order",
    orderStatus: "Order Status",
    new: "New",
    accepted: "Accepted",
    rejected: "Rejected",
    ready: "Ready",
    processed: "Processed",
    howToOrder: "How to order",
    howToOrderInstructions:
      'Browse the available drinks below and click "Order" to place your order. You can only have one active order at a time. Your order status will update in real-time.',
    surpriseMe: "Surprise Me!",
    yourRandomDrink: "Your Random Drink",
    baseSpirit: "Base Spirit",
    orderThis: "Order this!",
    tryAnother: "Try another",
    pastOrders: "Past Orders", // Added
    reorder: "Reorder", // Added
    status: "Status", // Added

    // Status messages
    oneOrderLimit: "You can only have one active order at a time",
    orderPlaced: "Order placed successfully!",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    logout: "Logout",
  },
  da: {
    // Landing page (Danish)
    welcome: "Velkommen til",
    bartenderLogin: "Bartender Login",
    guestLogin: "Gæst Login",
    createBar: "Opret Ny Bar",
    barName: "Bar Navn",
    bartenderPassword: "Bartender Adgangskode",
    guestPassword: "Gæst Adgangskode",
    language: "Sprog",
    create: "Opret",
    login: "Log ind",
    enterPassword: "Indtast Adgangskode",
    enterName: "Indtast Dit Navn",

    // Bartender interface
    pendingOrders: "Afventende Bestillinger",
    noPendingOrders: "Ingen afventende bestillinger",
    markProcessed: "Markér som Behandlet",
    acceptOrder: "Acceptér",
    rejectOrder: "Afvis",
    markReady: "Markér Klar",
    drinkMenu: "Drink Menu",
    addDrink: "Tilføj Drink",
    editDrink: "Rediger Drink",
    deleteDrink: "Slet",
    toggleStock: "Skift Lager",
    inStock: "På Lager",
    outOfStock: "Ikke på Lager",
    analytics: "Analyser",
    popularDrinks: "Populære Drinks",
    peakHours: "Travle Timer",
    totalOrders: "Samlede Bestillinger",
    ordersToday: "Bestillinger I Dag",

    // Drink form
    drinkTitle: "Drink Titel",
    drinkImage: "Billede URL",
    uploadImage: "Upload Billede",
    or: "eller",
    recipe: "Opskrift (Markdown)",
    save: "Gem",
    cancel: "Annuller",

    // Customer interface
    availableDrinks: "Tilgængelige Drinks",
    order: "Bestil",
    viewRecipe: "Se Opskrift",
    yourOrder: "Din Bestilling",
    orderStatus: "Bestillingsstatus",
    new: "Ny",
    accepted: "Accepteret",
    rejected: "Afvist",
    ready: "Klar",
    processed: "Behandlet",
    howToOrder: "How to order",
    howToOrderInstructions:
      'Browse the available drinks below and click "Order" to place your order. You can only have one active order at a time. Your order status will update in real-time.',
    surpriseMe: "Surprise Me!",
    yourRandomDrink: "Your Random Drink",
    baseSpirit: "Base Spirit",
    orderThis: "Bestil denne!",
    tryAnother: "Prøv en anden",
    pastOrders: "Tidligere bestillinger", // Added
    reorder: "Bestil igen", // Added
    status: "Status", // Added

    // Status messages
    oneOrderLimit: "Du kan kun have én aktiv bestilling ad gangen",
    orderPlaced: "Bestilling afgivet!",
    loading: "Indlæser...",
    error: "Fejl",
    retry: "Prøv igen",
    logout: "Log ud",
  },
};

export type TranslationKeys = keyof typeof translations.en;

export function useTranslation(language: keyof typeof translations) {
  return (key: TranslationKeys) => translations[language][key] || key;
}
