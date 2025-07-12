import React, { useState } from "react";
import { X, Upload, Eye, EyeOff } from "lucide-react";
import { useApp, Drink } from "../context/AppContext";
import { useTranslation } from "../utils/translations";

interface DrinkFormProps {
  drink: Drink | {};
  onClose: () => void;
}

const DrinkForm: React.FC<DrinkFormProps> = ({ drink, onClose }) => {
  const {
    currentBar,
    language,
    loading,
    setDrinks,
    setLoading,
    setError,
    apiCall,
  } = useApp();

  const t = useTranslation(language);
  const isEditing = "id" in drink && drink.id;

  const [formData, setFormData] = useState({
    title: "title" in drink ? drink.title || "" : "",
    image: "image_url" in drink ? drink.image_url || "" : "",
    recipe: "recipe" in drink ? drink.recipe || "" : "",
  });

  const [showPreview, setShowPreview] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed");
      return;
    }

    setUploadError(null);
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      setLoading(true);
      const response = await fetch("/api/drinks/upload-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Drink title is required");
      return;
    }

    if (!formData.recipe.trim()) {
      setError("Recipe is required");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Update existing drink
        const updatedDrink = await apiCall(`/drinks/${drink.id}`, {
          method: "PUT",
          body: JSON.stringify({
            barId: currentBar!.id,
            title: formData.title.trim(),
            imageUrl: formData.image.trim() || null,
            recipe: formData.recipe.trim(),
          }),
        });

        setDrinks((prev) =>
          prev.map((d) => (d.id === drink.id ? updatedDrink : d))
        );
      } else {
        // Create new drink
        const newDrink = await apiCall("/drinks", {
          method: "POST",
          body: JSON.stringify({
            barId: currentBar!.id,
            title: formData.title.trim(),
            imageUrl: formData.image.trim() || null,
            recipe: formData.recipe.trim(),
          }),
        });

        setDrinks((prev) => [...prev, newDrink]);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save drink");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text: string): string => {
    return text
      .replace(
        /## (.*)/g,
        '<h2 class="text-xl font-bold mb-2 text-gray-800">$1</h2>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/- (.*)/g, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/(\d+)\. (.*)/g, '<li class="ml-4 mb-1">$1. $2</li>')
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? t("editDrink") : t("addDrink")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-180px)]">
          {/* Form Side */}
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("drinkTitle")} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., Old Fashioned"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("drinkImage")}
                </label>

                {/* Upload Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            {t("uploadImage")}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading}
                      />
                    </label>
                  </div>

                  {uploadError && (
                    <p className="text-sm text-red-600">{uploadError}</p>
                  )}

                  <div className="text-center text-gray-500 text-sm">
                    {t("or")}
                  </div>

                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-4">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Recipe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("recipe")} *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.recipe}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recipe: e.target.value,
                      }))
                    }
                    rows={12}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                    placeholder="## Drink Name&#10;&#10;**Ingredients:**&#10;- 2 oz Spirit&#10;- 1 oz Mixer&#10;- Garnish&#10;&#10;**Instructions:**&#10;1. Step 1&#10;2. Step 2&#10;3. Serve and enjoy!"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700"
                    title={showPreview ? "Hide preview" : "Show preview"}
                  >
                    {showPreview ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use Markdown formatting for better presentation
                </p>
              </div>
            </form>
          </div>

          {/* Preview Side (Desktop) */}
          {showPreview && (
            <div className="lg:w-1/2 lg:border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Preview
              </h3>
              <div className="bg-white rounded-lg p-4 min-h-full">
                {formData.title && (
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {formData.title}
                  </h2>
                )}

                {formData.image && (
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                {formData.recipe ? (
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(formData.recipe),
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    Recipe preview will appear here...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading || !formData.title.trim() || !formData.recipe.trim()
            }
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("loading") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrinkForm;
