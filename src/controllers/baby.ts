import { Request, Response } from "express";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad_requests";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

// Create new baby record
export const createBaby = async (req: Request, res: Response) => {
  const { birthWeight, currentWeight, birthDate, gender, notes } = req.body;

  const baby = await prismaClient.baby.create({
    data: {
      birthWeight,
      currentWeight,
      birthDate: new Date(birthDate),
      gender,
      notes,
    },
  });

  res.json(baby);
};

// Update existing baby record
export const updateBaby = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { birthWeight, currentWeight, birthDate, gender, notes } = req.body;

  const baby = await prismaClient.baby.findUnique({
    where: { id: parseInt(id), isDeleted: false },
  });

  if (!baby) {
    throw new NotFoundException("Baby record not found", ErrorCode.BABY_NOT_FOUND);
  }

  const updatedBaby = await prismaClient.baby.update({
    where: { id: parseInt(id) },
    data: {
      birthWeight,
      currentWeight,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender,
      notes,
    },
  });

  res.json(updatedBaby);
};

// Soft delete baby record
export const deleteBaby = async (req: Request, res: Response) => {
  const { id } = req.params;

  const baby = await prismaClient.baby.findUnique({
    where: { id: parseInt(id), isDeleted: false },
  });

  if (!baby) {
    throw new NotFoundException("Baby record not found", ErrorCode.BABY_NOT_FOUND);
  }

  await prismaClient.baby.update({
    where: { id: parseInt(id) },
    data: { isDeleted: true },
  });

  res.json({ message: "Baby record deleted successfully" });
};

// Get single baby record by id
export const getBabyById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const baby = await prismaClient.baby.findUnique({
    where: { id: parseInt(id), isDeleted: false },
  });

  if (!baby) {
    throw new NotFoundException("Baby record not found", ErrorCode.BABY_NOT_FOUND);
  }

  res.json(baby);
};

// Get all baby records
export const getAllBabies = async (req: Request, res: Response) => {
  const babies = await prismaClient.baby.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

  res.json(babies);
};
