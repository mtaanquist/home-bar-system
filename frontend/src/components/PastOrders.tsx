import React from "react";
import { Eye, Package } from "lucide-react";
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
  setViewingRecipe?: (drink: Drink) => void;
}

const PastOrders: React.FC<PastOrdersProps> = ({
  orders,
  drinks,
  customerName,
  customerOrder,
  loading,
  t,
  handlePlaceOrder,
  setViewingRecipe,
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

  if (pastOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 mx-auto mb-3 opacity-50 text-gray-400" />
        <p className="text-gray-500">No past orders found</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t("pastOrders")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pastOrders.map((order) => {
          const drink = drinks.find((d) => d.id === order.drink_id);
          const isInStock = drink && drink.in_stock;
          const canReorder = isInStock && !customerOrder && !loading;

          return (
            <div
              key={order.id}
              className="bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="flex gap-4">
                {/* Drink Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  {drink?.image_url ? (
                    <img
                      src={drink.image_url}
                      alt={drink.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Drink Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-700 text-lg mb-1">
                    {drink ? drink.title : order.drink_title}
                  </h3>

                  {drink?.base_spirit && (
                    <p className="text-sm text-gray-600 mb-2">
                      {drink.base_spirit}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {t("status")}: {order.status}
                    </span>
                    {!isInStock && drink && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {drink && setViewingRecipe && (
                      <button
                        onClick={() => setViewingRecipe(drink)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Recipe
                      </button>
                    )}

                    <button
                      onClick={() => drink && handlePlaceOrder(drink)}
                      disabled={!canReorder}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      title={
                        !drink
                          ? "Drink no longer available"
                          : !isInStock
                          ? "Drink is out of stock"
                          : customerOrder
                          ? "You already have an active order"
                          : "Reorder this drink"
                      }
                    >
                      <Package className="w-4 h-4" />
                      {t("reorder")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastOrders;
