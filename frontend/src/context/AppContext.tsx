import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Bar {
  id: number;
  name: string;
  language: string;
}

export interface Drink {
  id: number;
  bar_id: number;
  title: string;
  image_url?: string;
  recipe: string;
  in_stock: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  bar_id: number;
  customer_name: string;
  drink_id: number;
  drink_title: string;
  status: "new" | "accepted" | "rejected" | "ready" | "processed";
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  totalOrders: number;
  ordersToday: number;
  popularDrinks: Array<{ drink_title: string; order_count: number }>;
  peakHours: Array<{ hour: string; count: number }>;
}

interface AppContextType {
  // App state
  currentView: "landing" | "bartender" | "customer";
  userType: "bartender" | "guest" | null;
  currentBar: Bar | null;
  customerName: string;
  language: "en" | "da";

  // Loading and error states
  loading: boolean;
  error: string | null;

  // Form states
  barForm: {
    name: string;
    bartenderPassword: string;
    guestPassword: string;
    language: "en" | "da";
  };
  loginForm: { password: string; name: string };

  // Data states
  drinks: Drink[];
  orders: Order[];
  analytics: Analytics | null;

  // UI states
  editingDrink: Drink | {} | null;
  viewingRecipe: Drink | null;
  showPassword: boolean;
  currentTab: "orders" | "menu" | "analytics";

  // Setters
  setCurrentView: (view: "landing" | "bartender" | "customer") => void;
  setUserType: (type: "bartender" | "guest" | null) => void;
  setCurrentBar: (bar: Bar | null) => void;
  setCustomerName: (name: string) => void;
  setLanguage: (lang: "en" | "da") => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setBarForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      bartenderPassword: string;
      guestPassword: string;
      language: "en" | "da";
    }>
  >;
  setLoginForm: React.Dispatch<
    React.SetStateAction<{ password: string; name: string }>
  >;
  setDrinks: React.Dispatch<React.SetStateAction<Drink[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setAnalytics: React.Dispatch<React.SetStateAction<Analytics | null>>;
  setEditingDrink: (drink: Drink | {} | null) => void;
  setViewingRecipe: (drink: Drink | null) => void;
  setShowPassword: (show: boolean) => void;
  setCurrentTab: (tab: "orders" | "menu" | "analytics") => void;

  // API helper
  apiCall: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

const API_BASE = "/api";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // App state
  const [currentView, setCurrentView] = useState<
    "landing" | "bartender" | "customer"
  >("landing");
  const [userType, setUserType] = useState<"bartender" | "guest" | null>(null);
  const [currentBar, setCurrentBar] = useState<Bar | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [language, setLanguage] = useState<"en" | "da">("en");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [barForm, setBarForm] = useState({
    name: "",
    bartenderPassword: "",
    guestPassword: "",
    language: "en" as "en" | "da",
  });
  const [loginForm, setLoginForm] = useState({ password: "", name: "" });

  // Data states
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  // UI states
  const [editingDrink, setEditingDrink] = useState<Drink | {} | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Drink | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState<"orders" | "menu" | "analytics">(
    "orders"
  );

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  const value: AppContextType = {
    // App state
    currentView,
    userType,
    currentBar,
    customerName,
    language,

    // Loading and error states
    loading,
    error,

    // Form states
    barForm,
    loginForm,

    // Data states
    drinks,
    orders,
    analytics,

    // UI states
    editingDrink,
    viewingRecipe,
    showPassword,
    currentTab,

    // Setters
    setCurrentView,
    setUserType,
    setCurrentBar,
    setCustomerName,
    setLanguage,
    setLoading,
    setError,
    setBarForm,
    setLoginForm,
    setDrinks,
    setOrders,
    setAnalytics,
    setEditingDrink,
    setViewingRecipe,
    setShowPassword,
    setCurrentTab,

    // API helper
    apiCall,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
