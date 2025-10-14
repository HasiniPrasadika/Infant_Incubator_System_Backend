// heartRateController.ts
import { Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/root";
import { emitHeartRateUpdate } from "../socket/socketEmitter";

// Save heart rate data for a baby
export const saveHeartRate = async (req: Request, res: Response) => {
  const { babyId, heartRate, timestamp } = req.body;

  console.log("Received heart rate data:", req.body);

  if (!babyId || !heartRate || !timestamp) {
    throw new BadRequestsException("Missing required fields", ErrorCode.MISSING_FIELD);
  }

  const heartRateRecord = await prismaClient.heartrate.create({
    data: {
      babyId,
      heartRate: parseFloat(heartRate),
      timestamp: new Date(timestamp),
    },
  });

  res.json(heartRateRecord);
};


// Get all heart rate records for a baby within a given month
export const getHeartRateHistory = async (req: Request, res: Response) => {
  const { babyId, month, year } = req.params;

  // Ensure month and year are integers
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  // Create start and end dates for the given month and year
  const startDate = new Date(parsedYear, parsedMonth - 1, 1);  // First day of the month
  const endDate = new Date(parsedYear, parsedMonth, 0); // Last day of the month

  // Fetch heart rate history from the database
  const heartRateHistory = await prismaClient.heartrate.findMany({
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

  res.json(heartRateHistory);
};

