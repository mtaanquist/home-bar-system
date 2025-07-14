import React from "react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import PastOrders from "../components/PastOrders";

const PastOrdersPage: React.FC = () => {
  const {
    orders,
    drinks,
    customerName,
    loading,
    orders: allOrders,
    customerOrder,
    setViewingRecipe,
    apiCall,
  } = useApp();
  const t = useTranslation();

  return (
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
  );
};

export default PastOrdersPage;
