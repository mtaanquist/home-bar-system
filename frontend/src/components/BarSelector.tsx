import React, { useState, useEffect } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { useApp, Bar } from "../context/AppContext";
import { useTranslation } from "../utils/translations";

interface BarSelectorProps {
  onSelectBar: (bar: Bar) => void;
  onCreateBar: () => void;
}

const BarSelector: React.FC<BarSelectorProps> = ({
  onSelectBar,
  onCreateBar,
}) => {
  const { language, apiCall } = useApp();
  const t = useTranslation(language);

  const [availableBars, setAvailableBars] = useState<Bar[]>([]);
  const [loadingBars, setLoadingBars] = useState(false);

  const fetchBars = async () => {
    setLoadingBars(true);
    try {
      const data = await apiCall("/bars");
      setAvailableBars(data);
    } catch (err) {
      console.error("Error fetching bars:", err);
      setAvailableBars([]);
    } finally {
      setLoadingBars(false);
    }
  };

  useEffect(() => {
    fetchBars();
  }, []);

  return (
    <div className="space-y-4">
      {/* Available Bars */}
      {availableBars.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700">Select Existing Bar</h4>
            <button
              onClick={fetchBars}
              disabled={loadingBars}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Refresh bars list"
            >
              <RefreshCw
                className={`w-4 h-4 ${loadingBars ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBars.map((bar) => (
              <button
                key={bar.id}
                onClick={() => onSelectBar(bar)}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="font-medium text-gray-800">{bar.name}</div>
                <div className="text-sm text-gray-500">
                  ID: {bar.id} • Language: {bar.language.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
      </div>

      {/* Create New Bar Button */}
      <button
        onClick={onCreateBar}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>{t("createBar")}</span>
      </button>
    </div>
  );
};

export default BarSelector;
