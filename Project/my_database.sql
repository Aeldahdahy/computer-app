-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2025 at 10:21 AM
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
  `excuse_data` text DEFAULT NULL,
  `remarks` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `student_id` int(14) NOT NULL
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

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`class_id`, `scheduled_time`, `room_number`, `course_id`, `teacher_id`) VALUES
(2, '1-2', '206', 1, 172629),
(3, '3-4', '206', 1, 172629);

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

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `course_name`, `credits`, `department_id`) VALUES
(1, 'Introduction to Programming', 3, 1),
(2, 'Web Programming', 3, 1),
(3, 'Advanced Programming', 3, 1),
(4, 'Networks & Security', 3, 1),
(5, 'Organzational Analysis & Design', 3, 4),
(6, 'Computer Applications In Business', 3, 1),
(7, 'Human Computer Interaction', 3, 1),
(8, 'Human Resources Mgt.', 3, 4),
(9, 'Financial Management', 3, 4),
(10, 'Research Methodolgy', 3, 4),
(11, 'Production & Operations', 3, 4);

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
(1, 'BIS', 'Dr. Nrmeen Magdy'),
(4, 'Marketing', 'Dr. Marwa Tarek'),
(5, 'Digital and Sustainable Business Economics', 'Dr. Ahmed Samir'),
(6, 'BIS', 'Dr Nrmeen');

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
(172629, 'Taha Elrajel', '$2b$10$hwIkZVyKXbe2QeiNRvjvN.jfojWZxY12Eemp90zQ3GkoX8RERIcTy', 'Teacher', 'tahaelrajel8@gmail.com', 172629),
(221928, 'radwan', '$2b$10$rWypM6QbD9eX8gq8Yzlj3ONJusPJHXRYFmAamOWMRnl6wKOEfTqH6', 'Admin', 'radwanelprence@gmail.com', NULL),
(405140, 'youssef ismail', '$2b$10$fdNjeepqd.YJX57Uo3rfy.Z6uZvC8WS9EU6acBmGNRNR/gyxi54Qa', 'Admin', 'joe@gmail.com', NULL),
(428005, 'Abdelrahman Afifi', '$2b$10$In/uRBAjDZartbPmV8wE8.0NDR43OdeKpO/gcR5TLdSDJYE2MZHC.', 'Teacher', 'tabdelrahman49@yahoo.com', 428005),
(469987, 'Seif Elkady', '$2b$10$ozYgRmFd5Uh.RRPa0CtuXOk5joOEssZ53K.aWzl6I4Ylx3IQXIndW', 'Admin', 'seif.kady@yahoo.com', NULL),
(540633, 'Mohamed Tarek', '$2b$10$8PjISzPliWENL1wPyN6lSuoJ73twOky2lRdYDjTrnZW9g9hzKx.LC', 'Teacher', 'motarek@gmail.com', 540633),
(642508, 'Nadeem Khaled', '$2b$10$BSgMw1iRqi96VnpjaMFWTux5Ri6Bq6bea4ns3x9DPFBYeH9hSxl9q', 'Moderator', 'Nadeemkhaledd@gmail.com', NULL),
(759388, 'Abdelrahman magdy', '$2b$10$oAM9/.bDuZuqmq.X3hXel.Y394oFF1nMp3DkDYguWqbJFDbOeaCkG', 'Moderator', 'abdelrahman@gmail.com', NULL);

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
  `phone_number` varchar(13) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `status` enum('Under Graduate','Graduate') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `fname`, `lname`, `email`, `password`, `dob`, `phone_number`, `department_id`, `status`) VALUES
(250205057, 'Taha', 'Elrajel', 'tahaelrajel8@gmail.com', '$2b$10$/1TzzjQM/SR3k.5qmP4ABeqBtdJQ7DtCNqLyIqupRAjfaO/IYMgw2', '2002-05-05', '+201142903857', 1, 'Under Graduate'),
(250301187, 'Abdelrahman', 'Tarek', 'a.eldahdahy@outlook.com', '$2b$10$DuUpzjjMiJ0KHT3jeHBf.uJmgiYr3pTQkUcRRLG4naQ2Mfubl7PFu', '2003-01-18', '+201018677727', 1, 'Under Graduate');

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
  `phone_number` varchar(13) NOT NULL,
  `status` enum('Full Time','Part Time') DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `fname`, `lname`, `email`, `password`, `phone_number`, `status`, `department_id`) VALUES
(172629, 'Taha', 'Elrajel', 'tahaelrajel7@gmail.com', '$2b$10$hwIkZVyKXbe2QeiNRvjvN.jfojWZxY12Eemp90zQ3GkoX8RERIcTy', '+201003827626', 'Full Time', 1),
(428005, 'Abdelrahman', 'Afifi', 'tabdelrahman49@yahoo.com', '$2b$10$In/uRBAjDZartbPmV8wE8.0NDR43OdeKpO/gcR5TLdSDJYE2MZHC.', '+201018677727', 'Full Time', 1),
(540633, 'Mohamed', 'Tarek', 'motarek@gmail.com', '12345678', '+201224004887', 'Part Time', 1);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_course`
--

CREATE TABLE `teacher_course` (
  `teacher_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher_course`
--

INSERT INTO `teacher_course` (`teacher_id`, `course_id`) VALUES
(172629, 3),
(428005, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `class_attandence_FK` (`class_id`),
  ADD KEY `student_attandence_FK` (`student_id`);

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
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `class_attandence_FK` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`),
  ADD CONSTRAINT `student_attandence_FK` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

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
