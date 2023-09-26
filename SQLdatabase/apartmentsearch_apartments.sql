-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: apartmentsearch
-- ------------------------------------------------------
-- Server version	8.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `apartments`
--

DROP TABLE IF EXISTS `apartments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apartments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `open_date` date NOT NULL,
  `close_date` date NOT NULL,
  `number_of_guests` int NOT NULL,
  `location` enum('Athens','Thessaloniki','Crete') NOT NULL,
  `type_of_apartment` enum('Room','Whole Apartment') NOT NULL,
  `owner_id` int DEFAULT NULL,
  `min_price` decimal(10,2) NOT NULL,
  `additional_cost_per_person` decimal(10,2) NOT NULL,
  `rules` text,
  `description` text,
  `number_of_beds` int DEFAULT NULL,
  `number_of_bathrooms` int DEFAULT NULL,
  `number_of_rooms` int DEFAULT NULL,
  `living_room` tinyint(1) DEFAULT NULL,
  `square_meters` decimal(10,2) DEFAULT NULL,
  `exact_location` varchar(40) DEFAULT NULL,
  `address` varchar(20) DEFAULT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `apartments_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apartments`
--

LOCK TABLES `apartments` WRITE;
/*!40000 ALTER TABLE `apartments` DISABLE KEYS */;
INSERT INTO `apartments` VALUES (1,'2023-09-01','2023-09-30',3,'Athens','Room',2,100.00,2.00,'tstetstesttestesttsttetstrt','tstetstesttestesttsttetstrt',2,1,2,1,444.00,'37.972079227501396,23.73905181884766','Address1','Dwmatiaki'),(3,'2023-09-01','2023-09-30',3,'Athens','Room',2,100.00,5.00,'afnlkdsfdpoih fdlbfliz gxiuh \\iuhd','fdalakjd lia oia hpohdpo h\\po h\\oj',4,1,1,NULL,233.00,'37.966124796192524,23.727378845214847','Address2','Dwmatiaki2');
/*!40000 ALTER TABLE `apartments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-26 23:11:57
