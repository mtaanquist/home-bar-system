import React from "react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import PastOrders from "../components/PastOrders";

const PastOrdersPage: React.FC = () => {
  const { orders, drinks, customerName, loading, language } = useApp();
  const t = useTranslation(language);

  // Compute the current active order for this customer
  const customerOrder = orders.find(
    (order) =>
      order.customer_name === customerName &&
      ["new", "accepted", "ready"].includes(order.status)
  );

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
