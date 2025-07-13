import React from "react";
import { translations } from "../utils/translations";

interface OrderStatusCardProps {
  order: any;
  t: (key: keyof typeof translations.en) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
  order,
  t,
  getStatusIcon,
  getStatusColor,
}) => (
  <div className={`rounded-lg border-2 p-4 ${getStatusColor(order.status)}`}>
    <div className="flex items-center space-x-3">
      {getStatusIcon(order.status)}
      <div className="flex-1">
        <h3 className="font-semibold">{t("yourOrder")}</h3>
        <p className="text-sm opacity-90">{order.drink_title}</p>
        <p className="text-xs opacity-75">
          {t("orderStatus")}: {t(order.status)}
        </p>
      </div>
      {order.status === "ready" && (
        <div className="text-right">
          <div className="text-lg font-bold">🎉</div>
          <div className="text-xs font-medium">Ready!</div>
        </div>
      )}
    </div>
  </div>
);

export default OrderStatusCard;
