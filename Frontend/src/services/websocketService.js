import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_BASE_URL =
    import.meta.env.VITE_API_URL;

console.log(
    "API_BASE_URL:",
    API_BASE_URL
);

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {

    if (stompClient?.connected) {
        return;
    }

    const client = new Client({
        webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.log("STOMP:", str),

        onConnect: () => {
            console.log("WebSocket Connected");

            // use the client reference captured by closure to avoid race conditions
            client.subscribe(
                "/topic/deliveries",
                (message) => {
                    const data = JSON.parse(message.body);
                    onMessageReceived(data);
                }
            );
        },

        onStompError: (frame) => console.error("STOMP Error:", frame),
        onWebSocketError: (error) => console.error("WebSocket Error:", error),
        onDisconnect: () => console.log("WebSocket Disconnected")
    });

    stompClient = client;
    stompClient.activate();
};

export const disconnectWebSocket = async () => {

    if (stompClient) {

        await stompClient.deactivate();

        stompClient = null;

        console.log(
            "WebSocket Disconnected"
        );
    }
};