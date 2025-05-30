import mysql from "mysql2/promise";
import crypto from 'crypto';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const db = mysql.createPool(process.env.DATABASE_URL);

// User Authentication (replaces User_Authenticate procedure)
export async function authenticateUser(email: string, validationValue: string) {
  const [rows] = await db.execute(`
    SELECT 
      u.UserId, u.UserName, u.Email, u.FirstName, u.LastName, 
      u.FitnessLevelId, r.FitnessLevel, u.UserTypeId
    FROM Users u
    INNER JOIN Validation v ON u.UserId = v.UserId
    LEFT JOIN RefFitnessLevel r ON u.FitnessLevelId = r.FitnessLevelId
    WHERE u.Email = ? AND v.ValidationValue = ? 
    AND u.IsActive = TRUE AND u.IsDeleted = FALSE
  `, [email, validationValue]) as mysql.RowDataPacket[][];
  
  return (rows as any[])[0] || null;
}

// Create User (replaces User_Save procedure)
export async function createUser(email: string, firstName: string, lastName: string, password: string) {
  const connection = await db.getConnection();
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
  // Generate username from email (part before @)
  const userName = email.split('@')[0];
  
  try {
    await connection.beginTransaction();
    
    // Insert user - now including UserName
    const [userResult] = await connection.execute(`
      INSERT INTO Users (UserName, Email, FirstName, LastName, CreatedOn, IsActive, IsDeleted)
      VALUES (?, ?, ?, ?, NOW(), TRUE, FALSE)
    `, [userName, email, firstName, lastName]) as mysql.ResultSetHeader[];
    
    const userId = (userResult as mysql.ResultSetHeader).insertId;
    
    // Insert validation
    await connection.execute(`
      INSERT INTO Validation (UserId, ValidationValue, CreatedOn)
      VALUES (?, ?, NOW())
    `, [userId, hashedPassword]);
    
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get User (replaces User_Get procedure)
export async function getUser(userId: number | null = null, email: string | null = null, userName: string | null = null) {
  let query = `
    SELECT 
      u.UserId, u.UserName, u.Email, u.FirstName, u.LastName,
      u.FitnessLevelId, r.FitnessLevel, u.UserTypeId, u.CreatedOn, u.IsActive
    FROM Users u
    LEFT JOIN RefFitnessLevel r ON u.FitnessLevelId = r.FitnessLevelId
    WHERE u.IsDeleted = FALSE
  `;
  
  const params: any[] = [];
  
  if (userId) {
    query += ' AND u.UserId = ?';
    params.push(userId);
  }
  if (email) {
    query += ' AND u.Email = ?';
    params.push(email);
  }
  if (userName) {
    query += ' AND u.UserName = ?';
    params.push(userName);
  }
  
  const [rows] = await db.execute(query, params) as mysql.RowDataPacket[][];
  return (rows as any[])[0] || null;
}

// Get User Fitness Plan (replaces UserFitnessPlan_Get procedure)
export async function getUserFitnessPlan(userId: number) {
  const [rows] = await db.execute(`
    SELECT
      ufp.UserId, ufp.ExerciseId, e.ExerciseEquipmentId, e.FitnessLevelId,
      e.Name AS ExerciseName, e.Description AS ExerciseDescription,
      ee.Name AS ExerciseEquipmentName, l.FitnessLevel,
      ufp.ExerciseTime, ufp.Distance, ufp.Sets, ufp.Reps, ufp.Weight
    FROM UserFitnessPlans ufp
    INNER JOIN Exercises e ON e.ExerciseId = ufp.ExerciseId
    INNER JOIN RefExerciseEquipment ee ON ee.ExerciseEquipmentId = e.ExerciseEquipmentId
    INNER JOIN RefFitnessLevel l ON l.FitnessLevelId = e.FitnessLevelId
    WHERE ufp.UserId = ?
  `, [userId]) as mysql.RowDataPacket[][];
  
  return rows as any[];
}

// Get User Exercise History (replaces UserExercise_GetHistory procedure)
export async function getUserExerciseHistory(userId: number, exerciseId: number | null = null, startDate: string | null = null, endDate: string | null = null) {
  let query = `
    SELECT 
      ue.UserExerciseId, ue.ExerciseId, e.Name AS ExerciseName,
      ue.ExerciseDate, ue.ExerciseStartTime, ue.ExerciseStopTime,
      ue.Distance, ue.Reps, ue.Weight
    FROM UserExercises ue
    INNER JOIN Exercises e ON ue.ExerciseId = e.ExerciseId
    WHERE ue.UserId = ?
  `;
  
  const params: any[] = [userId];
  
  if (exerciseId) {
    query += ' AND ue.ExerciseId = ?';
    params.push(exerciseId);
  }
  if (startDate) {
    query += ' AND ue.ExerciseDate >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND ue.ExerciseDate <= ?';
    params.push(endDate);
  }
  
  query += ' ORDER BY ue.ExerciseDate DESC, ue.ExerciseStartTime DESC';
  
  const [rows] = await db.execute(query, params) as mysql.RowDataPacket[][];
  return rows as any[];
}

// Save User Exercise (replaces UserExercise_Save procedure)
export async function saveUserExercise(
  userExerciseId: number, 
  userId: number, 
  exerciseId: number, 
  exerciseDate: string | null, 
  exerciseStartTime: string | null, 
  exerciseStopTime: string | null, 
  distance: number | null, 
  reps: number | null, 
  weight: number | null
) {
  if (userExerciseId > 0) {
    // Update existing
    await db.execute(`
      UPDATE UserExercises
      SET ExerciseDate = ?, ExerciseStartTime = ?, ExerciseStopTime = ?,
          Distance = ?, Reps = ?, Weight = ?
      WHERE UserExerciseId = ? AND UserId = ?
    `, [exerciseDate, exerciseStartTime, exerciseStopTime, distance, reps, weight, userExerciseId, userId]);
    
    return userExerciseId;
  } else {
    // Insert new
    const [result] = await db.execute(`
      INSERT INTO UserExercises (UserId, ExerciseId, ExerciseDate, ExerciseStartTime, ExerciseStopTime, Distance, Reps, Weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, exerciseId, exerciseDate, exerciseStartTime, exerciseStopTime, distance, reps, weight]) as mysql.ResultSetHeader[];
    
    return (result as mysql.ResultSetHeader).insertId;
  }
}

// Get All Exercises
export async function getAllExercises() {
  const [rows] = await db.execute(`
    SELECT 
      e.ExerciseId, e.Name, e.Description, 
      ee.Name AS EquipmentName, l.FitnessLevel,
      e.ExerciseTime, e.Distance, e.Sets, e.Reps, e.Weight
    FROM Exercises e
    INNER JOIN RefExerciseEquipment ee ON e.ExerciseEquipmentId = ee.ExerciseEquipmentId
    INNER JOIN RefFitnessLevel l ON l.FitnessLevelId = e.FitnessLevelId
    ORDER BY e.Name
  `) as mysql.RowDataPacket[][];
  
  return rows as any[];
}