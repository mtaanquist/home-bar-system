import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, Coffee, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import { useSessionManager } from "../hooks/useSessionManager";

const CustomerInterface: React.FC = () => {
  const {
    currentBar,
    customerName,
    language,
    loading,
    drinks,
    orders,
    setDrinks,
    setOrders,
    setViewingRecipe,
    setLoading,
    setError,
    apiCall,
  } = useApp();

  const t = useTranslation(language);
  const { clearSession } = useSessionManager();

  // Modal state for order placed
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);

  // Data fetching
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

  useEffect(() => {
    if (currentBar) {
      fetchDrinks();
      fetchOrders();
    }
  }, [currentBar]);

  // Get customer's current order
  const customerOrder = orders.find(
    (order) =>
      order.customer_name === customerName &&
      ["new", "accepted", "ready"].includes(order.status)
  );

  const availableDrinks = drinks.filter((drink) => drink.in_stock);

  const handlePlaceOrder = async (drink: any) => {
    if (customerOrder) {
      alert(t("oneOrderLimit"));
      return;
    }

    setLoading(true);
    try {
      await apiCall("/orders", {
        method: "POST",
        body: JSON.stringify({
          barId: currentBar!.id,
          customerName,
          drinkId: drink.id,
          drinkTitle: drink.title,
        }),
      });

      setShowOrderPlacedModal(true); // Show modal instead of alert
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "ready":
        return <Coffee className="w-5 h-5 text-green-500" />;
      case "processed":
        return <Check className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "accepted":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-800";
      case "ready":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order Placed Modal */}
      {showOrderPlacedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-lg font-bold mb-2">{t("orderPlaced")}</h2>
            <p className="mb-4 text-gray-600">Your order has been placed!</p>
            <button
              onClick={() => setShowOrderPlacedModal(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                🍸 {currentBar?.name}
              </h1>
              <p className="text-sm text-gray-600">Welcome, {customerName}!</p>
            </div>
            <button
              onClick={clearSession}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Current Order Status */}
        {customerOrder && (
          <div
            className={`rounded-lg border-2 p-4 ${getStatusColor(
              customerOrder.status
            )}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(customerOrder.status)}
              <div className="flex-1">
                <h3 className="font-semibold">{t("yourOrder")}</h3>
                <p className="text-sm opacity-90">
                  {customerOrder.drink_title}
                </p>
                <p className="text-xs opacity-75">
                  {t("orderStatus")}: {t(customerOrder.status)}
                </p>
              </div>
              {customerOrder.status === "ready" && (
                <div className="text-right">
                  <div className="text-lg font-bold">🎉</div>
                  <div className="text-xs font-medium">Ready!</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available Drinks */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">
              {t("availableDrinks")}
            </h2>
            <p className="text-sm text-gray-600">
              {availableDrinks.length} drinks available
            </p>
          </div>

          {availableDrinks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No drinks available right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {availableDrinks.map((drink) => (
                <div
                  key={drink.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {drink.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={drink.image_url}
                        alt={drink.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {drink.title}
                    </h3>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => setViewingRecipe(drink)}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                      >
                        {t("viewRecipe")}
                      </button>
                      <button
                        onClick={() => handlePlaceOrder(drink)}
                        disabled={!!customerOrder || loading}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          customerOrder || loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {loading ? t("loading") : t("order")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Text */}
        {!customerOrder && availableDrinks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Coffee className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  How to order
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Browse the available drinks above and click "Order" to place
                    your order. You can only have one active order at a time.
                    Your order status will update in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInterface;
