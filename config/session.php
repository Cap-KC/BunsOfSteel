<?php
/**
 * Session management helpers.
 *
 * Call session_init() once at the top of every PHP page / API endpoint.
 * Everything else in the app uses the three helpers below.
 */

function session_init(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure',   1);   // set to 0 if not using HTTPS locally
        ini_set('session.cookie_samesite', 'Lax');
        session_start();
    }
}

/** Store the logged-in user's ID in the session. */
function session_set_user(int $userId): void
{
    $_SESSION['user_id'] = $userId;
}

/** Return the current user ID or null. */
function session_get_user(): ?int
{
    return $_SESSION['user_id'] ?? null;
}

/** Destroy the session completely. */
function session_logout(): void
{
    $_SESSION = [];
    if (session_id() !== '') {
        setcookie(session_name(), '', time() - 3600);
    }
    session_destroy();
}
