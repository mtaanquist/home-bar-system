import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle, Coffee, Check } from "lucide-react";
import { useApp, Drink } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import { useSessionManager } from "../hooks/useSessionManager";
import DrinkCard from "./DrinkCard";
import OrderStatusCard from "./OrderStatusCard";

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
  const navigate = useNavigate();

  // Modal state for order placed
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);
  // Restore state for random drink modal
  const [randomDrink, setRandomDrink] = useState<Drink | null>(null);
  const [showRandomModal, setShowRandomModal] = useState(false);
  
  // Favourites state
  const [favouriteDrinks, setFavouriteDrinks] = useState<Drink[]>([]);

  // Tab state for mobile - no longer needed since we navigate to separate page
  // const [mobileTab, setMobileTab] = useState<"menu" | "history">("menu");

  // Data fetching
  const fetchDrinks = async () => {
    if (!currentBar || !customerName) return;
    try {
      // Use guest endpoint with customer name to get drinks with favourite status
      const data = await apiCall(`/drinks/bar/${currentBar.id}/guest/${encodeURIComponent(customerName)}`);
      setDrinks(data);
    } catch (err) {
      console.error("Error fetching drinks:", err);
    }
  };

  const fetchFavourites = async () => {
    if (!currentBar || !customerName) return;
    try {
      const data = await apiCall(`/drinks/bar/${currentBar.id}/favourites/${encodeURIComponent(customerName)}`);
      setFavouriteDrinks(data);
    } catch (err) {
      console.error("Error fetching favourites:", err);
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
    if (currentBar && customerName) {
      fetchDrinks();
      fetchFavourites();
      fetchOrders();
    }
  }, [currentBar, customerName]);

  // Get customer's current order
  const customerOrder = orders.find(
    (order) =>
      order.customer_name === customerName &&
      ["new", "accepted", "ready"].includes(order.status)
  );

  // Group available drinks by base spirit
  const groupedDrinks: { [spirit: string]: typeof drinks } = {};
  drinks.forEach((drink) => {
    if (drink.in_stock) {
      const spirit = drink.base_spirit || "Other";
      if (!groupedDrinks[spirit]) groupedDrinks[spirit] = [];
      groupedDrinks[spirit].push(drink);
    }
  });
  const baseSpiritOrder = [
    "Vodka",
    "Gin",
    "Rum",
    "Tequila",
    "Whisky/Whiskey",
    "Brandy/Cognac",
    "Liqueur",
    "Non-alcoholic",
    "Other",
  ];
  const spiritsWithDrinks = baseSpiritOrder.filter(
    (spirit) => groupedDrinks[spirit] && groupedDrinks[spirit].length > 0
  );

  const handlePlaceOrder = async (drink: Drink) => {
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
      setShowOrderPlacedModal(true);
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async (drink: Drink) => {
    if (!currentBar || !customerName) return;
    
    try {
      if (drink.is_favourite) {
        // Remove from favourites
        await apiCall(`/drinks/bar/${currentBar.id}/favourites`, {
          method: "DELETE",
          body: JSON.stringify({
            customerName,
            drinkId: drink.id,
          }),
        });
      } else {
        // Add to favourites
        await apiCall(`/drinks/bar/${currentBar.id}/favourites`, {
          method: "POST",
          body: JSON.stringify({
            customerName,
            drinkId: drink.id,
          }),
        });
      }
      
      // Refresh drinks and favourites
      await fetchDrinks();
      await fetchFavourites();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update favourites");
    }
  };

  // Helper to get all in-stock drinks
  const allInStockDrinks = drinks.filter((d) => d.in_stock);

  const handleSurpriseMe = () => {
    if (allInStockDrinks.length === 0) return;
    const idx = Math.floor(Math.random() * allInStockDrinks.length);
    setRandomDrink(allInStockDrinks[idx]);
    setShowRandomModal(true);
  };

  const handleTryAnother = () => {
    if (allInStockDrinks.length === 0) return;
    let next;
    do {
      next =
        allInStockDrinks[Math.floor(Math.random() * allInStockDrinks.length)];
    } while (
      allInStockDrinks.length > 1 &&
      randomDrink &&
      next.id === randomDrink.id
    );
    setRandomDrink(next);
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

  // Escape key closes Surprise Me modal
  useEffect(() => {
    if (!showRandomModal) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowRandomModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showRandomModal]);

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
      {/* Random Drink Modal */}
      {showRandomModal && randomDrink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <div className="mb-4">
              <div className="text-4xl mb-2">🍹</div>
              <h2 className="text-xl font-bold mb-2">{t("yourRandomDrink")}</h2>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {randomDrink.title}
              </h3>
              {randomDrink.image_url && (
                <img
                  src={randomDrink.image_url}
                  alt={randomDrink.title}
                  className="mx-auto mb-2 rounded-lg max-h-40 object-cover"
                />
              )}
              <div className="text-sm text-gray-700 mb-2">
                {randomDrink.base_spirit && (
                  <span className="font-medium">
                    {t("baseSpirit")}: {randomDrink.base_spirit}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowRandomModal(false);
                  handlePlaceOrder(randomDrink);
                }}
                disabled={!!customerOrder || loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("loading") : t("orderThis")}
              </button>
              <button
                onClick={handleTryAnother}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {t("tryAnother")}
              </button>
              <button
                onClick={() => setShowRandomModal(false)}
                className="w-full px-4 py-2 bg-white text-gray-500 rounded-lg font-medium border hover:bg-gray-50 transition-colors"
              >
                {t("cancel")}
              </button>
            </div>
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
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Welcome, {customerName}!
                </p>
                <button
                  onClick={() => navigate("/customer/past-orders")}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  {t("pastOrders")}
                </button>
              </div>
            </div>
            <button
              onClick={clearSession}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium cursor-pointer"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      {/* Main content container with left menu and main area */}
      <div className="max-w-4xl mx-auto px-4 py-6 flex space-x-6">
        {/* Left-hand menu for base spirits (desktop only) */}
        <nav className="hidden md:block w-48 sticky top-24 self-start">
          <ul className="space-y-2">
            <li>
              <button
                onClick={handleSurpriseMe}
                disabled={
                  allInStockDrinks.length === 0 || !!customerOrder || loading
                }
                className="w-full flex items-center justify-center px-3 py-2 mb-2 bg-pink-600 text-white rounded font-bold text-base shadow hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                🎲 {t("surpriseMe")}
              </button>
            </li>
            {favouriteDrinks.length > 0 && (
              <li>
                <a
                  href="#favourites"
                  className="block px-3 py-2 rounded hover:bg-yellow-100 text-yellow-700 font-medium"
                >
                  ⭐ {t("favourites")} ({favouriteDrinks.length})
                </a>
              </li>
            )}
            {spiritsWithDrinks.map((spirit) => (
              <li key={spirit}>
                <a
                  href={`#spirit-${spirit.replace(/[^a-zA-Z0-9]/g, "")}`}
                  className="block px-3 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium"
                >
                  {spirit}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main drink/order content */}
        <div className="flex-1 space-y-8">
          {/* Mobile header - no tab navigation needed since Past Orders is now in header */}
          <div className="md:hidden mb-4">
            <h2 className="text-lg font-bold text-blue-800 text-center py-2">
              {t("availableDrinks")}
            </h2>
          </div>

          {/* Current Order Status */}
          {customerOrder && (
            <OrderStatusCard
              order={customerOrder}
              t={t}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
            />
          )}

          {/* Past Orders Section - removed since it's now a separate page */}

          {/* Grouped Available Drinks */}
          {spiritsWithDrinks.length === 0 && favouriteDrinks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No drinks available right now</p>
            </div>
          ) : (
            <>
              {/* Favourites Section */}
              {favouriteDrinks.length > 0 && (
                <section
                  id="favourites"
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-yellow-700 mb-4">
                    ⭐ {t("favourites")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {favouriteDrinks.map((drink) => (
                      <DrinkCard
                        key={drink.id}
                        drink={{ ...drink, is_favourite: true }}
                        onViewRecipe={setViewingRecipe}
                        onOrder={handlePlaceOrder}
                        onToggleFavourite={handleToggleFavourite}
                        disabled={!!customerOrder || loading}
                        loading={loading}
                        t={t}
                      />
                    ))}
                  </div>
                </section>
              )}
              
              {spiritsWithDrinks.map((spirit) => (
                <section
                  key={spirit}
                  id={`spirit-${spirit.replace(/[^a-zA-Z0-9]/g, "")}`}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">
                    {spirit}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedDrinks[spirit].map((drink) => (
                      <DrinkCard
                        key={drink.id}
                        drink={drink}
                        onViewRecipe={setViewingRecipe}
                        onOrder={handlePlaceOrder}
                        onToggleFavourite={handleToggleFavourite}
                        disabled={!!customerOrder || loading}
                        loading={loading}
                        t={t}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInterface;
