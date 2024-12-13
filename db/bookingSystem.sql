-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 13, 2024 at 12:49 PM
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
-- Database: `bookingSystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_booking`
--

CREATE TABLE `tb_booking` (
  `id` int(11) NOT NULL,
  `bookName` varchar(100) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `slot` datetime NOT NULL,
  `bookingTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_booking`
--

INSERT INTO `tb_booking` (`id`, `bookName`, `phone`, `slot`, `bookingTime`) VALUES
(1, 'sambhu', '6363636366', '2024-12-20 14:12:00', '2024-12-13 10:50:25'),
(2, 'arun ', '9899327878', '2024-12-13 13:12:00', '2024-12-13 10:51:22'),
(3, 'anu', '7667676767', '2024-12-20 13:12:00', '2024-12-13 10:52:40'),
(4, 'sambhu', '6363636636', '2024-12-14 13:00:00', '2024-12-13 10:54:30'),
(5, 'amal', '8383838837', '2024-12-20 15:30:00', '2024-12-13 10:55:28'),
(6, 'tarun', '8893838883', '2024-12-28 15:30:00', '2024-12-13 10:56:43'),
(7, 'sambhu m', '8989736635', '2024-12-14 15:30:00', '2024-12-13 11:20:54'),
(8, 'tharun', '8777787878', '2024-12-14 11:30:00', '2024-12-13 11:48:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_booking`
--
ALTER TABLE `tb_booking`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_booking`
--
ALTER TABLE `tb_booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
