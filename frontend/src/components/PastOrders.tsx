import React from "react";
import { Drink } from "../context/AppContext";
import { TranslationKeys } from "../utils/translations";

interface PastOrdersProps {
  orders: any[];
  drinks: Drink[];
  customerName: string;
  customerOrder: any;
  loading: boolean;
  t: (key: TranslationKeys) => string;
  handlePlaceOrder: (drink: Drink) => void;
}

const PastOrders: React.FC<PastOrdersProps> = ({
  orders,
  drinks,
  customerName,
  customerOrder,
  loading,
  t,
  handlePlaceOrder,
}) => {
  const pastOrders = orders
    .filter(
      (order) =>
        order.customer_name === customerName &&
        !["new", "accepted", "ready"].includes(order.status)
    )
    .sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

  if (pastOrders.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {t("pastOrders")}
      </h2>
      <div className="space-y-2">
        {pastOrders.map((order) => {
          const drink = drinks.find((d) => d.id === order.drink_id);
          return (
            <div
              key={order.id}
              className="flex items-center justify-between bg-white border rounded p-3 shadow-sm"
            >
              <div>
                <div className="font-medium text-blue-700">
                  {drink ? drink.title : order.drink_title}
                </div>
                <div className="text-xs text-gray-500">
                  {t("status")}: {order.status}
                </div>
              </div>
              <button
                onClick={() => drink && handlePlaceOrder(drink)}
                disabled={
                  !!customerOrder || loading || !(drink && drink.in_stock)
                }
                className="px-3 py-1 bg-green-600 text-white rounded font-medium text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("reorder")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastOrders;
