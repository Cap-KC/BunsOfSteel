<?php
/**
 * User model – all queries that touch `users` and `user_stats`.
 */

require_once PROJECT_ROOT . '/config/database.php';

class User
{
    /** Register a new user. Returns the new row's ID or null on failure. */
    public static function create(string $name, string $email, string $password): ?int
    {
        $pdo  = getDBConnection();
        $hash = password_hash($password, PASSWORD_BCRYPT);

        try {
            $pdo->beginTransaction();

            $pdo->prepare(
                'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
            )->execute([$name, $email, $hash]);

            $userId = (int) $pdo->lastInsertId();

            // Seed an empty stats row
            $pdo->prepare(
                'INSERT INTO user_stats (user_id) VALUES (?)'
            )->execute([$userId]);

            $pdo->commit();
            return $userId;
        } catch (\PDOException $e) {
            $pdo->rollBack();
            error_log('User::create – ' . $e->getMessage());
            return null;
        }
    }

    /** Check whether an email is already taken. */
    public static function emailExists(string $email): bool
    {
        $row = getDBConnection()->prepare(
            'SELECT 1 FROM users WHERE email = ? LIMIT 1'
        );
        $row->execute([$email]);
        return $row->fetch() !== false;
    }

    /** Authenticate by email + password. Returns the user row or null. */
    public static function authenticate(string $email, string $password): ?array
    {
        $stmt = getDBConnection()->prepare(
            'SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1'
        );
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) return null;

        if (!password_verify($password, $user['password_hash'])) return null;

        // Drop the hash before returning – never send it downstream
        unset($user['password_hash']);
        return $user;
    }

    /** Fetch a user by primary key (no password hash). */
    public static function findById(int $id): ?array
    {
        $stmt = getDBConnection()->prepare(
            'SELECT id, name, email FROM users WHERE id = ? LIMIT 1'
        );
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }
}
