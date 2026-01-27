-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('SUPER_ADMIN', 'SOCIETY_ADMIN', 'SOCIETY_SECRETARY', 'STAFF', 'TECHNICIAN', 'WATCHMAN', 'HOUSE_OWNER', 'SOCIETY_MEMBER', 'VISITOR', 'TENANT', 'RESIDENT') NOT NULL DEFAULT 'VISITOR',
    `profilePicture` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `societyId` VARCHAR(191) NULL,
    `buildingId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otps` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `sentTo` VARCHAR(191) NOT NULL,
    `type` ENUM('EMAIL', 'PHONE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `societies` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `qr_image_url` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_qr` (
    `id` VARCHAR(191) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `qrString` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `payment_qr_societyId_idx`(`societyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `society_admins` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,
    `societyName` VARCHAR(191) NOT NULL,
    `totalFlats` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `society_admins_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buildings` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `numberOfFloors` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flats` (
    `id` VARCHAR(191) NOT NULL,
    `flatNumber` VARCHAR(191) NOT NULL,
    `areaSqFt` INTEGER NOT NULL,
    `bedrooms` INTEGER NOT NULL,
    `isOccupied` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `buildingId` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NULL,
    `residentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitors` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `vehicleNumber` VARCHAR(191) NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `checkInTime` DATETIME(3) NULL,
    `checkOutTime` DATETIME(3) NULL,
    `gatePassId` VARCHAR(191) NULL,
    `securityCheckNotes` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `visitingFlatId` VARCHAR(191) NOT NULL,
    `preApprovedByUserId` VARCHAR(191) NOT NULL,
    `qrCodeToken` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CHECKED_IN', 'CHECKED_OUT') NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `visitors_qrCodeToken_key`(`qrCodeToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complaints` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'IN_PROGRESS', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('PLUMBING', 'ELECTRICAL', 'CLEANING', 'SECURITY', 'OTHER') NOT NULL DEFAULT 'OTHER',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('BOOKED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'BOOKED',
    `facility` ENUM('GYM', 'SWIMMING_POOL', 'CLUBHOUSE', 'BANQUET_HALL') NOT NULL,
    `reason` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notices` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `postedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `postedBy` VARCHAR(191) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenses` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendors` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_logs` (
    `id` VARCHAR(191) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `entryTime` DATETIME(3) NULL,
    `exitTime` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `polls` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `options` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rsvps` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `response` ENUM('GOING', 'NOT_GOING', 'MAYBE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emergency_contacts` (
    `userId` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pending_admins` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `apartmentName` VARCHAR(191) NOT NULL,
    `totalFlats` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'QUOTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `registrationNumber` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `quotedAmount` DOUBLE NULL,
    `appliedByUserId` VARCHAR(191) NULL,

    UNIQUE INDEX `pending_admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pending_access` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,
    `requestedRole` ENUM('SUPER_ADMIN', 'SOCIETY_ADMIN', 'SOCIETY_SECRETARY', 'STAFF', 'TECHNICIAN', 'WATCHMAN', 'HOUSE_OWNER', 'SOCIETY_MEMBER', 'VISITOR', 'TENANT', 'RESIDENT') NOT NULL DEFAULT 'HOUSE_OWNER',
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'QUOTED') NOT NULL DEFAULT 'PENDING',
    `buildingId` VARCHAR(191) NULL,
    `flatId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,

    UNIQUE INDEX `pending_access_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `type` ENUM('INCOME', 'EXPENSE') NOT NULL,
    `category` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `transaction_date` DATETIME(3) NOT NULL,
    `payment_method` ENUM('CASH', 'UPI', 'CHEQUE', 'BANK_TRANSFER', 'ONLINE_PAYMENT') NULL,
    `bank_name` VARCHAR(191) NULL,
    `ifsc_code` VARCHAR(191) NULL,
    `transaction_id` VARCHAR(191) NULL,
    `upi_id` VARCHAR(191) NULL,
    `cheque_number` VARCHAR(191) NULL,
    `payer_name` VARCHAR(191) NULL,
    `flat_number` VARCHAR(191) NULL,
    `for_month` VARCHAR(191) NULL,
    `paid_status` BOOLEAN NULL DEFAULT true,
    `is_approved` BOOLEAN NOT NULL DEFAULT false,
    `approvedBy` VARCHAR(191) NULL,
    `approvedAt` DATETIME(3) NULL,
    `flatId` VARCHAR(191) NULL,
    `recorder_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_logs` (
    `id` VARCHAR(191) NOT NULL,
    `rz_order_id` VARCHAR(191) NOT NULL,
    `rz_payment_id` VARCHAR(191) NULL,
    `rz_signature` VARCHAR(191) NULL,
    `status` ENUM('CREATED', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'CREATED',
    `amount` INTEGER NOT NULL,
    `amount_display` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pending_admin_id` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_logs_rz_order_id_key`(`rz_order_id`),
    UNIQUE INDEX `payment_logs_rz_payment_id_key`(`rz_payment_id`),
    INDEX `payment_logs_userId_idx`(`userId`),
    INDEX `payment_logs_pending_admin_id_idx`(`pending_admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Staff` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `salary` INTEGER NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `staffRole` ENUM('ACTIVE', 'NON_ACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staff_id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `checkIn` VARCHAR(191) NOT NULL,
    `checkOut` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leave` (
    `id` VARCHAR(191) NOT NULL,
    `fromDate` DATETIME(3) NOT NULL,
    `toDate` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `leaveType` VARCHAR(191) NOT NULL,
    `totalDays` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `staffId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leaveRequest` (
    `id` VARCHAR(191) NOT NULL,
    `fromDate` DATETIME(3) NOT NULL,
    `toDate` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `leaveType` VARCHAR(191) NOT NULL,
    `totalDays` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `staffId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salary` (
    `id` VARCHAR(191) NOT NULL,
    `staff_id` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `payDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shift` (
    `id` VARCHAR(191) NOT NULL,
    `staffId` VARCHAR(191) NOT NULL,
    `shiftType` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShiftTask` (
    `id` VARCHAR(191) NOT NULL,
    `staffName` VARCHAR(191) NOT NULL,
    `shiftTime` VARCHAR(191) NOT NULL,
    `task` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarqueeNotice` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `societyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryLog` (
    `id` VARCHAR(191) NOT NULL,
    `personType` ENUM('RESIDENT', 'VISITOR', 'VENDOR') NOT NULL,
    `personName` VARCHAR(191) NOT NULL,
    `vehicleNumber` VARCHAR(191) NULL,
    `inTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `outTime` DATETIME(3) NULL,
    `societyId` VARCHAR(191) NOT NULL,
    `watchmanId` VARCHAR(191) NOT NULL,

    INDEX `EntryLog_societyId_inTime_idx`(`societyId`, `inTime`),
    INDEX `EntryLog_outTime_idx`(`outTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `buildings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otps` ADD CONSTRAINT `otps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_qr` ADD CONSTRAINT `payment_qr_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `society_admins` ADD CONSTRAINT `society_admins_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `society_admins` ADD CONSTRAINT `society_admins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buildings` ADD CONSTRAINT `buildings_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flats` ADD CONSTRAINT `flats_buildingId_fkey` FOREIGN KEY (`buildingId`) REFERENCES `buildings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flats` ADD CONSTRAINT `flats_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flats` ADD CONSTRAINT `flats_residentId_fkey` FOREIGN KEY (`residentId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visitors` ADD CONSTRAINT `visitors_preApprovedByUserId_fkey` FOREIGN KEY (`preApprovedByUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visitors` ADD CONSTRAINT `visitors_visitingFlatId_fkey` FOREIGN KEY (`visitingFlatId`) REFERENCES `flats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notices` ADD CONSTRAINT `notices_postedBy_fkey` FOREIGN KEY (`postedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notices` ADD CONSTRAINT `notices_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendor_logs` ADD CONSTRAINT `vendor_logs_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `polls` ADD CONSTRAINT `polls_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rsvps` ADD CONSTRAINT `rsvps_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rsvps` ADD CONSTRAINT `rsvps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emergency_contacts` ADD CONSTRAINT `emergency_contacts_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emergency_contacts` ADD CONSTRAINT `emergency_contacts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pending_admins` ADD CONSTRAINT `pending_admins_appliedByUserId_fkey` FOREIGN KEY (`appliedByUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pending_access` ADD CONSTRAINT `pending_access_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pending_access` ADD CONSTRAINT `pending_access_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_flatId_fkey` FOREIGN KEY (`flatId`) REFERENCES `flats`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_recorder_id_fkey` FOREIGN KEY (`recorder_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_logs` ADD CONSTRAINT `payment_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_logs` ADD CONSTRAINT `payment_logs_pending_admin_id_fkey` FOREIGN KEY (`pending_admin_id`) REFERENCES `pending_admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leaveRequest` ADD CONSTRAINT `leaveRequest_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salary` ADD CONSTRAINT `Salary_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarqueeNotice` ADD CONSTRAINT `MarqueeNotice_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryLog` ADD CONSTRAINT `EntryLog_societyId_fkey` FOREIGN KEY (`societyId`) REFERENCES `societies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryLog` ADD CONSTRAINT `EntryLog_watchmanId_fkey` FOREIGN KEY (`watchmanId`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
