import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_BASE_URL =
    import.meta.env.VITE_API_URL;

let stompClient = null;

export const connectWebSocket = (
    onMessageReceived
) => {

    if (stompClient?.connected) {
        return;
    }

    stompClient = new Client({

        webSocketFactory: () =>
            new SockJS(
                `${API_BASE_URL}/ws`
            ),

        reconnectDelay: 5000,

        debug: (str) => {
            console.log("STOMP:", str);
        },

        onConnect: () => {

            console.log(
                "WebSocket Connected"
            );

            stompClient.subscribe(
                "/topic/deliveries",
                (message) => {

                    const data =
                        JSON.parse(message.body);

                    onMessageReceived(data);
                }
            );
        },

        onStompError: (frame) => {

            console.error(
                "STOMP Error:",
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

export const disconnectWebSocket = async () => {

    if (stompClient) {

        await stompClient.deactivate();

        stompClient = null;

        console.log(
            "WebSocket Disconnected"
        );
    }
};