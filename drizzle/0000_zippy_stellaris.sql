CREATE TABLE `payerEnrollments` (
	`id` varchar(255) NOT NULL,
	`providerId` varchar(255) NOT NULL,
	`payerName` varchar(255) NOT NULL,
	`status` enum('active','pending','inactive') NOT NULL DEFAULT 'pending',
	`enrollmentDate` varchar(20) NOT NULL DEFAULT '',
	`contractEnd` varchar(20) NOT NULL DEFAULT '',
	`nextCredentialing` varchar(20) NOT NULL DEFAULT '',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payerEnrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `practiceLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` varchar(255) NOT NULL,
	`type` enum('primary','secondary') NOT NULL,
	`name` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `practiceLocations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`credential` varchar(50) NOT NULL,
	`npi` varchar(20) NOT NULL,
	`license` varchar(100) NOT NULL DEFAULT '',
	`licenseExpiration` varchar(20) NOT NULL DEFAULT '',
	`specialty` varchar(100) NOT NULL,
	`status` enum('active','pending','inactive') NOT NULL DEFAULT 'pending',
	`flagged` boolean NOT NULL DEFAULT false,
	`nextCredentialing` varchar(20) NOT NULL DEFAULT '',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
