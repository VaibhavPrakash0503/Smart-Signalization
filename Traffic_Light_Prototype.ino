#include <WiFi.h>
const char* ssid = "Vaibhav's PC";
const char* password = "Vaibhav05";

// Define GPIO pins for each lane (red, green, yellow)
const int laneLights[3][3] = {
    {5, 4, 33},  // Lane 1
    {25, 26, 27},  // Lane 2
    {14, 12, 13}   // Lane 3
};

WiFiServer server(80);
unsigned long lastLaneSwitchTime = 0;
int currentLane = 0;  // Start with Lane 1 (index 0 in the array)
const unsigned long greenLightDuration = 5000;  // Automatic mode green light duration (5 seconds)
const unsigned long clientGreenLightDuration = 15000;  // Client-controlled green light duration (15 seconds)

void setup() {
    Serial.begin(115200);
    
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("WiFi connected!");
    
    server.begin();

    // Initialize all lights to be off
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            pinMode(laneLights[i][j], OUTPUT);
            digitalWrite(laneLights[i][j], LOW);
        }
    }

    // Start by setting the first lane to green (automatic mode)
    automaticTrafficLights(currentLane);
}

void loop() {
    // Handle any client requests
    WiFiClient client = server.available();
    if (client) {
        Serial.println("New client connected.");
        bool clientProcessed = false;  // Ensure only one input is accepted per client

        while (client.connected() && !clientProcessed) {
            if (client.available()) {
                // Read the client input once
                int lane = client.parseInt();
                Serial.print("Received lane: ");
                Serial.println(lane);

                if (lane >= 1 && lane <= 3) {
                    // Call client-controlled lane change (yellow + green)
                    clientControlledLights(lane - 1);  // Convert to 0-based index
                    delay(clientGreenLightDuration);   // Keep the client-controlled green light on for the specified duration
                    clientProcessed = true;            // Mark client request as processed
                } else {
                    Serial.println("Invalid input received.");
                }

                // Send the HTTP response
                client.println("HTTP/1.1 200 OK");
                client.println("Access-Control-Allow-Origin: *");
                client.println("Access-Control-Allow-Methods: GET, POST");
                client.println("Access-Control-Allow-Headers: Content-Type");
                client.println("Content-Type: text/plain");
                client.println("Connection: close");  // Close connection after response
                client.println();
                client.println("Traffic lights updated with yellow and green.");

                client.flush();  // Ensure all data is sent to the client
            }
        }

        // Disconnect the client after processing one request
        client.stop();
        Serial.println("Client disconnected.");
    }

    // Handle automatic lane switching if no client is connected
    unsigned long currentTime = millis();
    if (currentTime - lastLaneSwitchTime >= greenLightDuration) {
        // Automatically switch lanes
        currentLane = (currentLane + 1) % 3;  // Cycle through lanes 0, 1, 2
        automaticTrafficLights(currentLane);  // Automatic switching (green only)
        lastLaneSwitchTime = currentTime;
        Serial.println("Switched lanes automatically.");
    }
}

// Function for client-controlled lane changes (yellow + green)
void clientControlledLights(int lane) {
    Serial.print("Client requested lane: ");
    Serial.println(lane + 1);  // Print human-readable lane number (1, 2, or 3)

    for (int i = 0; i < 3; i++) {
        if (i == lane) {
            // Turn on both yellow and green lights for the requested lane
            digitalWrite(laneLights[i][0], LOW);  // Red off
            digitalWrite(laneLights[i][1], HIGH); // Yellow on
            digitalWrite(laneLights[i][2], HIGH); // Green on
            Serial.println("Yellow and Green ON for client request.");
        } else {
            // Set red for all other lanes
            digitalWrite(laneLights[i][0], HIGH);  // Red on
            digitalWrite(laneLights[i][1], LOW);   // Yellow off
            digitalWrite(laneLights[i][2], LOW);   // Green off
        }
    }
}

// Function for automatic lane switching (green only)
void automaticTrafficLights(int lane) {
    Serial.print("Automatically switching to lane: ");
    Serial.println(lane + 1);  // Print human-readable lane number (1, 2, or 3)

    for (int i = 0; i < 3; i++) {
        if (i == lane) {
            // Turn on only the green light for the active lane
            digitalWrite(laneLights[i][0], LOW);  // Red off
            digitalWrite(laneLights[i][1], LOW);  // Yellow off
            digitalWrite(laneLights[i][2], HIGH); // Green on
            Serial.println("Green ON for automatic mode.");
        } else {
            // Set red for all other lanes
            digitalWrite(laneLights[i][0], HIGH);  // Red on
            digitalWrite(laneLights[i][1], LOW);   // Yellow off
            digitalWrite(laneLights[i][2], LOW);   // Green off
        }
    }
}
