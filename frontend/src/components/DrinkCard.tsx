import React from "react";
import { Drink } from "../context/AppContext";
import { translations } from "../utils/translations";

interface DrinkCardProps {
  drink: Drink;
  onViewRecipe: (drink: Drink) => void;
  onOrder: (drink: Drink) => void;
  disabled: boolean;
  loading: boolean;
  t: (key: keyof typeof translations.en) => string;
}

const DrinkCard: React.FC<DrinkCardProps> = ({
  drink,
  onViewRecipe,
  onOrder,
  disabled,
  loading,
  t,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
      <h3 className="font-semibold text-gray-800 mb-2">{drink.title}</h3>
      
      {/* Show guest description if available */}
      {drink.guest_description && (
        <p className="text-sm text-gray-600 mb-3">{drink.guest_description}</p>
      )}
      
      <div className="flex flex-col space-y-2">
        {/* Only show view recipe button if recipe is available to guests */}
        {drink.recipe && (
          <button
            onClick={() => onViewRecipe(drink)}
            className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            {t("viewRecipe")}
          </button>
        )}
        <button
          onClick={() => onOrder(drink)}
          disabled={disabled || loading}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            disabled || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? t("loading") : t("order")}
        </button>
      </div>
    </div>
    <div
      className="prose prose-sm text-gray-800 max-w-none"
      style={{
        // Force readable text color for markdown output
        ["--color-fg-default" as any]: "#222",
      }}
    >
      {/* Rendered markdown content here */}
    </div>
  </div>
);

export default DrinkCard;
