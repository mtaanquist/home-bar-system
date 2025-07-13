import React from "react";
import { X, Clock, Users, ChefHat } from "lucide-react";
import { useApp, Drink } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import MDEditor from "@uiw/react-md-editor";

interface RecipeViewProps {
  drink: Drink;
  onClose: () => void;
}

const RecipeView: React.FC<RecipeViewProps> = ({ drink, onClose }) => {
  const { language } = useApp();
  const t = useTranslation(language);

  // Extract difficulty, prep time, and servings from recipe if present
  const extractMetadata = (recipe: string) => {
    const difficultyMatch = recipe.match(/difficulty:\s*(\w+)/i);
    const prepTimeMatch = recipe.match(
      /prep(?:\s+time)?:\s*(\d+(?:\s*-\s*\d+)?)\s*(?:min|minutes?)/i
    );
    const servingsMatch = recipe.match(
      /(?:serves?|servings?):\s*(\d+(?:\s*-\s*\d+)?)/i
    );

    return {
      difficulty: difficultyMatch ? difficultyMatch[1] : null,
      prepTime: prepTimeMatch ? prepTimeMatch[1] : null,
      servings: servingsMatch ? servingsMatch[1] : null,
    };
  };

  const metadata = extractMetadata(drink.recipe);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden my-8">
        {/* Header */}
        <div className="relative">
          {drink.image_url && (
            <div className="h-64 lg:h-80 overflow-hidden">
              <img
                src={drink.image_url}
                alt={drink.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          <div
            className={`${
              drink.image_url ? "absolute bottom-0 left-0 right-0" : ""
            } p-6`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1
                  className={`text-3xl lg:text-4xl font-bold mb-2 ${
                    drink.image_url ? "text-white" : "text-gray-800"
                  }`}
                >
                  {drink.title}
                </h1>
                {drink.base_spirit && (
                  <div
                    className={`text-base font-medium mb-2 ${
                      drink.image_url ? "text-white/90" : "text-blue-700"
                    }`}
                  >
                    Base Spirit: {drink.base_spirit}
                  </div>
                )}

                {/* Metadata */}
                {(metadata.difficulty ||
                  metadata.prepTime ||
                  metadata.servings) && (
                  <div className="flex flex-wrap gap-4 text-sm">
                    {metadata.difficulty && (
                      <div
                        className={`flex items-center ${
                          drink.image_url ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        <ChefHat className="w-4 h-4 mr-1" />
                        <span className="capitalize">
                          {metadata.difficulty}
                        </span>
                      </div>
                    )}
                    {metadata.prepTime && (
                      <div
                        className={`flex items-center ${
                          drink.image_url ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{metadata.prepTime} min</span>
                      </div>
                    )}
                    {metadata.servings && (
                      <div
                        className={`flex items-center ${
                          drink.image_url ? "text-white/90" : "text-gray-600"
                        }`}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        <span>
                          {metadata.servings}{" "}
                          {metadata.servings === "1" ? "serving" : "servings"}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ml-4 ${
                  drink.image_url
                    ? "bg-black/20 text-white hover:bg-black/40"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8 overflow-y-auto max-h-[50vh]">
          {/* Ensure the markdown container uses a readable color and prose styling */}
          <div className="prose prose-sm text-gray-800 max-w-none">
            <MDEditor.Markdown
              source={drink.recipe}
              style={{ background: "none", padding: 0, margin: 0 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>
                Created on {new Date(drink.created_at).toLocaleDateString()}
              </p>
              <p className="flex items-center mt-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    drink.in_stock ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {drink.in_stock ? t("inStock") : t("outOfStock")}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeView;
