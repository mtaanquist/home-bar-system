import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useApp } from "./AppContext";

interface WebSocketContextType {
  ws: WebSocket | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

// Use the correct host port for WebSocket when running via Docker Compose
const WS_URL = `ws://${window.location.hostname}:21080`;

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { currentBar, userType, customerName, setOrders, apiCall } = useApp();

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case "new_order":
      case "order_status_updated":
        fetchOrders();
        break;
      case "order_deleted":
        setOrders((prev) => prev.filter((order) => order.id !== data.orderId));
        break;
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

  useEffect(() => {
    if (currentBar && (userType === "bartender" || userType === "guest")) {
      const websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        websocket.send(
          JSON.stringify({
            type: "join_bar",
            barId: currentBar.id,
            userType,
            customerName: userType === "guest" ? customerName : undefined,
          })
        );
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      websocket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    } else {
      if (ws) {
        ws.close();
        setWs(null);
        setIsConnected(false);
      }
    }
  }, [currentBar, userType, customerName]);

  const value: WebSocketContextType = {
    ws,
    isConnected,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
