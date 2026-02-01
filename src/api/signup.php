<?php
/**
 * POST /src/api/signup.php
 * Body: { "name": "…", "email": "…", "password": "…" }
 * Returns JSON { success, message, user? }
 */

if (!defined('PROJECT_ROOT')) define('PROJECT_ROOT', realpath(__DIR__ . '/../..'));

require_once PROJECT_ROOT . '/config/session.php';
require_once PROJECT_ROOT . '/src/auth/User.php';

session_init();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Method not allowed.']));
}

$body     = json_decode(file_get_contents('php://input'), true);
$name     = trim($body['name']     ?? '');
$email    = trim($body['email']    ?? '');
$password =      $body['password'] ?? '';

// --- Validation ---
if ($name === '' || $email === '' || $password === '') {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Name, email, and password are required.']));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Invalid email format.']));
}

if (strlen($password) < 8) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Password must be at least 8 characters.']));
}

if (User::emailExists($email)) {
    http_response_code(409);
    exit(json_encode(['success' => false, 'message' => 'Email already in use.']));
}

// --- Create user ---
$userId = User::create($name, $email, $password);

if ($userId === null) {
    http_response_code(500);
    exit(json_encode(['success' => false, 'message' => 'Account creation failed. Please try again.']));
}

// --- Start session ---
session_set_user($userId);

echo json_encode([
    'success' => true,
    'message' => 'Account created successfully.',
    'user'    => ['id' => $userId, 'name' => $name, 'email' => $email]
]);
