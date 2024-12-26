-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2024 at 02:24 AM
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
-- Database: `my_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('Attendaned','Absence','Excuse') NOT NULL,
  `remarks` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `class_id` int(11) NOT NULL,
  `scheduled_time` varchar(255) NOT NULL,
  `room_number` varchar(255) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `class_student`
--

CREATE TABLE `class_student` (
  `class_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` int(11) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `credits` int(11) NOT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(255) NOT NULL,
  `department_head` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`department_id`, `department_name`, `department_head`) VALUES
(1, 'BIS', 'Dr Nrmeen');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Moderator','Teacher') NOT NULL,
  `email` varchar(255) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `user_name`, `password`, `role`, `email`, `teacher_id`) VALUES
(1, 'Abdelrahman', '$2b$10$qnYvNmh6dDV0tmStm/2rk.DWshDm7PFF7zLE7aHMr74FvW1XQDB/m', 'Admin', 'a.eldahdahy@outlook.com', NULL),
(221928, 'radwan', '$2b$10$rWypM6QbD9eX8gq8Yzlj3ONJusPJHXRYFmAamOWMRnl6wKOEfTqH6', 'Admin', 'radwan@gmail.com', NULL),
(368567, 'bob', '$2b$10$1AqE/n0ROExwtan81JXTGOR2dXPSJYbHFzi84Nwz2Zjcshf733B.6', 'Moderator', 'tabdelrahman48@yahoo.com', NULL),
(428005, 'Abdelrahman Afifi', '$2b$10$In/uRBAjDZartbPmV8wE8.0NDR43OdeKpO/gcR5TLdSDJYE2MZHC.', 'Teacher', 'tabdelrahman49@yahoo.com', 428005);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `full_name` varchar(200) GENERATED ALWAYS AS (concat(`fname`,' ',`lname`)) STORED,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `phone_number` int(14) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `status` enum('Under Graduate','Graduate') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_course`
--

CREATE TABLE `student_course` (
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `teacher_id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `full_name` varchar(200) GENERATED ALWAYS AS (concat(`fname`,' ',`lname`)) STORED,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` int(14) NOT NULL,
  `status` enum('Full Time','Part Time') DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `fname`, `lname`, `email`, `password`, `phone_number`, `status`, `department_id`) VALUES
(428005, 'Abdelrahman', 'Afifi', 'tabdelrahman49@yahoo.com', '$2b$10$In/uRBAjDZartbPmV8wE8.0NDR43OdeKpO/gcR5TLdSDJYE2MZHC.', 0, 'Full Time', 1);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_course`
--

CREATE TABLE `teacher_course` (
  `teacher_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_id`),
  ADD KEY `course_class_fk` (`course_id`),
  ADD KEY `teacher_class_fk` (`teacher_id`);

--
-- Indexes for table `class_student`
--
ALTER TABLE `class_student`
  ADD PRIMARY KEY (`class_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `department_course_fk` (`department_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `teacher_staff_fk` (`teacher_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_student_fk` (`department_id`);

--
-- Indexes for table `student_course`
--
ALTER TABLE `student_course`
  ADD PRIMARY KEY (`student_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`teacher_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `teacher_department` (`department_id`);

--
-- Indexes for table `teacher_course`
--
ALTER TABLE `teacher_course`
  ADD PRIMARY KEY (`teacher_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `course_class_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  ADD CONSTRAINT `teacher_class_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`);

--
-- Constraints for table `class_student`
--
ALTER TABLE `class_student`
  ADD CONSTRAINT `class_student_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `class_student_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `department_course_fk` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `teacher_staff_fk` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `department_student_fk` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`);

--
-- Constraints for table `student_course`
--
ALTER TABLE `student_course`
  ADD CONSTRAINT `student_course_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_course_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `teacher_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`);

--
-- Constraints for table `teacher_course`
--
ALTER TABLE `teacher_course`
  ADD CONSTRAINT `teacher_course_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `teacher_course_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
