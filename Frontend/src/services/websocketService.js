import { Client }
    from "@stomp/stompjs";

let stompClient = null;

// =====================================
// BACKEND URL FROM .env
// =====================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL;

// Convert:
// https://abc.up.railway.app
// ->
// wss://abc.up.railway.app

const SOCKET_URL =
    API_BASE_URL.replace(
        "https://",
        "wss://"
    );

// =====================================
// CONNECT WEBSOCKET
// =====================================

export const connectWebSocket =
    (onMessageReceived) => {

        stompClient =
            new Client({

                brokerURL:
                    `${SOCKET_URL}/ws`,

                reconnectDelay: 5000,

                onConnect: () => {

                    console.log(
                        "WebSocket Connected"
                    );

                    stompClient.subscribe(
                        "/topic/deliveries",

                        (message) => {

                            const data =
                                JSON.parse(
                                    message.body
                                );

                            onMessageReceived(
                                data
                            );
                        }
                    );
                },

                onStompError: (frame) => {

                    console.error(
                        "STOMP ERROR:",
                        frame
                    );
                },

                onWebSocketError: (error) => {

                    console.error(
                        "WebSocket Error:",
                        error
                    );
                },
            });

        stompClient.activate();
    };

// =====================================
// DISCONNECT
// =====================================

export const disconnectWebSocket =
    () => {

        if (stompClient) {

            stompClient.deactivate();

            console.log(
                "WebSocket Disconnected"
            );
        }
    };