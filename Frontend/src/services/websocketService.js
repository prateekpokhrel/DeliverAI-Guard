import { Client } from "@stomp/stompjs";

// =============================================
// API BASE URL
// =============================================

const API_BASE_URL = import.meta.env.VITE_API_URL;

// =============================================
// WEBSOCKET URL
// =============================================

// Convert HTTP/HTTPS to WS/WSS
const WS_URL = API_BASE_URL
    .replace(/^https:\/\//, "wss://")
    .replace(/^http:\/\//, "ws://");

// =============================================
// STOMP CLIENT
// =============================================

let stompClient = null;

// =============================================
// CONNECT WEBSOCKET
// =============================================

export const connectWebSocket = (onMessageReceived) => {

    try {

        // Prevent duplicate connections
        if (stompClient && stompClient.connected) {
            console.log("WebSocket already connected");
            return;
        }

        console.log("Connecting WebSocket to:", `${WS_URL}/ws`);

        stompClient = new Client({

            // Railway backend websocket endpoint
            brokerURL: `${WS_URL}/ws`,

            // Auto reconnect
            reconnectDelay: 5000,

            // Heartbeat
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            // Debug logs
            debug: (str) => {
                console.log("STOMP:", str);
            },

            // =============================================
            // CONNECT SUCCESS
            // =============================================

            onConnect: () => {

                console.log("WebSocket Connected");

                stompClient.subscribe(
                    "/topic/deliveries",
                    (message) => {

                        try {

                            const data =
                                JSON.parse(message.body);

                            console.log(
                                "WebSocket Message:",
                                data
                            );

                            if (onMessageReceived) {
                                onMessageReceived(data);
                            }

                        } catch (err) {

                            console.error(
                                "WebSocket message parse error:",
                                err
                            );
                        }
                    }
                );
            },

            // =============================================
            // STOMP ERROR
            // =============================================

            onStompError: (frame) => {

                console.error(
                    "Broker reported error:",
                    frame.headers["message"]
                );

                console.error(
                    "Additional details:",
                    frame.body
                );
            },

            // =============================================
            // WEBSOCKET ERROR
            // =============================================

            onWebSocketError: (error) => {

                console.error(
                    "WebSocket Error:",
                    error
                );
            },

            // =============================================
            // WEBSOCKET CLOSE
            // =============================================

            onWebSocketClose: (event) => {

                console.warn(
                    "WebSocket Closed:",
                    event
                );
            },
        });

        stompClient.activate();

    } catch (error) {

        console.error(
            "WebSocket connection failed:",
            error
        );
    }
};

// =============================================
// DISCONNECT WEBSOCKET
// =============================================

export const disconnectWebSocket = async () => {

    try {

        if (stompClient) {

            await stompClient.deactivate();

            console.log(
                "WebSocket Disconnected"
            );

            stompClient = null;
        }

    } catch (error) {

        console.error(
            "WebSocket disconnect error:",
            error
        );
    }
};