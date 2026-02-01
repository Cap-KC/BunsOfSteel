<?php
/**
 * Database connection – singleton PDO wrapper.
 *
 * Credentials are read from the .env file at the project root.
 * Copy .env.example → .env and fill in your values before first use.
 */

if (!defined('PROJECT_ROOT')) {
    define('PROJECT_ROOT', realpath(__DIR__ . '/..'));
}

// ---------------------------------------------------------------------------
// Load .env (simple key=value, no dependency required)
// ---------------------------------------------------------------------------
$envFile = PROJECT_ROOT . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') continue;
        [$key, $value] = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

function getDBConnection(): PDO
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $host = getenv('DB_HOST')     ?: '127.0.0.1';
    $name = getenv('DB_NAME')     ?: 'bunsofsteel';
    $user = getenv('DB_USER')     ?: 'root';
    $pass = getenv('DB_PASS')     ?: '';
    $port = getenv('DB_PORT')     ?: '3306';

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        // Never leak credentials to the browser
        error_log('DB connection failed: ' . $e->getMessage());
        http_response_code(500);
        exit(json_encode(['success' => false, 'message' => 'Database unavailable.']));
    }

    return $pdo;
}
