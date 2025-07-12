import React, { useState, useEffect } from "react";
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
    userType,
    currentBar,
    customerName,
    error,
    editingDrink,
    viewingRecipe,
    setCurrentView,
    setUserType,
    setCustomerName,
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
  return (
    <AppProvider>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </AppProvider>
  );
};

export default App;
