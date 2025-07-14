import React from "react";
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
    setCurrentView,
    currentBar,
  } = useApp();
  const t = useTranslation(language);

  // Compute the current active order for this customer
  const customerOrder = orders.find(
    (order) =>
      order.customer_name === customerName &&
      ["new", "accepted", "ready"].includes(order.status)
  );

  const handleGoBack = () => {
    setCurrentView("customer");
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
          handlePlaceOrder={() => {}}
        />
      </div>
    </div>
  );
};

export default PastOrdersPage;
