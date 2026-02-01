<?php
/**
 * POST /src/api/logout.php
 * Destroys the server-side session.
 */

if (!defined('PROJECT_ROOT')) define('PROJECT_ROOT', realpath(__DIR__ . '/../..'));

require_once PROJECT_ROOT . '/config/session.php';

session_init();
header('Content-Type: application/json');

session_logout();

echo json_encode(['success' => true, 'message' => 'Logged out.']);
