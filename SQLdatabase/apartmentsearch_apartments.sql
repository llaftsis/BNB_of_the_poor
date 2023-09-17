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
  `exact_location` VARCHAR(40),
  `address` VARCHAR(20),
  `nickname` VARCHAR(20),
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `apartments_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apartments`
--

LOCK TABLES `apartments` WRITE;
/*!40000 ALTER TABLE `apartments` DISABLE KEYS */;
INSERT INTO `apartments` VALUES (1,'2023-05-01','2023-05-10',2,'Athens','Room',1,50.00,10.00,'No pets. No smoking.','A cozy room in the heart of Athens.',1,1,1,0,25.00,'37.9838,23.7275','Acropolis, Athens', 'Test1'),(2,'2023-06-01','2023-06-15',4,'Thessaloniki','Whole Apartment',2,100.00,15.00,'No loud music after 10 pm.','Spacious apartment with a sea view.',2,1,3,1,70.00,'37.9838,23.7275','Kastra, Saloniki', 'TestThes'),(3,'2023-07-01','2023-07-20',6,'Crete','Whole Apartment',3,150.00,20.00,'Respect the space.','Luxurious apartment near the beach.',3,2,4,1,90.00,'100.9838,23.7275','Iraklio100', 'Creatafarms'),(4,'2023-06-01','2023-06-15',4,'Thessaloniki','Whole Apartment',2,100.00,15.00,'No loud music after 10 pm.','Spacious apartment with a sea view.',2,1,3,1,70.00,'60.9838,24.7275','testaddress', 'Salou'),(5,'2023-09-18','2023-09-29',3,'Athens','Room',5,100.00,2.00,'tesatear2','testtest',12,2,3,1,4.00,'37.9838,23.7275','Kafeniou 2, Athens', 'Athinospito');
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

-- Dump completed on 2023-09-16 21:12:49
