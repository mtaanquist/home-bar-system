import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import OrdersTab from "./OrdersTab";
import MenuTab from "./MenuTab";
import AnalyticsTab from "./AnalyticsTab";

const BartenderDashboard: React.FC = () => {
  const {
    currentBar,
    currentTab,
    language,
    orders,
    setCurrentTab,
    setCurrentView,
    setUserType,
    setDrinks,
    setOrders,
    setAnalytics,
    setEditingDrink,
    apiCall,
  } = useApp();

  const t = useTranslation(language);

  // Data fetching functions
  const fetchDrinks = async () => {
    if (!currentBar) return;
    try {
      const data = await apiCall(`/drinks/bar/${currentBar.id}`);
      setDrinks(data);
    } catch (err) {
      console.error("Error fetching drinks:", err);
    }
  };

  const fetchOrders = async () => {
    if (!currentBar) return;
    try {
      const data = await apiCall(`/orders/bar/${currentBar.id}`);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchAnalytics = async () => {
    if (!currentBar) return;
    try {
      const data = await apiCall(`/orders/bar/${currentBar.id}/analytics`);
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (currentBar) {
      fetchDrinks();
      fetchOrders();
      fetchAnalytics();
    }
  }, [currentBar]);

  const pendingOrders = orders.filter((order) =>
    ["new", "accepted", "ready"].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                🍸 {currentBar?.name}
              </h1>
              <span className="hidden sm:inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Bartender
              </span>
            </div>
            <button
              onClick={() => {
                setCurrentView("landing");
                setUserType(null);
              }}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setCurrentTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentTab === "orders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("pendingOrders")}
              {pendingOrders.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab("menu")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentTab === "menu"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("drinkMenu")}
            </button>
            <button
              onClick={() => setCurrentTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("analytics")}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === "orders" && <OrdersTab />}
        {currentTab === "menu" && <MenuTab />}
        {currentTab === "analytics" && <AnalyticsTab />}
      </div>

      {/* Floating Action Button for Mobile */}
      {currentTab === "menu" && (
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button
            onClick={() => setEditingDrink({})}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BartenderDashboard;
