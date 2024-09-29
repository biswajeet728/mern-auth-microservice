CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(60) NOT NULL,
	`email` varchar(30) NOT NULL,
	`password` varchar(60) NOT NULL,
	`image` text DEFAULT NULL,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
