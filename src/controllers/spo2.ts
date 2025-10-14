// spo2Controller.ts
import { Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/root";
import { emitSpo2Update } from "../socket/socketEmitter";

// Save spo2 data for a baby
export const saveSpo2 = async (req: Request, res: Response) => {
  const { babyId, spo2, timestamp } = req.body;

  console.log("Received spo2 data:", req.body); // Log incoming data

  if (!babyId || !spo2 || !timestamp) {
    throw new BadRequestsException("Missing required fields", ErrorCode.MISSING_FIELD);
  }

  const spo2Record = await prismaClient.spo2.create({
    data: {
      babyId,
      spo2: parseFloat(spo2),
      timestamp: new Date(timestamp),
    },
  });

  // Emit real-time update
  emitSpo2Update({
    babyId: babyId.toString(),
    spo2: parseFloat(spo2),
    timestamp: new Date(timestamp).toISOString(),
  });

  res.json(spo2Record);
};


// Get all spo2 records for a baby within a given month
export const getSpo2History = async (req: Request, res: Response) => {
  const { babyId, month, year } = req.params;

  // Ensure month and year are integers
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  // Create start and end dates for the given month and year
  const startDate = new Date(parsedYear, parsedMonth - 1, 1);  // First day of the month
  const endDate = new Date(parsedYear, parsedMonth, 0); // Last day of the month

  // Fetch spo2 history from the database
  const spo2History = await prismaClient.spo2.findMany({
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

  res.json(spo2History);
};

