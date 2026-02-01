<?php
/**
 * GET /src/api/session.php
 * Returns { success, user? } – used by the frontend on page load.
 */

if (!defined('PROJECT_ROOT')) define('PROJECT_ROOT', realpath(__DIR__ . '/../..'));

require_once PROJECT_ROOT . '/config/session.php';
require_once PROJECT_ROOT . '/src/auth/User.php';

session_init();
header('Content-Type: application/json');

$userId = session_get_user();

if ($userId === null) {
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Not authenticated.']));
}

$user = User::findById($userId);

if ($user === null) {
    // Session references a deleted user – clean up
    session_logout();
    http_response_code(401);
    exit(json_encode(['success' => false, 'message' => 'Session expired.']));
}

echo json_encode(['success' => true, 'user' => $user]);
