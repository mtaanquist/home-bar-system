import React, { useEffect, useState } from "react";
import { Plus, QrCode } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "../utils/translations";
import { useSessionManager } from "../hooks/useSessionManager";
import OrdersTab from "./OrdersTab";
import MenuTab from "./MenuTab";
import AnalyticsTab from "./AnalyticsTab";

const BartenderDashboard: React.FC = () => {
  const {
    currentBar,
    currentTab,
    language,
    orders,
    setCurrentTab,
    setDrinks,
    setOrders,
    setAnalytics,
    setEditingDrink,
    apiCall,
  } = useApp();

  const t = useTranslation(language);
  const { clearSession } = useSessionManager();
  
  // QR code modal state
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState<{
    qrCode: string;
    url: string;
    barName: string;
  } | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Data fetching functions
  const fetchDrinks = async () => {
    if (!currentBar) return;
    try {
      const data = await apiCall(`/drinks/bar/${currentBar.id}`);
      setDrinks(data);
    } catch (err) {
      console.error("Error fetching drinks:", err);
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

  const fetchAnalytics = async () => {
    if (!currentBar) return;
    try {
      const data = await apiCall(`/orders/bar/${currentBar.id}/analytics`);
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  // Generate QR code
  const handleGenerateQR = async () => {
    if (!currentBar) return;
    
    setQrLoading(true);
    try {
      const data = await apiCall(`/bars/${currentBar.id}/qrcode`);
      setQrData(data);
      setShowQRModal(true);
    } catch (err) {
      console.error("Error generating QR code:", err);
    } finally {
      setQrLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (currentBar) {
      fetchDrinks();
      fetchOrders();
      fetchAnalytics();
    }
  }, [currentBar]);

  const pendingOrders = orders.filter((order) =>
    ["new", "accepted", "ready"].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                🍸 {currentBar?.name}
              </h1>
              <span className="hidden sm:inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Bartender
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGenerateQR}
                disabled={qrLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">{t("generateQR")}</span>
              </button>
              <button
                onClick={clearSession}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setCurrentTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentTab === "orders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("pendingOrders")}
              {pendingOrders.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentTab("menu")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentTab === "menu"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("drinkMenu")}
            </button>
            <button
              onClick={() => setCurrentTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                currentTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("analytics")}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === "orders" && <OrdersTab />}
        {currentTab === "menu" && <MenuTab />}
        {currentTab === "analytics" && <AnalyticsTab />}
      </div>

      {/* Floating Action Button for Mobile */}
      {currentTab === "menu" && (
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button
            onClick={() => setEditingDrink({})}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && qrData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t("qrCodeTitle")} {qrData.barName}
              </h3>
              <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg inline-block">
                <img 
                  src={qrData.qrCode} 
                  alt="Bar QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {t("qrCodeInstructions")}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500 mb-2">{t("directLink")}</p>
                <div className="bg-white p-3 rounded border relative">
                  <code className="text-sm text-gray-800 break-words block leading-relaxed pr-12">
                    {qrData.url}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrData.url).then(() => {
                        // Could show a toast notification here
                      }).catch(() => {
                        // Fallback for older browsers
                        const textArea = document.createElement('textarea');
                        textArea.value = qrData.url;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                      });
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `${qrData.barName}_QR_Code.png`;
                    link.href = qrData.qrCode;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t("downloadQR")}
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BartenderDashboard;
