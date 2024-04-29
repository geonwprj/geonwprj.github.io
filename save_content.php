<?php
// Check if the request is an AJAX request
if (!empty($_POST['filename']) && !empty($_POST['content'])) {
    // Sanitize the filename just to be safe
    $filename = preg_replace('/[^a-zA-Z0-9]/', '', $_POST['filename']);
    $content = $_POST['content'];

    // Define the path to the inbox directory
    $inboxDir = __DIR__ . '/inbox/';

    // Check if the inbox directory exists, if not create it
    if (!is_dir($inboxDir)) {
        mkdir($inboxDir, 0777, true);
    }

    // Save the content to a file
    $filePath = $inboxDir . $filename . '.txt';
    file_put_contents($filePath, $content);

    echo 'Content saved successfully.';
} else {
    // Handle error
    echo 'Error: Missing filename or content.';
}
?>
