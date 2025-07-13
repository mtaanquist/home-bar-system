import React from "react";
import { Coffee } from "lucide-react";
import { translations } from "../utils/translations";

interface HelpTextProps {
  onSurprise: () => void;
  canSurprise: boolean;
  disabled: boolean;
  t: (key: keyof typeof translations.en) => string;
}

const HelpText: React.FC<HelpTextProps> = ({
  onSurprise,
  canSurprise,
  disabled,
  t,
}) => (
  <div className="max-w-4xl mx-auto px-4 mt-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Coffee className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            {t("howToOrder")}
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>{t("howToOrderInstructions")}</p>
          </div>
        </div>
      </div>
    </div>
    <button
      onClick={onSurprise}
      disabled={!canSurprise || disabled}
      className="w-full md:w-auto px-6 py-3 bg-pink-600 text-white rounded-lg font-bold text-lg shadow hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
    >
      🎲 {t("surpriseMe")}
    </button>
  </div>
);

export default HelpText;
