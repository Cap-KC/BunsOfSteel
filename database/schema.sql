-- =============================================================
-- BunsOfSteel Database Schema
-- Run once on your MySQL / MariaDB server to create the tables.
-- =============================================================

CREATE DATABASE IF NOT EXISTS bunsofsteel
    CHARACTER SET utf8mb4
    COLLATE     utf8mb4_unicode_ci;

USE bunsofsteel;

-- -------------------------------------------------------------
-- Users – credentials & profile
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,               -- bcrypt / password_hash()
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- User stats – one row per user, updated on every workout
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_stats (
    user_id          INT UNSIGNED NOT NULL PRIMARY KEY,
    total_calories   INT          NOT NULL DEFAULT 0,
    total_time       INT          NOT NULL DEFAULT 0,   -- minutes
    total_workouts   INT          NOT NULL DEFAULT 0,
    current_streak   INT          NOT NULL DEFAULT 0,
    last_workout_date DATE        NULL,
    CONSTRAINT fk_stats_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Workout history – one row per completed workout session
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workout_history (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED  NOT NULL,
    workout_id  INT           NOT NULL,     -- matches the JS workouts[].id
    workout_type VARCHAR(20)  NOT NULL,
    calories    INT           NOT NULL DEFAULT 0,
    duration    INT           NOT NULL DEFAULT 0,  -- minutes
    completed_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    INDEX idx_history_user_date (user_id, completed_at)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- Planned workouts – calendar entries
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planned_workouts (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    workout_id  INT          NOT NULL,
    planned_date DATE        NOT NULL,
    CONSTRAINT fk_planned_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    UNIQUE INDEX idx_planned_unique (user_id, workout_id, planned_date)
) ENGINE=InnoDB;
