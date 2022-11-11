-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 24, 2015 at 07:26 AM
-- Server version: 5.5.45-cll-lve
-- PHP Version: 5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `rajbjszc_ecms`
--

-- --------------------------------------------------------

--
-- Table structure for table `area`
--

CREATE TABLE IF NOT EXISTS `area` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `x` varchar(10) NOT NULL,
  `y` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=72 ;

--
-- Dumping data for table `area`
--

INSERT INTO `area` (`id`, `name`, `description`, `x`, `y`) VALUES
(70, 'Area 1', '<p>Florida</p>\n', '', ''),
(71, 'Area 2', '<p>California</p>\n', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `bbank`
--

CREATE TABLE IF NOT EXISTS `bbank` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `gname` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `bbank`
--

INSERT INTO `bbank` (`id`, `gname`) VALUES
(1, 'A+'),
(2, 'A-'),
(3, 'B+'),
(4, 'B-'),
(5, 'AB+'),
(6, 'AB-'),
(7, 'O+'),
(8, 'O-');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE IF NOT EXISTS `event` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `event_id` varchar(100) NOT NULL,
  `organiser` varchar(500) NOT NULL,
  `location` varchar(500) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `subject` varchar(1000) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `guests` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `event_id`, `organiser`, `location`, `contact`, `date`, `subject`, `description`, `guests`) VALUES
(16, '44846', 'Mr Abdur Rahman', 'Dhaka', '+8887543865834', '05/25/2016', 'Election', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE IF NOT EXISTS `expense` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `user` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=35 ;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `category`, `date`, `amount`, `user`) VALUES
(34, 'Volunteer Training', '1448366468', '5000', ''),
(33, 'Advertisement', '1448366462', '5000', ''),
(32, 'Volunteer Training', '1448366452', '1000', '');

-- --------------------------------------------------------

--
-- Table structure for table `expense_category`
--

CREATE TABLE IF NOT EXISTS `expense_category` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `x` varchar(100) NOT NULL,
  `y` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `expense_category`
--

INSERT INTO `expense_category` (`id`, `category`, `description`, `x`, `y`) VALUES
(11, 'Volunteer Training', 'Soft Skills Training ', '', ''),
(10, 'Advertisement', 'Poster, Banner, Miking, TVC, Door-to-Door etc', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Administrator'),
(2, 'members', 'General User'),
(3, 'Accountant', 'For Financial Activities'),
(4, 'Volunteer', ''),
(5, 'Voter', ''),
(6, 'Nurse', ''),
(7, 'Pharmacist', ''),
(8, 'Laboratorist', '');

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--

CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(15) NOT NULL,
  `login` varchar(100) NOT NULL,
  `time` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `system_vendor` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `facebook_id` varchar(100) NOT NULL,
  `currency` varchar(100) NOT NULL,
  `discount` varchar(100) NOT NULL,
  `vat` varchar(100) NOT NULL,
  `codec_username` varchar(100) NOT NULL,
  `codec_purchase_code` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `system_vendor`, `title`, `address`, `phone`, `email`, `facebook_id`, `currency`, `discount`, `vat`, `codec_username`, `codec_purchase_code`) VALUES
(1, 'Election Campaign Management System - shared on codelist.cc', 'Code Aristos Democratic Party', 'Bashundhara R/A- 1229, Bangladesh', '+88 00123456789', 'admin@ecms.com', '#', 'Tk', 'flat', 'percentage', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `sms`
--

CREATE TABLE IF NOT EXISTS `sms` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `date` varchar(100) NOT NULL,
  `message` varchar(100) NOT NULL,
  `recipient` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;

--
-- Dumping data for table `sms`
--

INSERT INTO `sms` (`id`, `date`, `message`, `recipient`) VALUES
(17, '1448367138', ' Alhamdulillah This is a Test Message.', 'Rizvi Mahmud<br>8801777024443');

-- --------------------------------------------------------

--
-- Table structure for table `sms_settings`
--

CREATE TABLE IF NOT EXISTS `sms_settings` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `api_id` varchar(100) NOT NULL,
  `user` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `sms_settings`
--

INSERT INTO `sms_settings` (`id`, `username`, `password`, `api_id`, `user`) VALUES
(1, 'rizviplabon', 'code123456', '3570596', '');

-- --------------------------------------------------------

--
-- Table structure for table `snw`
--

CREATE TABLE IF NOT EXISTS `snw` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `topic` varchar(1000) NOT NULL,
  `note` varchar(1000) NOT NULL,
  `note1` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=44 ;

--
-- Dumping data for table `snw`
--

INSERT INTO `snw` (`id`, `type`, `topic`, `note`, `note1`) VALUES
(5, '', 'Weakness', 'what is weakness', ''),
(6, '0', 'Weakness', 'what is', ''),
(11, '0', 'Weakness', 'what is ', '');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE IF NOT EXISTS `team` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `members` varchar(500) NOT NULL,
  `task` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=35 ;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `name`, `area`, `members`, `task`) VALUES
(34, 'Team 1', 'Area 2', '42', 'Door To Door campaign');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(15) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `activation_code` varchar(40) DEFAULT NULL,
  `forgotten_password_code` varchar(40) DEFAULT NULL,
  `forgotten_password_time` int(11) unsigned DEFAULT NULL,
  `remember_code` varchar(40) DEFAULT NULL,
  `created_on` int(11) unsigned NOT NULL,
  `last_login` int(11) unsigned DEFAULT NULL,
  `active` tinyint(1) unsigned DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=183 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `ip_address`, `username`, `password`, `salt`, `email`, `activation_code`, `forgotten_password_code`, `forgotten_password_time`, `remember_code`, `created_on`, `last_login`, `active`, `first_name`, `last_name`, `company`, `phone`) VALUES
(1, '127.0.0.1', 'admin', '$2y$08$GZCX/pbp6TjNo6FY8vD96OCeM9.A6avueqYU8XoV5S6ylXQMIwZzi', '', 'admin@example.com', '', NULL, NULL, NULL, 1268889823, 1448358737, 1, 'Admin', 'istrator', 'ADMIN', '0'),
(109, '113.11.74.192', 'Mrs Nurse', '$2y$08$9CoRNL4mxDTlbpovPq6hOeKVWNNjPxhehsh81vL3Vp5Dvlzeq4FLC', NULL, 'nurse@hms.com', NULL, NULL, NULL, NULL, 1435082243, 1439280801, 1, NULL, NULL, NULL, NULL),
(110, '113.11.74.192', 'Mr. Pharmacist', '$2y$08$xcdi3igNxs2TnR6KlhKzreDfS9tgQ9.3p3TDw6wUE6tUsj713ZC8W', NULL, 'pharmacist@hms.com', NULL, NULL, NULL, 'mbeMop6vTuscFYmD2M4Iqu', 1435082359, 1435747556, 1, NULL, NULL, NULL, NULL),
(111, '113.11.74.192', 'Mr Laboratorist', '$2y$08$eQpeiC6bj3tgx0c3sCBMbeR4pGra3nQ5lRhVV8S3yPkunMwb9eKoi', NULL, 'laboratorist@hms.com', NULL, NULL, NULL, NULL, 1435082438, 1435748034, 1, NULL, NULL, NULL, NULL),
(112, '113.11.74.192', 'Mr. Accountant', '$2y$08$xzHbIrPVvlQsOQ6H/65YL.uI9Yxlp.JP5gognjkbaRuRT64n0eJJ2', NULL, 'accountant@hms.com', NULL, NULL, NULL, NULL, 1435082637, 1439288207, 1, NULL, NULL, NULL, NULL),
(181, '103.231.160.74', 'Mr Volunteer', '$2y$08$IADYL8MHAq6K1OPP/0swNeTW6ED3RaVyMngy5Atc4Nn5zTY98/8me', NULL, 'volunteer@ecms.com', NULL, NULL, NULL, NULL, 1448367464, NULL, 1, NULL, NULL, NULL, NULL),
(182, '103.231.160.74', 'Mr Voter', '$2y$08$xCPqFoMlFOESd46Slw.24e35kGFMDAnt6KTGLc4lJ0/bU9c/8FHMq', NULL, 'voter@ecms.com', NULL, NULL, NULL, NULL, 1448367534, NULL, 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users_groups`
--

CREATE TABLE IF NOT EXISTS `users_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `group_id` mediumint(8) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_users_groups` (`user_id`,`group_id`),
  KEY `fk_users_groups_users1_idx` (`user_id`),
  KEY `fk_users_groups_groups1_idx` (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=185 ;

--
-- Dumping data for table `users_groups`
--

INSERT INTO `users_groups` (`id`, `user_id`, `group_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(111, 109, 6),
(112, 110, 7),
(113, 111, 8),
(114, 112, 3),
(183, 181, 4),
(184, 182, 5);

-- --------------------------------------------------------

--
-- Table structure for table `volunteer`
--

CREATE TABLE IF NOT EXISTS `volunteer` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `img_url` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `profile` varchar(100) NOT NULL,
  `x` varchar(100) NOT NULL,
  `y` varchar(10) NOT NULL,
  `ion_user_id` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=43 ;

--
-- Dumping data for table `volunteer`
--

INSERT INTO `volunteer` (`id`, `img_url`, `name`, `email`, `address`, `phone`, `area`, `profile`, `x`, `y`, `ion_user_id`) VALUES
(42, '', 'Mr Volunteer', 'volunteer@ecms.com', 'Bashundhara R/A- 1229, Bangladesh', '+88 2467242444', 'Area 1', 'Working as a district head of the party.', '', '', '181');

-- --------------------------------------------------------

--
-- Table structure for table `voter`
--

CREATE TABLE IF NOT EXISTS `voter` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `img_url` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `area` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `sex` varchar(100) NOT NULL,
  `birthdate` varchar(100) NOT NULL,
  `age` varchar(100) NOT NULL,
  `bloodgroup` varchar(100) NOT NULL,
  `ion_user_id` varchar(100) NOT NULL,
  `voter_id` varchar(100) NOT NULL,
  `add_date` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=59 ;

--
-- Dumping data for table `voter`
--

INSERT INTO `voter` (`id`, `img_url`, `name`, `email`, `area`, `address`, `phone`, `sex`, `birthdate`, `age`, `bloodgroup`, `ion_user_id`, `voter_id`, `add_date`) VALUES
(58, '', 'Mr Voter', 'voter@ecms.com', 'Area 1', 'Bashundhara R/A- 1229, Bangladesh', '+88542342424', '', '11/25/2015', '', 'A+', '182', '27664823487324', '11/24/15');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users_groups`
--
ALTER TABLE `users_groups`
  ADD CONSTRAINT `fk_users_groups_groups1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_users_groups_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
