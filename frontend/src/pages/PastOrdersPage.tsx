import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import { ArrowLeft } from "lucide-react";
import PastOrders from "../components/PastOrders";

const PastOrdersPage: React.FC = () => {
  const {
    orders,
    drinks,
    customerName,
    loading,
    language,
    currentBar,
    setViewingRecipe,
    setLoading,
    setError,
    setOrders,
    apiCall,
  } = useApp();
  const t = useTranslation(language);
  const navigate = useNavigate();

  // Compute the current active order for this customer
  const customerOrder = orders.find(
    (order) =>
      order.customer_name === customerName &&
      ["new", "accepted", "ready"].includes(order.status)
  );

  const handleGoBack = () => {
    navigate("/customer");
  };

  const handlePlaceOrder = async (drink: any) => {
    if (customerOrder) {
      alert("You can only have one active order at a time");
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

      // Refresh orders after placing order
      const updatedOrders = await apiCall(`/orders/bar/${currentBar!.id}`);
      setOrders(updatedOrders);

      // Navigate back to customer interface to see the new order
      navigate("/customer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Menu
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  🍸 {currentBar?.name} - {t("pastOrders")}
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {customerName}!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <PastOrders
          orders={orders}
          drinks={drinks}
          customerName={customerName}
          customerOrder={customerOrder}
          loading={loading}
          t={t}
          handlePlaceOrder={handlePlaceOrder}
          setViewingRecipe={setViewingRecipe}
        />
      </div>
    </div>
  );
};

export default PastOrdersPage;
