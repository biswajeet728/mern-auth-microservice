CREATE TABLE `refresh_tokens` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`token` varchar(100) NOT NULL,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`username` varchar(60) NOT NULL,
	`email` varchar(30) NOT NULL,
	`password` varchar(60) NOT NULL,
	`image` text DEFAULT NULL,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;