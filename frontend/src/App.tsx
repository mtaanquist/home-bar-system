import React, { useEffect } from "react";
import LandingPage from "./components/LandingPage";
import BartenderDashboard from "./components/BartenderDashboard";
import CustomerInterface from "./components/CustomerInterface";
import DrinkForm from "./components/DrinkForm";
import RecipeView from "./components/RecipeView";
import ErrorDisplay from "./components/ErrorDisplay";
import { AppProvider, useApp } from "./context/AppContext";
import { WebSocketProvider } from "./context/WebSocketContext";

const AppContent: React.FC = () => {
  const {
    currentView,
    error,
    editingDrink,
    viewingRecipe,
    setError,
    setEditingDrink,
    setViewingRecipe,
  } = useApp();

  // Error display
  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  // Recipe view modal
  if (viewingRecipe) {
    return (
      <RecipeView
        drink={viewingRecipe}
        onClose={() => setViewingRecipe(null)}
      />
    );
  }

  // Drink form modal
  if (editingDrink !== null) {
    return (
      <DrinkForm drink={editingDrink} onClose={() => setEditingDrink(null)} />
    );
  }

  // Main views
  switch (currentView) {
    case "bartender":
      return <BartenderDashboard />;

    case "customer":
      return <CustomerInterface />;

    default:
      return <LandingPage />;
  }
};

const App: React.FC = () => {
  useEffect(() => {
    document.body.setAttribute("data-color-mode", "light");
  }, []);

  return (
    <AppProvider>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </AppProvider>
  );
};

export default App;
