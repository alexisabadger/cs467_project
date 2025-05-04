-- MySQL dump for Fitness Application Database
--
-- Host: localhost    Database: fitness_app
-- ------------------------------------------------------
-- Server version 8.0.28


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/* Works Cited: the SQL setup script from CS 340, modified to
                include all of our tables/relationship
                (and not the ones from the class exercise */


USE thehrhva_fitness_app;


--
-- Table structure for table `RefFitnessLevel`
--


DROP TABLE IF EXISTS `RefFitnessLevel`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RefFitnessLevel` (
  `FitnessLevelId` int(11) NOT NULL,
  `FitnessLevel` varchar(50) NOT NULL,
  PRIMARY KEY (`FitnessLevelId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `RefFitnessLevel`
--


LOCK TABLES `RefFitnessLevel` WRITE;
/*!40000 ALTER TABLE `RefFitnessLevel` DISABLE KEYS */;
INSERT INTO `RefFitnessLevel` VALUES (0,'Beginner'),(1,'Intermediate'),(2,'Advanced');
/*!40000 ALTER TABLE `RefFitnessLevel` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `RefMuscles`
--


DROP TABLE IF EXISTS `RefMuscles`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RefMuscles` (
  `MuscleId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`MuscleId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `RefMuscles`
--


LOCK TABLES `RefMuscles` WRITE;
/*!40000 ALTER TABLE `RefMuscles` DISABLE KEYS */;
INSERT INTO `RefMuscles` VALUES (1,'Chest'),(2,'Back'),(3,'Shoulders'),(4,'Biceps'),(5,'Triceps'),
  (6,'Quadriceps'),(7,'Hamstrings'),(8,'Calves'),(9,'Abdominals'),(10,'Obliques'),
  (11,'Forearms'),(12,'Glutes'),(13,'Lower Back'),(14,'Trapezius'),(15,'Lats');
/*!40000 ALTER TABLE `RefMuscles` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `RefExerciseEquipment`
--


DROP TABLE IF EXISTS `RefExerciseEquipment`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `RefExerciseEquipment` (
  `ExerciseEquipmentId` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`ExerciseEquipmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `RefExerciseEquipment`
--


LOCK TABLES `RefExerciseEquipment` WRITE;
/*!40000 ALTER TABLE `RefExerciseEquipment` DISABLE KEYS */;
INSERT INTO `RefExerciseEquipment` VALUES (1,'None/Bodyweight'),(2,'Dumbbell'),(3,'Barbell'),(4,'Kettlebell'),
  (5,'Resistance Band'),(6,'Machine'),(7,'Stability Ball'),(8,'Medicine Ball'),(9,'TRX/Suspension Trainer'),
  (10,'Foam Roller'),(11,'Bench'),(12,'Pull-up Bar'),(13,'Treadmill'),(14,'Stationary Bike'),
  (15,'Elliptical'),(16,'Rowing Machine'),(17,'Jump Rope');
/*!40000 ALTER TABLE `RefExerciseEquipment` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `Users`
--


DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `UserId` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(50) NOT NULL,
  `UserTypeId` int(11) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `FitnessLevelId` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`UserId`),
  FOREIGN KEY (`FitnessLevelId`) REFERENCES `RefFitnessLevel` (`FitnessLevelId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;




--
-- Table structure for table `Validation`
--


DROP TABLE IF EXISTS `Validation`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Validation` (
  `ValidationId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `ValidationValue` varchar(128) NOT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL,
  PRIMARY KEY (`ValidationId`),
  FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `Exercises`
--


DROP TABLE IF EXISTS `Exercises`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Exercises` (
  `ExerciseId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) DEFAULT NULL,
  `ExerciseEquipmentId` int(11) DEFAULT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `ExerciseDate` datetime DEFAULT NULL,
  `ExerciseStartTime` datetime DEFAULT NULL,
  `ExerciseStopTime` datetime DEFAULT NULL,
  `Distance` decimal(10,2) DEFAULT NULL,
  `Reps` int(11) DEFAULT NULL,
  `Weight` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ExerciseId`),
  FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`),
  FOREIGN KEY (`ExerciseEquipmentId`) REFERENCES `RefExerciseEquipment` (`ExerciseEquipmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `Exercises`
--


LOCK TABLES `Exercises` WRITE;
/*!40000 ALTER TABLE `Exercises` DISABLE KEYS */;
INSERT INTO `Exercises` VALUES (1,NULL,1,'Push-up','Standard push-up. Place hands shoulder-width apart and lower body until chest nearly touches the floor.',NULL,NULL,NULL,NULL,NULL,NULL),
  (2,NULL,1,'Body-weight Squat','Stand with feet shoulder-width apart. Lower your body by bending knees and pushing hips back.',NULL,NULL,NULL,NULL,NULL,NULL),
  (3,NULL,1,'Plank','Hold a push-up position with body in a straight line from head to heels.',NULL,NULL,NULL,NULL,NULL,NULL),
  (4,NULL,2,'Dumbbell Bench Press','Lie on a bench with a dumbbell in each hand. Push weights up until arms are extended.',NULL,NULL,NULL,NULL,NULL,NULL),
  (5,NULL,3,'Barbell Squat','Place barbell across upper back. Bend knees to lower until thighs are parallel to floor.',NULL,NULL,NULL,NULL,NULL,NULL),
  (6,NULL,2,'Dumbbell Row','Bend at waist with one knee on bench. Pull dumbbell up to side of chest.',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Exercises` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `ExerciseMuscles`
--


DROP TABLE IF EXISTS `ExerciseMuscles`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ExerciseMuscles` (
  `ExerciseId` int(11) NOT NULL,
  `MuscleId` int(11) NOT NULL,
  `IsPrimary` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`ExerciseId`, `MuscleId`),
  FOREIGN KEY (`ExerciseId`) REFERENCES `Exercises` (`ExerciseId`),
  FOREIGN KEY (`MuscleId`) REFERENCES `RefMuscles` (`MuscleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `ExerciseMuscles`
--


LOCK TABLES `ExerciseMuscles` WRITE;
/*!40000 ALTER TABLE `ExerciseMuscles` DISABLE KEYS */;
INSERT INTO `ExerciseMuscles` VALUES (1,1,1),(1,5,0),(2,6,1),(2,12,0),(3,9,1),
  (4,1,1),(4,5,0),(5,6,1),(5,12,0),(6,2,1),(6,4,0);
/*!40000 ALTER TABLE `ExerciseMuscles` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `FitnessPlans`
--


DROP TABLE IF EXISTS `FitnessPlans`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `FitnessPlans` (
  `FitnessPlanId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) DEFAULT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`FitnessPlanId`),
  FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `FitnessPlans`
--


LOCK TABLES `FitnessPlans` WRITE;
/*!40000 ALTER TABLE `FitnessPlans` DISABLE KEYS */;
INSERT INTO `FitnessPlans` VALUES (1,NULL,'Beginner Full Body','A beginner-friendly full body workout plan.',NOW(),NULL,1,0);
/*!40000 ALTER TABLE `FitnessPlans` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `WorkoutPlans`
--


DROP TABLE IF EXISTS `WorkoutPlans`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WorkoutPlans` (
  `WorkoutPlanId` int(11) NOT NULL AUTO_INCREMENT,
  `FitnessPlanId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `Name` varchar(100) NOT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`WorkoutPlanId`),
  FOREIGN KEY (`FitnessPlanId`) REFERENCES `FitnessPlans` (`FitnessPlanId`),
  FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `WorkoutPlans`
--


LOCK TABLES `WorkoutPlans` WRITE;
/*!40000 ALTER TABLE `WorkoutPlans` DISABLE KEYS */;
INSERT INTO `WorkoutPlans` VALUES (1,1,NULL,'Upper Body Basics',NOW(),NULL,1,0),
  (2,1,NULL,'Lower Body Basics',NOW(),NULL,1,0),
  (3,1,2,'John\'s Upper Body Plan',NOW(),NULL,1,0),
  (4,1,3,'Jane\'s Beginner Routine',NOW(),NULL,1,0);
/*!40000 ALTER TABLE `WorkoutPlans` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `WorkoutPlanExercises`
--


DROP TABLE IF EXISTS `WorkoutPlanExercises`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WorkoutPlanExercises` (
  `WorkoutPlanId` int(11) NOT NULL,
  `ExerciseId` int(11) NOT NULL,
  `ExerciseOrder` int(11) NOT NULL,
  `Sets` int(11) DEFAULT NULL,
  `RepsPerSet` int(11) DEFAULT NULL,
  `RestBetweenSets` int(11) DEFAULT NULL,
  `Notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`WorkoutPlanId`, `ExerciseId`, `ExerciseOrder`),
  FOREIGN KEY (`WorkoutPlanId`) REFERENCES `WorkoutPlans` (`WorkoutPlanId`),
  FOREIGN KEY (`ExerciseId`) REFERENCES `Exercises` (`ExerciseId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `WorkoutPlanExercises`
--


LOCK TABLES `WorkoutPlanExercises` WRITE;
/*!40000 ALTER TABLE `WorkoutPlanExercises` DISABLE KEYS */;
INSERT INTO `WorkoutPlanExercises` VALUES (1,1,1,3,10,60,NULL),
  (1,4,2,3,10,60,NULL),
  (1,6,3,3,10,60,NULL),
  (2,2,1,3,12,60,NULL),
  (2,5,2,3,10,90,NULL),
  (2,3,3,3,30,60,NULL),
  (3,1,1,4,12,60,NULL),
  (3,4,2,3,10,90,NULL),
  (3,6,3,3,12,60,NULL),
  (4,1,1,3,8,60,NULL),
  (4,2,2,3,10,60,NULL),
  (4,3,3,2,30,45,NULL);
/*!40000 ALTER TABLE `WorkoutPlanExercises` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `UserWorkouts`
--


DROP TABLE IF EXISTS `UserWorkouts`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserWorkouts` (
  `UserWorkoutId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `WorkoutPlanId` int(11) DEFAULT NULL,
  `WorkoutDate` datetime DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `UpdatedOn` datetime DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`UserWorkoutId`),
  FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`),
  FOREIGN KEY (`WorkoutPlanId`) REFERENCES `WorkoutPlans` (`WorkoutPlanId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `UserWorkouts`
--


LOCK TABLES `UserWorkouts` WRITE;
/*!40000 ALTER TABLE `UserWorkouts` DISABLE KEYS */;
INSERT INTO `UserWorkouts` VALUES 
  (1,2,3,DATE_SUB(NOW(), INTERVAL 3 DAY),NOW(),NULL,1,0),
  (2,2,3,DATE_SUB(NOW(), INTERVAL 1 DAY),NOW(),NULL,1,0),
  (3,3,4,DATE_SUB(NOW(), INTERVAL 2 DAY),NOW(),NULL,1,0);
/*!40000 ALTER TABLE `UserWorkouts` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `UserExercises`
--


DROP TABLE IF EXISTS `UserExercises`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserExercises` (
  `UserExerciseId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `ExerciseId` int(11) NOT NULL,
  `UserWorkoutId` int(11) DEFAULT NULL,
  `ExerciseDate` datetime DEFAULT NULL,
  `ExerciseStartTime` datetime DEFAULT NULL,
  `ExerciseStopTime` datetime DEFAULT NULL,
  `Distance` decimal(10,2) DEFAULT NULL,
  `Reps` int(11) DEFAULT NULL,
  `Weight` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`UserExerciseId`),
  FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`),
  FOREIGN KEY (`ExerciseId`) REFERENCES `Exercises` (`ExerciseId`),
  FOREIGN KEY (`UserWorkoutId`) REFERENCES `UserWorkouts` (`UserWorkoutId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `UserExercises`
--


LOCK TABLES `UserExercises` WRITE;
/*!40000 ALTER TABLE `UserExercises` DISABLE KEYS */;
INSERT INTO `UserExercises` VALUES 
  (1,2,1,1,DATE_SUB(NOW(), INTERVAL 3 DAY),DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR,DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR + INTERVAL 5 MINUTE,NULL,12,NULL),
  (2,2,4,1,DATE_SUB(NOW(), INTERVAL 3 DAY),DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR + INTERVAL 10 MINUTE,DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR + INTERVAL 20 MINUTE,NULL,10,25.00),
  (3,2,6,1,DATE_SUB(NOW(), INTERVAL 3 DAY),DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR + INTERVAL 25 MINUTE,DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR + INTERVAL 35 MINUTE,NULL,12,30.00),
  (4,2,1,2,DATE_SUB(NOW(), INTERVAL 1 DAY),DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR,DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR + INTERVAL 5 MINUTE,NULL,15,NULL),
  (5,2,4,2,DATE_SUB(NOW(), INTERVAL 1 DAY),DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR + INTERVAL 10 MINUTE,DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR + INTERVAL 20 MINUTE,NULL,12,27.50),
  (6,2,6,2,DATE_SUB(NOW(), INTERVAL 1 DAY),DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR + INTERVAL 25 MINUTE,DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR + INTERVAL 35 MINUTE,NULL,12,32.50),
  (7,3,1,3,DATE_SUB(NOW(), INTERVAL 2 DAY),DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR,DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 5 MINUTE,NULL,8,NULL),
  (8,3,2,3,DATE_SUB(NOW(), INTERVAL 2 DAY),DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 10 MINUTE,DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 15 MINUTE,NULL,10,NULL),
  (9,3,3,3,DATE_SUB(NOW(), INTERVAL 2 DAY),DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 20 MINUTE,DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 21 MINUTE,NULL,30,NULL);
/*!40000 ALTER TABLE `UserExercises` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Stored Procedures
--


DELIMITER ;;


-- User Authentication Procedure
CREATE PROCEDURE `User_Authenticate`(
    _UserName VARCHAR(50),
    _Email VARCHAR(100),
    _ValidationValue VARCHAR(128)
)
BEGIN
    SELECT 
        u.UserId,
        u.UserName,
        u.Email,
        u.FirstName,
        u.LastName,
        u.FitnessLevelId,
        r.FitnessLevel,
        u.UserTypeId
    FROM 
        Users u
        INNER JOIN Validation v ON u.UserId = v.UserId
        LEFT JOIN RefFitnessLevel r ON u.FitnessLevelId = r.FitnessLevelId
    WHERE 
        ((u.UserName = _UserName AND _UserName IS NOT NULL) 
         OR (u.Email = _Email AND _Email IS NOT NULL))
        AND v.ValidationValue = _ValidationValue
        AND u.IsActive = TRUE
        AND u.IsDeleted = FALSE;
END;;


-- User Save Procedure
CREATE PROCEDURE `User_Save`(
    _UserId INT,
    _UserName VARCHAR(50),
    _Email VARCHAR(100),
    _FirstName VARCHAR(50),
    _LastName VARCHAR(50),
    _FitnessLevelId INT,
    _UserTypeId INT,
    _ValidationValue VARCHAR(128),
    _CurrentUserId INT
)
BEGIN
    DECLARE _NewUserId INT;
    
    START TRANSACTION;
    
    -- If user exists, update
    IF (_UserId > 0) THEN
        UPDATE Users
        SET UserName = _UserName,
            Email = _Email,
            FirstName = _FirstName,
            LastName = _LastName,
            FitnessLevelId = _FitnessLevelId,
            UserTypeId = _UserTypeId,
            UpdatedOn = NOW()
        WHERE UserId = _UserId;
        
        SET _NewUserId = _UserId;
        
        -- Update validation if provided
        IF (_ValidationValue IS NOT NULL) THEN
            UPDATE Validation
            SET ValidationValue = _ValidationValue,
                UpdatedOn = NOW()
            WHERE UserId = _UserId;
        END IF;
    ELSE
        -- Insert new user
        INSERT INTO Users (
            UserName, Email, FirstName, LastName,
            FitnessLevelId, UserTypeId, CreatedOn, IsActive, IsDeleted
        )
        VALUES (
            _UserName, _Email, _FirstName, _LastName,
            _FitnessLevelId, _UserTypeId, NOW(), TRUE, FALSE
        );
        
        SET _NewUserId = LAST_INSERT_ID();
        
        -- Insert validation
        INSERT INTO Validation (
            UserId, ValidationValue, CreatedOn
        )
        VALUES (
            _NewUserId, _ValidationValue, NOW()
        );
    END IF;
    
    COMMIT;
    
    -- Return the user ID
    SELECT _NewUserId AS UserId;
END;;


-- User Get Procedure
CREATE PROCEDURE `User_Get`(
    _UserId INT,
    _Email VARCHAR(100),
    _UserName VARCHAR(50)
)
BEGIN
    SELECT 
        u.UserId,
        u.UserName,
        u.Email,
        u.FirstName,
        u.LastName,
        u.FitnessLevelId,
        r.FitnessLevel,
        u.UserTypeId,
        u.CreatedOn,
        u.IsActive
    FROM 
        Users u
        LEFT JOIN RefFitnessLevel r ON u.FitnessLevelId = r.FitnessLevelId
    WHERE 
        (u.UserId = _UserId OR _UserId IS NULL)
        AND (u.Email = _Email OR _Email IS NULL)
        AND (u.UserName = _UserName OR _UserName IS NULL)
        AND u.IsDeleted = FALSE;
END;;


-- Exercise Save Procedure
CREATE PROCEDURE `Exercise_Save`(
    _ExerciseId INT,
    _UserId INT,
    _Name VARCHAR(100),
    _Description TEXT,
    _ExerciseEquipmentId INT,
    _CurrentUserId INT,
    _MuscleIds VARCHAR(255)
)
BEGIN
    DECLARE _NewExerciseId INT;
    
    START TRANSACTION;
    
    -- If exercise exists, update
    IF (_ExerciseId > 0) THEN
        UPDATE Exercises
        SET Name = _Name,
            Description = _Description,
            ExerciseEquipmentId = _ExerciseEquipmentId
        WHERE ExerciseId = _ExerciseId
        -- Check ownership or admin status
        AND (_UserId = _CurrentUserId OR 
             EXISTS (SELECT 1 FROM Users WHERE UserId = _CurrentUserId AND UserTypeId = 1));
        
        SET _NewExerciseId = _ExerciseId;
        
        -- Delete existing muscle connections if we have new ones
        IF (_MuscleIds IS NOT NULL) THEN
            DELETE FROM ExerciseMuscles 
            WHERE ExerciseId = _ExerciseId;
        END IF;
    ELSE
        -- Insert new exercise
        INSERT INTO Exercises (
            UserId, Name, Description, ExerciseEquipmentId
        )
        VALUES (
            _UserId, _Name, _Description, _ExerciseEquipmentId
        );
        
        SET _NewExerciseId = LAST_INSERT_ID();
    END IF;
    
    -- Insert new muscle connections if provided
    IF (_MuscleIds IS NOT NULL AND _NewExerciseId > 0) THEN
        -- Loop through comma-separated muscle IDs
        SET @muscle_list = _MuscleIds;
        
        WHILE (LOCATE(',', @muscle_list) > 0) DO
            SET @muscleId = SUBSTRING(@muscle_list, 1, LOCATE(',', @muscle_list) - 1);
            SET @muscle_list = SUBSTRING(@muscle_list, LOCATE(',', @muscle_list) + 1);
            
            IF (@muscleId > 0) THEN
                INSERT INTO ExerciseMuscles (ExerciseId, MuscleId, IsPrimary)
                VALUES (_NewExerciseId, @muscleId, TRUE);
            END IF;
        END WHILE;
        
        -- Insert the last muscle ID
        IF (LENGTH(@muscle_list) > 0 AND @muscle_list > 0) THEN
            INSERT INTO ExerciseMuscles (ExerciseId, MuscleId, IsPrimary)
            VALUES (_NewExerciseId, @muscle_list, TRUE);
        END IF;
    END IF;
    
    COMMIT;
    
    -- Return the exercise ID
    SELECT _NewExerciseId AS ExerciseId;
END;;


-- Exercise Get Procedure
CREATE PROCEDURE `Exercise_Get`(
_ExerciseId INT,
    _UserId INT,
    _EquipmentId INT,
    _MuscleId INT
)
BEGIN
    SELECT DISTINCT
        e.ExerciseId,
        e.Name,
        e.Description,
        e.ExerciseEquipmentId,
        req.Name AS EquipmentName,
        e.UserId,
        CONCAT(u.FirstName, ' ', u.LastName) AS CreatedByUser,
        GROUP_CONCAT(DISTINCT rm.Name ORDER BY rm.Name SEPARATOR ', ') AS TargetMuscles
    FROM 
        Exercises e
        LEFT JOIN RefExerciseEquipment req ON e.ExerciseEquipmentId = req.ExerciseEquipmentId
        LEFT JOIN Users u ON e.UserId = u.UserId
        LEFT JOIN ExerciseMuscles em ON e.ExerciseId = em.ExerciseId
        LEFT JOIN RefMuscles rm ON em.MuscleId = rm.MuscleId
    WHERE 
        (e.ExerciseId = _ExerciseId OR _ExerciseId IS NULL)
        AND (e.UserId = _UserId OR _UserId IS NULL OR e.UserId IS NULL) -- NULL UserId means system exercise
        AND (e.ExerciseEquipmentId = _EquipmentId OR _EquipmentId IS NULL)
        AND (em.MuscleId = _MuscleId OR _MuscleId IS NULL)
    GROUP BY
        e.ExerciseId, e.Name, e.Description, e.ExerciseEquipmentId,
        req.Name, e.UserId, CreatedByUser;
END;;


-- Workout Plan Save Procedure
CREATE PROCEDURE `WorkoutPlan_Save`(
    _WorkoutPlanId INT,
    _FitnessPlanId INT,
    _UserId INT,
    _Name VARCHAR(100),
    _CurrentUserId INT
)
BEGIN
    DECLARE _NewWorkoutPlanId INT;
    
    START TRANSACTION;
    
    -- If workout plan exists, update
    IF (_WorkoutPlanId > 0) THEN
        UPDATE WorkoutPlans
        SET Name = _Name,
            FitnessPlanId = _FitnessPlanId,
            UpdatedOn = NOW()
        WHERE WorkoutPlanId = _WorkoutPlanId
        -- Check ownership or admin status
        AND (_UserId = _CurrentUserId OR 
             EXISTS (SELECT 1 FROM Users WHERE UserId = _CurrentUserId AND UserTypeId = 1));
        
        SET _NewWorkoutPlanId = _WorkoutPlanId;
    ELSE
        -- Insert new workout plan
        INSERT INTO WorkoutPlans (
            FitnessPlanId, UserId, Name, CreatedOn, IsActive, IsDeleted
        )
        VALUES (
            _FitnessPlanId, _UserId, _Name, NOW(), TRUE, FALSE
        );
        
        SET _NewWorkoutPlanId = LAST_INSERT_ID();
    END IF;
    
    COMMIT;
    
    -- Return the workout plan ID
    SELECT _NewWorkoutPlanId AS WorkoutPlanId;
END;;


-- Add Exercise to Workout Plan Procedure
CREATE PROCEDURE `WorkoutPlanExercise_Save`(
    _WorkoutPlanId INT,
    _ExerciseId INT,
    _ExerciseOrder INT,
    _Sets INT,
    _RepsPerSet INT,
    _RestBetweenSets INT,
    _Notes VARCHAR(255),
    _CurrentUserId INT
)
BEGIN
    DECLARE _Success BOOLEAN DEFAULT FALSE;
    
    START TRANSACTION;
    
    -- Check if the current user owns the workout plan or is an admin
    IF EXISTS (
        SELECT 1 FROM WorkoutPlans wp
        WHERE wp.WorkoutPlanId = _WorkoutPlanId
        AND (wp.UserId = _CurrentUserId OR 
             EXISTS (SELECT 1 FROM Users WHERE UserId = _CurrentUserId AND UserTypeId = 1))
    ) THEN
        -- Check if this exercise is already in the workout plan
        IF EXISTS (
            SELECT 1 FROM WorkoutPlanExercises 
            WHERE WorkoutPlanId = _WorkoutPlanId 
            AND ExerciseId = _ExerciseId
            AND ExerciseOrder = _ExerciseOrder
        ) THEN
            -- Update existing connection
            UPDATE WorkoutPlanExercises
            SET Sets = _Sets,
                RepsPerSet = _RepsPerSet,
                RestBetweenSets = _RestBetweenSets,
                Notes = _Notes
            WHERE WorkoutPlanId = _WorkoutPlanId 
            AND ExerciseId = _ExerciseId
            AND ExerciseOrder = _ExerciseOrder;
        ELSE
            -- Insert new connection
            INSERT INTO WorkoutPlanExercises (
                WorkoutPlanId, ExerciseId, ExerciseOrder, 
                Sets, RepsPerSet, RestBetweenSets, Notes
            )
            VALUES (
                _WorkoutPlanId, _ExerciseId, _ExerciseOrder, 
                _Sets, _RepsPerSet, _RestBetweenSets, _Notes
            );
        END IF;
        
        SET _Success = TRUE;
    END IF;
    
    COMMIT;
    
    -- Return success status
    SELECT _Success AS Success;
END;;


-- Get Workout Plan with Exercises Procedure
CREATE PROCEDURE `WorkoutPlan_GetWithExercises`(
    _WorkoutPlanId INT
)
BEGIN
    -- Get workout plan details
    SELECT 
        wp.WorkoutPlanId,
        wp.Name,
        wp.FitnessPlanId,
        wp.UserId,
        CONCAT(u.FirstName, ' ', u.LastName) AS CreatedByUser
    FROM 
        WorkoutPlans wp
        LEFT JOIN Users u ON wp.UserId = u.UserId
    WHERE 
        wp.WorkoutPlanId = _WorkoutPlanId
        AND wp.IsDeleted = FALSE;
        
    -- Get exercises in this workout plan
    SELECT 
        wpe.WorkoutPlanId,
        wpe.ExerciseId,
        e.Name AS ExerciseName,
        e.Description,
        req.Name AS EquipmentName,
        wpe.ExerciseOrder,
        wpe.Sets,
        wpe.RepsPerSet,
        wpe.RestBetweenSets,
        wpe.Notes,
        GROUP_CONCAT(DISTINCT rm.Name ORDER BY rm.Name SEPARATOR ', ') AS TargetMuscles
    FROM 
        WorkoutPlanExercises wpe
        INNER JOIN Exercises e ON wpe.ExerciseId = e.ExerciseId
        LEFT JOIN RefExerciseEquipment req ON e.ExerciseEquipmentId = req.ExerciseEquipmentId
        LEFT JOIN ExerciseMuscles em ON e.ExerciseId = em.ExerciseId
        LEFT JOIN RefMuscles rm ON em.MuscleId = rm.MuscleId
    WHERE 
        wpe.WorkoutPlanId = _WorkoutPlanId
    GROUP BY
        wpe.WorkoutPlanId, wpe.ExerciseId, e.Name, e.Description, 
        req.Name, wpe.ExerciseOrder, wpe.Sets, wpe.RepsPerSet, 
        wpe.RestBetweenSets, wpe.Notes
    ORDER BY 
        wpe.ExerciseOrder;
END;;


-- Log User Workout Procedure
CREATE PROCEDURE `UserWorkout_Save`(
    _UserWorkoutId INT,
    _UserId INT,
    _WorkoutPlanId INT,
    _WorkoutDate DATETIME,
    _CurrentUserId INT
)
BEGIN
    DECLARE _NewUserWorkoutId INT;
    
    -- Check permission
    IF (_UserId = _CurrentUserId OR 
        EXISTS (SELECT 1 FROM Users WHERE UserId = _CurrentUserId AND UserTypeId = 1)) THEN
        
        START TRANSACTION;
        
        -- If user workout exists, update
        IF (_UserWorkoutId > 0) THEN
            UPDATE UserWorkouts
            SET WorkoutDate = _WorkoutDate,
                UpdatedOn = NOW()
            WHERE UserWorkoutId = _UserWorkoutId
            AND UserId = _UserId;
            
            SET _NewUserWorkoutId = _UserWorkoutId;
        ELSE
            -- Insert new user workout
            INSERT INTO UserWorkouts (
                UserId, WorkoutPlanId, WorkoutDate, CreatedOn, IsActive, IsDeleted
            )
            VALUES (
                _UserId, _WorkoutPlanId, _WorkoutDate, NOW(), TRUE, FALSE
            );
            
            SET _NewUserWorkoutId = LAST_INSERT_ID();
        END IF;
        
        COMMIT;
        
        -- Return the user workout ID
        SELECT _NewUserWorkoutId AS UserWorkoutId;
    ELSE
        -- Unauthorized
        SELECT 0 AS UserWorkoutId;
    END IF;
END;;


-- Log User Exercise Procedure
CREATE PROCEDURE `UserExercise_Save`(
    _UserExerciseId INT,
    _UserId INT,
    _ExerciseId INT,
    _UserWorkoutId INT,
    _ExerciseDate DATETIME,
    _ExerciseStartTime DATETIME,
    _ExerciseStopTime DATETIME,
    _Distance DECIMAL(10,2),
    _Reps INT,
    _Weight DECIMAL(10,2),
    _CurrentUserId INT
)
BEGIN
    DECLARE _NewUserExerciseId INT;
    
    -- Check permission
    IF (_UserId = _CurrentUserId OR 
        EXISTS (SELECT 1 FROM Users WHERE UserId = _CurrentUserId AND UserTypeId = 1)) THEN
        
        START TRANSACTION;
        
        -- If user exercise exists, update
        IF (_UserExerciseId > 0) THEN
            UPDATE UserExercises
            SET ExerciseDate = _ExerciseDate,
                ExerciseStartTime = _ExerciseStartTime,
                ExerciseStopTime = _ExerciseStopTime,
                Distance = _Distance,
                Reps = _Reps,
                Weight = _Weight
            WHERE UserExerciseId = _UserExerciseId
            AND UserId = _UserId;
            
            SET _NewUserExerciseId = _UserExerciseId;
        ELSE
            -- Insert new user exercise
            INSERT INTO UserExercises (
                UserId, ExerciseId, UserWorkoutId,
                ExerciseDate, ExerciseStartTime, ExerciseStopTime,
                Distance, Reps, Weight
            )
            VALUES (
                _UserId, _ExerciseId, _UserWorkoutId,
                _ExerciseDate, _ExerciseStartTime, _ExerciseStopTime,
                _Distance, _Reps, _Weight
            );
            
            SET _NewUserExerciseId = LAST_INSERT_ID();
        END IF;
        
        COMMIT;
        
        -- Return the user exercise ID
        SELECT _NewUserExerciseId AS UserExerciseId;
    ELSE
        -- Unauthorized
        SELECT 0 AS UserExerciseId;
    END IF;
END;;


-- Get User Workout History Procedure
CREATE PROCEDURE `UserWorkout_GetHistory`(
    _UserId INT,
    _StartDate DATETIME,
    _EndDate DATETIME,
    _CurrentUserId INT
)
BEGIN
    -- Check permission
    IF (_UserId = _CurrentUserId OR 
        EXISTS (SELECT 1 FROM Users WHERE UserId = _CurrentUserId AND UserTypeId = 1)) THEN
        
        SELECT 
            uw.UserWorkoutId,
            uw.WorkoutDate,
            wp.Name AS WorkoutPlanName,
            COUNT(ue.UserExerciseId) AS ExercisesCompleted,
            SUM(
                CASE 
                    WHEN ue.ExerciseStartTime IS NOT NULL AND ue.ExerciseStopTime IS NOT NULL 
                    THEN TIMESTAMPDIFF(SECOND, ue.ExerciseStartTime, ue.ExerciseStopTime) 
                    ELSE 0 
                END
            ) AS TotalDurationSeconds
        FROM 
            UserWorkouts uw
            INNER JOIN WorkoutPlans wp ON uw.WorkoutPlanId = wp.WorkoutPlanId
            LEFT JOIN UserExercises ue ON uw.UserWorkoutId = ue.UserWorkoutId
        WHERE 
            uw.UserId = _UserId
            AND uw.IsDeleted = FALSE
            AND (_StartDate IS NULL OR uw.WorkoutDate >= _StartDate)
            AND (_EndDate IS NULL OR uw.WorkoutDate <= _EndDate)
        GROUP BY 
            uw.UserWorkoutId, uw.WorkoutDate, wp.Name
        ORDER BY 
            uw.WorkoutDate DESC;
    ELSE
        -- Unauthorized: return empty result
        SELECT 
            NULL AS UserWorkoutId,
            NULL AS WorkoutDate,
            NULL AS WorkoutPlanName,
            NULL AS ExercisesCompleted,
            NULL AS TotalDurationSeconds
        WHERE FALSE;
    END IF;
END;;


-- Get User Exercise History Procedure
CREATE PROCEDURE `UserExercise_GetHistory`(
    _UserId INT,
    _ExerciseId INT,
    _StartDate DATETIME,
    _EndDate DATETIME,
    _CurrentUserId INT
)
BEGIN
    -- Check permission
    IF (_UserId = _CurrentUserId OR 
        EXISTS (SELECT 1 FROM Users WHERE UserId = _CurrentUserId AND UserTypeId = 1)) THEN
        
        SELECT 
            ue.UserExerciseId,
            ue.ExerciseId,
            e.Name AS ExerciseName,
            uw.WorkoutDate,
            ue.ExerciseDate,
            ue.ExerciseStartTime,
            ue.ExerciseStopTime,
            ue.Distance,
            ue.Reps,
            ue.Weight,
            wp.Name AS WorkoutPlanName
        FROM 
            UserExercises ue
            INNER JOIN Exercises e ON ue.ExerciseId = e.ExerciseId
            LEFT JOIN UserWorkouts uw ON ue.UserWorkoutId = uw.UserWorkoutId
            LEFT JOIN WorkoutPlans wp ON uw.WorkoutPlanId = wp.WorkoutPlanId
        WHERE 
            ue.UserId = _UserId
            AND (ue.ExerciseId = _ExerciseId OR _ExerciseId IS NULL)
            AND (_StartDate IS NULL OR ue.ExerciseDate >= _StartDate)
            AND (_EndDate IS NULL OR ue.ExerciseDate <= _EndDate)
        ORDER BY 
            ue.ExerciseDate DESC, ue.ExerciseStartTime DESC;
    ELSE
        -- Unauthorized: return empty result
        SELECT 
            NULL AS UserExerciseId,
            NULL AS ExerciseId,
            NULL AS ExerciseName,
            NULL AS WorkoutDate,
            NULL AS ExerciseDate,
            NULL AS ExerciseStartTime,
            NULL AS ExerciseStopTime,
            NULL AS Distance,
            NULL AS Reps,
            NULL AS Weight,
            NULL AS WorkoutPlanName
        WHERE FALSE;
    END IF;
END;;


DELIMITER ;


-- Create users using stored procedures
-- First we need to drop existing sample data to avoid conflicts
DELETE FROM UserExercises;
DELETE FROM UserWorkouts;
DELETE FROM WorkoutPlanExercises WHERE WorkoutPlanId IN (3, 4);
DELETE FROM WorkoutPlans WHERE WorkoutPlanId IN (3, 4);
DELETE FROM Validation;
DELETE FROM Users;


-- Create admin user
CALL User_Save(0, 'admin', 'admin@fitnessapp.com', 'Admin', 'User', 2, 1, 
               SHA2('admin_password', 256), 1);


-- Get the admin ID
SET @adminId = LAST_INSERT_ID();


-- Create John Doe user
CALL User_Save(0, 'johndoe', 'john@example.com', 'John', 'Doe', 1, 2, 
               SHA2('john_password', 256), @adminId);


-- Get John's ID
SET @johnId = LAST_INSERT_ID();


-- Create Jane Smith user
CALL User_Save(0, 'janesmith', 'jane@example.com', 'Jane', 'Smith', 0, 2, 
               SHA2('jane_password', 256), @adminId);


-- Get Jane's ID
SET @janeId = LAST_INSERT_ID();




/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;


-- Dump completed