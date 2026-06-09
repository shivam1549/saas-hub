-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 09, 2026 at 04:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `multitenant`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `task_id`, `user_id`, `content`, `file_path`, `file_name`, `created_at`, `updated_at`) VALUES
(1, 4, 1, 'Hello Upload files', NULL, NULL, '2026-05-17 07:51:17', '2026-05-17 07:51:17'),
(2, 4, 1, NULL, 'attachments/fJEDX4u5BQS7YyxQJuuAyhc7wyh21igiEH21WoZi.pdf', 'Senior_Web_Developer_Resume.pdf', '2026-05-17 08:00:25', '2026-05-17 08:00:25');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2026_05_09_093954_create_tenants_table', 1),
(6, '2026_05_09_094041_add_tenant_id_and_role_to_users_table', 1),
(7, '2026_05_09_094049_create_projects_table', 1),
(8, '2026_05_09_094056_create_sprints_table', 1),
(9, '2026_05_09_094103_create_tasks_table', 1),
(10, '2026_05_09_094110_create_webhooks_table', 1),
(11, '2026_05_17_131130_create_comments_table', 2),
(12, '2026_05_21_175242_create_notifications_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('067d26ac-19b2-40b6-b43f-5dc5687db312', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:54:38', '2026-05-23 05:54:38'),
('06fbd5ae-f97f-4418-806d-779422da39a6', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:26:08', '2026-06-04 13:26:08'),
('091474b6-4d16-4ff2-99a6-92cc00cecf3f', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:32:45', '2026-05-24 04:32:45'),
('09633e37-dba1-40fc-b6e7-75ebf5d4fab6', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', '2026-05-23 04:03:28', '2026-05-23 04:02:57', '2026-05-23 04:03:28'),
('0f25fcf2-0a9b-435e-86e6-9698fc768c7d', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:50:10', '2026-05-24 04:50:10'),
('117a11f3-ebbe-41ff-b120-ef12737361a3', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:25:40', '2026-05-24 07:25:40'),
('125f743a-5703-445a-9ffb-b55a87d9dac9', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":7,\"project_id\":1,\"title\":\"hjh\",\"message\":\"URGENT: High priority task created - hjh\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:15:23', '2026-05-23 05:15:23'),
('143bb877-1d82-4f07-a447-9d5581e63387', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:06:11', '2026-05-24 05:06:11'),
('14a877ea-56c9-44e9-a5dc-3e5f0e53afae', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', '2026-06-05 21:33:51', '2026-06-05 06:53:15', '2026-06-05 21:33:51'),
('17560ae9-ecc3-4082-afe8-27079c8f2c19', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:53:53', '2026-05-24 04:53:53'),
('1773c3e7-5f55-4a97-8249-82af3bcb9462', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":7,\"project_id\":\"1\",\"title\":\"hjh\",\"message\":\"URGENT: High priority task created - hjh\",\"type\":\"urgent\"}', '2026-05-21 12:55:01', '2026-05-21 12:54:34', '2026-05-21 12:55:01'),
('197d434e-121e-4f81-bfde-675b43ac4f87', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:34:43', '2026-05-23 05:34:43'),
('207023f7-aec2-4876-8ce7-8332f0b1f39e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:46:04', '2026-05-24 03:46:04'),
('21c67a47-1565-445f-8e44-3316d298821f', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:40:37', '2026-05-24 04:40:37'),
('24e716ef-b526-4dc6-94d7-4027858c090c', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 06:08:49', '2026-05-24 06:08:49'),
('261d7bf3-762a-4a33-8047-b5e048b5b9a8', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:19:37', '2026-06-04 13:19:37'),
('26bc6c25-9a56-49b2-9486-1faface601b3', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:16:54', '2026-05-24 04:16:54'),
('28c48614-3003-43a9-97c6-a7979c7b2f5b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:19:29', '2026-05-23 05:19:29'),
('2a49df39-d4d1-4bcd-bbef-35867ddeaa1b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:51:35', '2026-05-24 03:51:35'),
('2a72c7a1-6a85-4d2e-9f3f-9c46697f719e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:55:46', '2026-05-23 05:55:46'),
('2c11769e-5bcf-4b51-82a9-4ac7658b74fe', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:25:43', '2026-05-23 05:25:43'),
('2ca14a6e-f5c2-45e6-b915-3eb605a46d0f', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:39:38', '2026-05-23 04:39:38'),
('2d9800ed-3191-4212-b694-eeadb81a644b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:40:41', '2026-06-04 12:40:41'),
('2fc0205f-b445-4429-aa53-282b2b97b269', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:26:20', '2026-05-24 03:26:20'),
('3202615b-0dcf-47d6-9cce-d55d91913b5f', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:29:21', '2026-05-24 04:29:21'),
('32d8b8b8-66f4-4821-a1b5-566a6b59ab17', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:31:00', '2026-05-24 03:31:00'),
('38adddf5-b851-42d8-868d-46f21cc9f985', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:06:53', '2026-05-24 05:06:53'),
('3a14f3f1-a0d4-49f6-9759-098c6543e398', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:25:04', '2026-06-04 13:25:04'),
('3bc31487-1e05-44b6-a688-db34d2ae69ec', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:07:37', '2026-05-24 07:07:37'),
('3cab2a32-8375-4abf-9240-20965c687697', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', '2026-06-05 21:33:50', '2026-06-05 06:52:17', '2026-06-05 21:33:50'),
('3cc26a7f-b33f-4ba0-87d0-684149d46a93', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:57:15', '2026-05-23 05:57:15'),
('3d38bbda-6672-4d7e-a112-70246fcffe4b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:39:40', '2026-05-24 03:39:40'),
('42504831-48b3-4d92-adbb-f8e39d88cb32', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-05 06:21:57', '2026-06-05 06:21:57'),
('4544c2e2-5304-4c10-a892-5e2f6da9a0b8', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:53:48', '2026-05-23 04:53:48'),
('48b71308-0338-4f09-884d-a313994a103a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":7,\"project_id\":1,\"title\":\"hjh\",\"message\":\"URGENT: High priority task created - hjh\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:02:22', '2026-06-04 13:02:22'),
('4964c2a9-96d1-4328-924b-f9cdb680089a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":7,\"project_id\":1,\"title\":\"hjh\",\"message\":\"URGENT: High priority task created - hjh\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:05:05', '2026-06-04 13:05:05'),
('4a32cb4d-69dc-41ba-80e1-c9452f44772e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:07:52', '2026-05-23 05:07:52'),
('4aa4c060-8eaf-4863-b628-78c8d22b4b46', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:23:10', '2026-06-04 13:23:10'),
('4eef580d-dc05-4485-b65f-f7685909a4d8', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":7,\"project_id\":1,\"title\":\"hjh\",\"message\":\"URGENT: High priority task created - hjh\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:01:30', '2026-05-23 05:01:30'),
('51337b3c-d5d5-4737-8900-5d281de54972', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:42:57', '2026-05-24 03:42:57'),
('51697e20-d67d-4df0-9428-9b219836b8a9', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:56:37', '2026-05-23 04:56:37'),
('51fa8367-b377-46a8-8e5b-bd0e676c26e6', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:15:08', '2026-05-23 05:15:08'),
('534b4e3a-30ee-4c0e-9caa-967d1a0b0e90', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:53:29', '2026-05-24 04:53:29'),
('546d5c89-4e6f-485b-9f90-4b2277ce5119', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:19:50', '2026-05-23 05:19:50'),
('5a385980-434d-479f-ab25-ef0feff22444', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:26:59', '2026-06-04 13:26:59'),
('5d3e1366-cb0f-4ad1-8408-1c388d71fccb', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', '2026-06-05 21:33:44', '2026-06-05 21:32:20', '2026-06-05 21:33:44'),
('5ef62a74-4df3-4e77-8e2f-5098c2e5a5e7', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', '2026-05-23 04:08:26', '2026-05-23 04:04:04', '2026-05-23 04:08:26'),
('5f0ba010-2a25-4aaf-82a3-1ef833f9a245', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 06:12:12', '2026-05-24 06:12:12'),
('5fd85bd2-3422-435c-bef5-2e98d18a269b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:16:59', '2026-05-24 05:16:59'),
('609e7b70-eef0-40be-b0bd-6bebb4a10c8e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:09:06', '2026-05-24 05:09:06'),
('61fa3322-dd3c-421c-880f-5ad6b699313b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:11:45', '2026-06-04 13:11:45'),
('6348deb5-0ddb-41dd-95fc-96989d00b493', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:53:33', '2026-05-23 04:53:33'),
('64245739-5fd3-463c-8913-7650645bc462', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:45:53', '2026-05-24 05:45:53'),
('65b58401-96c7-48b4-bc2e-860aa3f2137b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:10:36', '2026-06-04 13:10:36'),
('65c3105d-bdc1-430b-8ccb-786a05773cfb', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:46:29', '2026-05-24 03:46:29'),
('67087b42-d14e-47a1-afbd-5023969c7384', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:39:35', '2026-06-04 12:39:35'),
('6734212e-5031-4792-a576-a114bb34b237', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:59:17', '2026-06-04 12:59:17'),
('679050a7-29cf-46c4-aa7f-141bc5ff3bb1', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:45:48', '2026-05-24 03:45:48'),
('6c51e04e-4a43-413c-a471-6767fe437c4b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 06:08:02', '2026-05-24 06:08:02'),
('6ca7fc29-1492-4a27-ad50-31a27b4e86b9', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:28:17', '2026-06-04 12:28:17'),
('6d1af29c-1489-4299-8115-1782481a14ac', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:08:32', '2026-05-24 07:08:32'),
('6fe413cf-18a9-46a6-a9a0-87c2e40c2d4f', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:17:21', '2026-05-23 05:17:21'),
('7109fc79-1b1a-4e2f-bfc7-106da971a76b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:25:29', '2026-05-23 05:25:29'),
('7171fb2a-b659-4863-812d-17a9484f3a10', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:29:29', '2026-05-23 05:29:29'),
('75666df3-c0c6-453a-a5bc-64129b329504', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:57:07', '2026-05-24 04:57:07'),
('75cc8cdd-d846-4c63-9058-0cc2987db8c0', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 06:11:29', '2026-05-24 06:11:29'),
('7623bc4f-551c-438a-a606-60788774fb8c', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 06:07:43', '2026-05-24 06:07:43'),
('7646d43e-90e5-45fa-9bb6-001f77766484', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:28:06', '2026-05-24 04:28:06'),
('79dfa220-26de-4f0b-9560-9e8fc5da1808', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:14:38', '2026-05-23 05:14:38'),
('7af3f0ce-f60f-46e2-9a70-60834f93bcb0', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:56:28', '2026-05-24 04:56:28'),
('7cf0318a-70a3-49d3-b288-c17ce19c9fa2', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":7,\"project_id\":1,\"title\":\"hjh\",\"message\":\"URGENT: High priority task created - hjh\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:19:05', '2026-05-23 05:19:05'),
('7d79988d-01d7-4b82-90d3-e491b335c11e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:25:02', '2026-05-24 03:25:02'),
('805723e7-dad4-494a-84a9-dee0ed9f3ccd', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:34:48', '2026-05-23 05:34:48'),
('81bf4753-e764-424e-8f35-34d695e4a96b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 06:08:08', '2026-05-24 06:08:08'),
('85d1c993-a56d-41e9-917a-38c59fc63c8a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:43:16', '2026-05-24 03:43:16'),
('8927f510-dfa1-41b1-a841-5f7eb24bf05e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:16:12', '2026-05-23 05:16:12'),
('8a0cc7e5-18c3-4cb9-8cb8-3d4229a03e6a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:28:54', '2026-05-24 07:28:54'),
('8b9670a5-d939-428e-b62f-aeb19b90c80f', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:28:00', '2026-05-24 07:28:00'),
('8c8cdc5d-dd77-47dc-bf29-192bb68a6c2c', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:01:32', '2026-06-04 13:01:32'),
('8e3cb994-48a3-4653-b096-4789d670485e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:25:56', '2026-05-24 04:25:56'),
('8f065524-7ef5-4fb8-a985-1de3a6e99034', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:15:15', '2026-05-23 05:15:15'),
('907137d5-5fdd-4db9-803d-cf27a379e85a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:55:12', '2026-06-04 12:55:12'),
('91361613-4171-49a9-af1c-a83b1f697af6', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:23:25', '2026-06-04 13:23:25'),
('914834cc-5f6d-439a-b2f9-720f9c04307c', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:08:20', '2026-05-24 07:08:20'),
('914b79c1-cd93-4602-b924-4efc7ce6c362', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:16:24', '2026-05-24 05:16:24'),
('92ce38ce-9096-49ae-bf99-202660d92bf1', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-05 06:43:27', '2026-06-05 06:43:27'),
('98f4a2de-42f2-4139-803a-f303278b6bfc', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:56:17', '2026-05-24 04:56:17'),
('995fba76-7d1e-484e-b981-09574ab917da', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:56:50', '2026-05-23 05:56:50'),
('9a87387c-9816-4e16-bdde-a3ed85ec5791', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:16:43', '2026-05-24 04:16:43'),
('a0c4dfed-d0d7-46cb-806c-209b51acd000', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:34:50', '2026-05-23 05:34:50'),
('a0d1c8b3-1b56-4b0c-a9ba-607eb99727cd', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:15:18', '2026-05-23 05:15:18'),
('a10f52dd-1bb3-47c1-98b6-37bd4f460415', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:27:12', '2026-05-24 03:27:12'),
('a24d5e02-31b3-440d-bc62-eefdb219cf96', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:26:49', '2026-05-24 03:26:49'),
('a4080984-f004-4f62-b1c3-a456d21319ad', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:05:51', '2026-05-24 05:05:51'),
('a5fb8ccb-6ddd-4d55-91da-386c5f5ee4ca', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:53:39', '2026-05-24 04:53:39'),
('a6fb85ae-4d59-4f47-872d-819d344ddbd2', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:41:30', '2026-05-23 05:41:30'),
('a7309e5d-ea42-4050-9ba3-238714fe2c7e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:42:09', '2026-05-24 04:42:09'),
('a785e96b-e115-402e-9e86-e37938841c8d', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:10:26', '2026-05-23 05:10:26'),
('a8b8d7c3-21f6-49c1-9706-1e8686f93548', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:51:26', '2026-05-23 05:51:26'),
('a9cf0b4b-0b49-4cf1-a41b-5fa7fc7d7424', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:26:03', '2026-05-23 05:26:03'),
('ab5ec306-b34b-45f5-babe-c2f2291d46c8', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:05:42', '2026-06-04 13:05:42'),
('abca6847-623c-495c-b494-9175b5bc6a80', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 13:22:07', '2026-06-04 13:22:07'),
('afd16609-94e7-40e2-9ed7-5b6158b22497', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:32:53', '2026-05-23 05:32:53'),
('b4a03bce-31f0-4d94-9f3f-366476751b72', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:35:14', '2026-05-23 05:35:14'),
('b728c4b9-616a-40f1-a542-400b9fa53f91', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:45:53', '2026-05-24 03:45:53'),
('b7927497-fede-49ac-a26a-8a03895e2619', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:54:42', '2026-05-23 04:54:42'),
('be99481d-2bc7-477b-9255-c24a259e6e0b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:20:21', '2026-06-04 12:20:21'),
('c3b824f0-b0c9-4adb-b3ac-a6c7981745ba', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 06:01:34', '2026-05-23 06:01:34'),
('c6d22bdc-fe85-4600-8898-ef066c6452a2', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', '2026-06-05 21:33:48', '2026-06-05 06:56:23', '2026-06-05 21:33:48'),
('c7c781f8-31c1-4fd6-afb2-abfbc0a1115b', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-05 06:19:33', '2026-06-05 06:19:33'),
('c83feb2e-0c94-44cb-ba7e-81251ba759ac', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 06:07:39', '2026-05-24 06:07:39'),
('c9119750-9cf2-46e6-a101-26dff2b7527e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:38:27', '2026-06-04 12:38:27'),
('ca02e474-9d84-499c-960d-f3339c07a8d6', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:50:21', '2026-05-24 04:50:21'),
('d12a2e3e-ef74-46b5-a5f4-b3ab5c90af1e', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:45:37', '2026-05-24 03:45:37'),
('d5180cb3-4a91-4f92-b7ba-10e1d19b6ad7', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:25:40', '2026-05-23 05:25:40'),
('d5ae66a1-5830-4f41-b93c-234c800d522c', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:14:33', '2026-05-23 05:14:33'),
('d69d2048-fecf-46cb-bbd4-dc40116442fc', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:23:18', '2026-05-23 05:23:18'),
('da59790d-d03f-4ced-83d6-eb1fe9399008', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:11:33', '2026-05-24 04:11:33'),
('e04d11b5-3af9-402d-b167-45098b6b1305', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:39:35', '2026-05-23 04:39:35'),
('e25c9fc1-05fc-4830-9db4-3a270a68a279', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":7,\"project_id\":1,\"title\":\"hjh\",\"message\":\"URGENT: High priority task created - hjh\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:10:28', '2026-05-23 05:10:28'),
('e2632c87-ab5f-4ed3-b999-3610cd8716d3', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:45:31', '2026-05-23 04:45:31'),
('e29868a9-5d79-42d5-a8c2-23c200fa2b08', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-06-04 12:11:50', '2026-06-04 12:11:50'),
('e2b781be-37bf-4a3a-b744-012f606b84f1', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:07:18', '2026-05-24 07:07:18'),
('e2e97a6f-8e3e-4e8a-9483-24d9b06467a1', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 04:39:40', '2026-05-23 04:39:40'),
('e451a0c8-4edf-4135-9949-adcecb24d825', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:10:57', '2026-05-24 04:10:57'),
('e5a408a6-6c5c-484d-bc62-58424c7ee0fe', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', '2026-05-23 04:08:28', '2026-05-23 04:03:38', '2026-05-23 04:08:28'),
('e6b43678-6a4d-41f5-bba5-89abfb066223', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:46:02', '2026-05-24 03:46:02'),
('ea45f687-3b2f-4c86-a5c6-f4daa876ffe9', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:53:44', '2026-05-24 04:53:44'),
('ea8e9670-4fa2-4a16-9bcc-e51d7c1cec86', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":3,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 05:49:49', '2026-05-23 05:49:49'),
('ee2dec4e-a48d-43fd-b83a-b3865f529e33', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:39:34', '2026-05-24 03:39:34'),
('ee874604-019e-40a5-be0f-132507834c99', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:06:48', '2026-05-24 05:06:48'),
('ef9cc28f-b03b-43d4-8552-13d23935d30a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-23 06:01:53', '2026-05-23 06:01:53'),
('f1ca72be-21cd-4480-b6c6-c270a688af59', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:45:34', '2026-05-24 05:45:34'),
('f341d05c-4e86-4512-892c-f19daeb6792f', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 05:17:37', '2026-05-24 05:17:37'),
('f52c8b08-c9a6-4ba8-b2c6-0161e90f9a0a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:45:29', '2026-05-24 03:45:29'),
('f7ba6db6-0ef2-466e-934b-b1c006588b5a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:41:56', '2026-05-24 04:41:56'),
('fba02f26-7754-4e61-ac7b-5851ee1e31a4', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:56:13', '2026-05-24 04:56:13');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('fc50ed35-c24d-4ffe-93aa-6c398a381ea9', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 04:26:17', '2026-05-24 04:26:17'),
('fdebae56-9466-4d98-b0f8-4fa103176d08', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":2,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 03:25:03', '2026-05-24 03:25:03'),
('fe4bb82e-b649-4d81-9a4d-9f43a5c4042a', 'App\\Notifications\\TaskActivityNotification', 'App\\Models\\User', 1, '{\"task_id\":1,\"project_id\":1,\"title\":\"Design Brass Lighting Marketing Banner\",\"message\":\"URGENT: High priority task created - Design Brass Lighting Marketing Banner\",\"type\":\"urgent\"}', NULL, '2026-05-24 07:25:20', '2026-05-24 07:25:20');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '98e8493fc1a7862f6ccca47165da192de8305582807e7a30b291c501f00e32e1', '[\"*\"]', '2026-05-09 12:15:11', NULL, '2026-05-09 05:31:54', '2026-05-09 12:15:11'),
(2, 'App\\Models\\User', 1, 'auth_token', '1346103ad391433b8566a377bca8777264f6448de0fb01aa51afcc967d1c49f5', '[\"*\"]', '2026-06-05 22:03:38', NULL, '2026-05-10 04:27:07', '2026-06-05 22:03:38'),
(3, 'App\\Models\\User', 1, 'auth_token', '5aced50a7ddf6af018a55b86455e4c19bd185ccd88240e5126c1a3512a47f7d6', '[\"*\"]', '2026-05-19 20:27:51', NULL, '2026-05-19 20:24:03', '2026-05-19 20:27:51'),
(4, 'App\\Models\\User', 1, 'auth_token', 'ddca9996e39e9747ede2a7cd482c455ed583266d77c7a098b23832c540b11a10', '[\"*\"]', '2026-05-23 20:58:07', NULL, '2026-05-23 05:28:50', '2026-05-23 20:58:07'),
(5, 'App\\Models\\User', 1, 'auth_token', '679d72a96ae8144403b3d905ed572639891f35b72b8e451290ec526abfa17846', '[\"*\"]', '2026-05-24 06:07:12', NULL, '2026-05-24 03:25:54', '2026-05-24 06:07:12'),
(6, 'App\\Models\\User', 1, 'auth_token', '9957a5426c3f9d21fcb9c0aa3515263b12e76d52f3380955cdcf41cc19a39416', '[\"*\"]', '2026-06-04 13:27:13', NULL, '2026-06-04 12:11:08', '2026-06-04 13:27:13'),
(7, 'App\\Models\\User', 1, 'auth_token', '0c24364a7a0ab9b0d01680d1bfc05deaffc1facfbaecfe0b1546a3cc3f37b448', '[\"*\"]', '2026-06-05 07:07:18', NULL, '2026-06-05 06:17:49', '2026-06-05 07:07:18');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `budget` decimal(15,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `tenant_id`, `title`, `category`, `status`, `budget`, `deadline`, `created_at`, `updated_at`) VALUES
(1, 1, 'Summer Collection Launch', 'marketing', 'active', 50000.00, '2026-06-15', '2026-05-09 05:32:43', '2026-05-09 05:32:43'),
(2, 1, 'Accukoint', 'Logistics', 'active', 5000.00, '2026-05-15', '2026-05-10 06:44:18', '2026-05-10 06:44:18'),
(3, 1, 'Accukount', 'Logistics', 'active', 1200.00, '2026-05-15', '2026-05-10 06:47:20', '2026-05-10 06:47:20');

-- --------------------------------------------------------

--
-- Table structure for table `sprints`
--

CREATE TABLE `sprints` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sprints`
--

INSERT INTO `sprints` (`id`, `tenant_id`, `project_id`, `name`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Sprint 1: Banner Design & Ad Copy', '2026-05-11', '2026-05-25', '2026-05-09 11:58:57', '2026-05-09 11:58:57'),
(3, 1, 3, '10-15 May complete website', '2026-05-01', '2026-05-15', '2026-05-10 07:44:39', '2026-05-10 07:44:39'),
(4, 1, 1, 'Complete Installing', '2026-06-06', '2026-06-18', '2026-06-05 21:35:32', '2026-06-05 21:35:32');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `sprint_id` bigint(20) UNSIGNED DEFAULT NULL,
  `assignee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` varchar(255) NOT NULL DEFAULT 'medium',
  `status` varchar(255) NOT NULL DEFAULT 'todo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `tenant_id`, `project_id`, `sprint_id`, `assignee_id`, `title`, `description`, `priority`, `status`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 1, 1, 'Design Brass Lighting Marketing Banner', 'Create a 1200x600 banner for the new brass lighting stock.', 'high', 'todo', '2026-05-09 12:13:04', '2026-06-05 21:32:14'),
(3, 1, 1, 1, 1, 'Design Brass Lighting Marketing Banner', 'Create a 1200x600 banner for the new brass lighting stock.', 'high', 'done', '2026-05-09 12:15:11', '2026-06-05 06:53:15'),
(4, 1, 3, 3, 3, 'AI Prompt Home page', 'AI Prompt Home page', 'medium', 'done', '2026-05-10 08:04:25', '2026-05-17 06:36:57'),
(6, 1, 1, 1, 1, 'sh', NULL, 'medium', 'done', '2026-05-21 12:50:15', '2026-06-04 13:12:49'),
(8, 1, 1, 4, NULL, 'Install on tanishq showroom', NULL, 'medium', 'in_progress', '2026-06-05 21:36:10', '2026-06-05 21:37:22');

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`id`, `name`, `slug`, `settings`, `created_at`, `updated_at`) VALUES
(1, 'Shiva Fashion', 'shiva-fashion-Qwqz', NULL, '2026-05-09 05:31:54', '2026-05-09 05:31:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'employee',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `tenant_id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 1, 'Shivam', 'sv70912@gmail.com', NULL, '$2y$10$ADVuJlG3MY0TNOHMtleJu.CWhlOUm4aXb2UTEOf.fTnmtoHHVsaKK', 'admin', NULL, '2026-05-09 05:31:54', '2026-05-09 05:31:54'),
(2, 1, 'Rahul (Tailor)', 'rahul@shivafashion.com', NULL, '$2y$10$A3eDH8BRl6j8z0Erk1SJCeAjXvurZoB5uaTS6GDRxKrY3IrhYWNdS', 'employee', NULL, '2026-05-09 07:40:37', '2026-05-09 07:40:37'),
(3, 1, 'aniket sungh', 'ani@gmail.co', NULL, '$2y$10$PFxrb1wrY8X2V5oiD.ccVuDhn8gidrYb87EFE.CiJrT4q4WabheZC', 'employee', NULL, '2026-05-10 12:06:18', '2026-05-10 12:06:18');

-- --------------------------------------------------------

--
-- Table structure for table `webhooks`
--

CREATE TABLE `webhooks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tenant_id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `event_type` varchar(255) NOT NULL,
  `secret` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_task_id_foreign` (`task_id`),
  ADD KEY `comments_user_id_foreign` (`user_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `1` (`tenant_id`),
  ADD KEY `projects_category_index` (`category`),
  ADD KEY `projects_status_index` (`status`);

--
-- Indexes for table `sprints`
--
ALTER TABLE `sprints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sprints_tenant_id_foreign` (`tenant_id`),
  ADD KEY `sprints_project_id_foreign` (`project_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_tenant_id_foreign` (`tenant_id`),
  ADD KEY `tasks_project_id_foreign` (`project_id`),
  ADD KEY `tasks_sprint_id_foreign` (`sprint_id`),
  ADD KEY `tasks_assignee_id_foreign` (`assignee_id`),
  ADD KEY `tasks_priority_index` (`priority`),
  ADD KEY `tasks_status_index` (`status`);

--
-- Indexes for table `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tenants_slug_unique` (`slug`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_tenant_id_foreign` (`tenant_id`),
  ADD KEY `users_role_index` (`role`);

--
-- Indexes for table `webhooks`
--
ALTER TABLE `webhooks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `webhooks_tenant_id_foreign` (`tenant_id`),
  ADD KEY `webhooks_event_type_index` (`event_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sprints`
--
ALTER TABLE `sprints`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tenants`
--
ALTER TABLE `tenants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `webhooks`
--
ALTER TABLE `webhooks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sprints`
--
ALTER TABLE `sprints`
  ADD CONSTRAINT `sprints_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sprints_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_assignee_id_foreign` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `tasks_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_sprint_id_foreign` FOREIGN KEY (`sprint_id`) REFERENCES `sprints` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `tasks_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `webhooks`
--
ALTER TABLE `webhooks`
  ADD CONSTRAINT `webhooks_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
