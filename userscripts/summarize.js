/**
 * Scriptable Web Content Capture and API Integration
 * 
 * This script captures content from a specified webpage and sends it to a configured API.
 * It allows for local configuration storage, making it easy to manage API endpoints and 
 * headers without modifying the script directly.
 * 
 * Usage:
 * - Create a widget in Scriptable that points to this script.
 * - Modify the `apiUrl`, `headers`, and `targetUrl` in the configuration section as needed.
 * - Run the script directly or through the widget to capture content and send it to the API.
 *
 * Configuration:
 * - apiUrl: The endpoint where data will be sent.
 * - headers: Any required headers for the API request (e.g., authorization).
 * - targetUrl: The webpage from which content will be captured.
 *
 * Notes:
 * - Ensure sensitive information in headers is handled securely.
 * - Test the script after any changes to ensure functionality.
 *
 * Author: gw
 * Date: 2025-02-03
 */

const fm = FileManager.local();
const configFilePath = fm.joinPath(fm.documentsDirectory(), "config.json");

// Load or initialize configuration
let config;
if (fm.fileExists(configFilePath)) {
    const configData = fm.readString(configFilePath);
    config = JSON.parse(configData);
} else {
    // Default configuration
    config = {
        apiUrl: "https://api.example.com/endpoint", // Your API endpoint
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_TOKEN" // Replace with your token if needed
        },
        targetUrl: "https://example.com" // URL to capture content from
    };
    fm.writeString(configFilePath, JSON.stringify(config));
}

// Function to capture content from the target URL
async function captureContent() {
    let req = new Request(config.targetUrl);
    let html = await req.loadString();
    
    // Process the HTML content as needed (e.g., extract specific data)
    return html; // For demonstration, returning the raw HTML
}

// Function to send captured data to the API
async function sendToAPI(data) {
    let req = new Request(config.apiUrl);
    req.method = 'POST'; // Change to 'GET', 'PUT', etc., as needed
    req.headers = config.headers;
    req.body = JSON.stringify({ content: data });
    
    let response = await req.loadJSON();
    return response; // Handle response as needed
}

// Main function to execute the script
async function main() {
    if (args.queryParameters.action === 'captureContent') {
        let data = await captureContent();
        let response = await sendToAPI(data);
        console.log(response); // Log the response for debugging
        Script.complete();
    } else {
        // Setup widget if no action is specified
        let widget = new ListWidget();
        let button = widget.addText("Capture Content");
        button.url = "scriptable:///run?scriptName=YourScriptName&action=captureContent"; // Replace with your script name
        
        Script.setWidget(widget);
        Script.complete();
    }
}

// Run the main function
await main();
