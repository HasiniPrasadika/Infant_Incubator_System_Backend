// humidityController.ts
import { Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/root";
import { emitHumidityUpdate } from "../socket/socketEmitter";

// Save humidity data for a baby
export const saveHumidity = async (req: Request, res: Response) => {
  const { babyId, humidity, timestamp } = req.body;

  console.log("Received humidity data:", req.body); // Log incoming data

  if (!babyId || !humidity || !timestamp) {
    throw new BadRequestsException("Missing required fields", ErrorCode.MISSING_FIELD);
  }

  const humidityRecord = await prismaClient.humidity.create({
    data: {
      babyId,
      humidity: parseFloat(humidity),
      timestamp: new Date(timestamp),
    },
  });

  // Emit real-time update
  emitHumidityUpdate({
    babyId: babyId.toString(),
    humidity: parseFloat(humidity),
    timestamp: new Date(timestamp).toISOString(),
  });

  res.json(humidityRecord);
};


// Get all humidity records for a baby within a given month
export const getHumidityHistory = async (req: Request, res: Response) => {
  const { babyId, month, year } = req.params;

  // Ensure month and year are integers
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  // Create start and end dates for the given month and year
  const startDate = new Date(parsedYear, parsedMonth - 1, 1);  // First day of the month
  const endDate = new Date(parsedYear, parsedMonth, 0); // Last day of the month

  // Fetch humidity history from the database
  const humidityHistory = await prismaClient.humidity.findMany({
    where: {
      babyId: parseInt(babyId),
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  res.json(humidityHistory);
};

