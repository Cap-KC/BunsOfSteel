<?php
/**
 * POST /src/api/login.php
 * Body: { "email": "…", "password": "…" }
 * Returns JSON { success, message, user? }
 */

if (!defined('PROJECT_ROOT')) define('PROJECT_ROOT', realpath(__DIR__ . '/../..'));

require_once PROJECT_ROOT . '/config/session.php';
require_once PROJECT_ROOT . '/src/auth/User.php';

session_init();
header('Content-Type: application/json');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Method not allowed.']));
}

$body = json_decode(file_get_contents('php://input'), true);
$email    = trim($body['email']    ?? '');
$password =      $body['password'] ?? '';

// --- Basic validation ---
if ($email === '' || $password === '') {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Email and password are required.']));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Invalid email format.']));
}

// --- Authenticate ---
$user = User::authenticate($email, $password);

if ($user === null) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Invalid email or password.']));
}

// --- Start session ---
session_set_user($user['id']);

echo json_encode([
    'success' => true,
    'message' => 'Login successful.',
    'user'    => $user          // { id, name, email }
]);
