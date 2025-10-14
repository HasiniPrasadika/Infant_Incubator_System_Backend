// temperatureController.ts
import { Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/root";
import { emitTemperatureUpdate } from "../socket/socketEmitter";

// Save temperature data for a baby
export const saveTemperature = async (req: Request, res: Response) => {
  const { babyId, temperature, timestamp } = req.body;

  console.log("Received temperature data:", req.body); // Log incoming data

  if (!babyId || !temperature || !timestamp) {
    throw new BadRequestsException("Missing required fields", ErrorCode.MISSING_FIELD);
  }

  const temperatureRecord = await prismaClient.temperature.create({
    data: {
      babyId,
      temperature: parseFloat(temperature),
      timestamp: new Date(timestamp),
    },
  });

  // Emit real-time update
  emitTemperatureUpdate({
    babyId: babyId.toString(),
    temperature: parseFloat(temperature),
    timestamp: new Date(timestamp).toISOString(),
  });

  res.json(temperatureRecord);
};


// Get all temperature records for a baby within a given month
export const getTemperatureHistory = async (req: Request, res: Response) => {
  const { babyId, month, year } = req.params;

  // Ensure month and year are integers
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  // Create start and end dates for the given month and year
  const startDate = new Date(parsedYear, parsedMonth - 1, 1);  // First day of the month
  const endDate = new Date(parsedYear, parsedMonth, 0); // Last day of the month

  // Fetch temperature history from the database
  const temperatureHistory = await prismaClient.temperature.findMany({
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

  res.json(temperatureHistory);
};

