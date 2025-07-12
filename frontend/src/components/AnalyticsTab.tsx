import React, { useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Coffee,
  Clock,
  Star,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "../utils/translations";

const AnalyticsTab: React.FC = () => {
  const { currentBar, language, analytics, orders, setAnalytics, apiCall } =
    useApp();

  const t = useTranslation(language);

  const fetchAnalytics = async () => {
    if (!currentBar) return;
    try {
      const data = await apiCall(`/orders/bar/${currentBar.id}/analytics`);
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  useEffect(() => {
    if (currentBar) {
      fetchAnalytics();
    }
  }, [currentBar]);

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Loading Analytics...
        </h3>
        <p className="text-gray-600">Gathering data from your orders</p>
      </div>
    );
  }

  const getMaxCount = (
    data: Array<{ count?: number; order_count?: number }>
  ) => {
    return Math.max(...data.map((item) => item.count || item.order_count || 0));
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {t("totalOrders")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {t("ordersToday")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.ordersToday}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Coffee className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Drink</p>
              <p className="text-lg font-bold text-gray-900 truncate">
                {analytics.popularDrinks[0]?.drink_title || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Peak Hour</p>
              <p className="text-lg font-bold text-gray-900">
                {analytics.peakHours[0]?.hour || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Drinks */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              {t("popularDrinks")}
            </h3>
          </div>

          {analytics.popularDrinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No order data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.popularDrinks.slice(0, 5).map((item, index) => {
                const maxCount = getMaxCount(analytics.popularDrinks);
                const percentage =
                  maxCount > 0 ? (item.order_count / maxCount) * 100 : 0;

                return (
                  <div
                    key={item.drink_title}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <span className="font-medium text-gray-800 truncate">
                        {item.drink_title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {item.order_count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <Clock className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">
              {t("peakHours")}
            </h3>
          </div>

          {analytics.peakHours.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No peak hour data yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.peakHours.slice(0, 5).map((item, index) => {
                const maxCount = getMaxCount(analytics.peakHours);
                const percentage =
                  maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                return (
                  <div
                    key={item.hour}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <span className="font-medium text-gray-800">
                        {item.hour}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Order Status Distribution
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              status: "new",
              label: "New",
              color: "bg-yellow-500",
              bgColor: "bg-yellow-50",
              textColor: "text-yellow-700",
            },
            {
              status: "accepted",
              label: "Accepted",
              color: "bg-blue-500",
              bgColor: "bg-blue-50",
              textColor: "text-blue-700",
            },
            {
              status: "rejected",
              label: "Rejected",
              color: "bg-red-500",
              bgColor: "bg-red-50",
              textColor: "text-red-700",
            },
            {
              status: "ready",
              label: "Ready",
              color: "bg-green-500",
              bgColor: "bg-green-50",
              textColor: "text-green-700",
            },
            {
              status: "processed",
              label: "Completed",
              color: "bg-gray-500",
              bgColor: "bg-gray-50",
              textColor: "text-gray-700",
            },
          ].map(({ status, label, color, bgColor, textColor }) => {
            const count = orders.filter(
              (order) => order.status === status
            ).length;
            return (
              <div
                key={status}
                className={`${bgColor} rounded-lg p-4 text-center`}
              >
                <div className={`w-4 h-4 ${color} rounded-full mx-auto mb-2`} />
                <p className={`text-sm font-medium ${textColor}`}>{label}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Recent Activity Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Today's Performance
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Orders placed</span>
                <span className="text-sm font-medium">
                  {analytics.ordersToday}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Orders completed</span>
                <span className="text-sm font-medium">
                  {
                    orders.filter(
                      (o) =>
                        o.status === "processed" &&
                        new Date(o.updated_at).toDateString() ===
                          new Date().toDateString()
                    ).length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completion rate</span>
                <span className="text-sm font-medium">
                  {analytics.ordersToday > 0
                    ? Math.round(
                        (orders.filter(
                          (o) =>
                            o.status === "processed" &&
                            new Date(o.updated_at).toDateString() ===
                              new Date().toDateString()
                        ).length /
                          analytics.ordersToday) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">All Time Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total orders</span>
                <span className="text-sm font-medium">
                  {analytics.totalOrders}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Avg orders per day
                </span>
                <span className="text-sm font-medium">
                  {analytics.totalOrders > 0
                    ? Math.round(analytics.totalOrders / 7)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Most popular drink
                </span>
                <span className="text-sm font-medium truncate max-w-32">
                  {analytics.popularDrinks[0]?.drink_title || "None"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
