import { Client }
    from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket =
    (onMessageReceived) => {

        stompClient =
            new Client({

                brokerURL:
                    "ws://localhost:8084/ws",

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
                        frame
                    );
                },
            });

        stompClient.activate();
    };

export const disconnectWebSocket =
    () => {

        if (stompClient) {

            stompClient.deactivate();
        }
    };