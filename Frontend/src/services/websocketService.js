import { Client } from "@stomp/stompjs";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const WS_URL =
    API_BASE_URL
        .replace("https://", "wss://")
        .replace("http://", "ws://");

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {

    stompClient = new Client({

        brokerURL: `${WS_URL}/ws`,

        reconnectDelay: 5000,

        onConnect: () => {

            console.log("WebSocket Connected");

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
            console.error(frame);
        },
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {

    if (stompClient) {
        stompClient.deactivate();
    }
};