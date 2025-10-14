import { Request, Response } from "express";
import {
  CreateUserSchema,
} from "../schema/users";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcryptjs";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad_requests";
import { NotFoundException } from "../exceptions/not-found";

//Create Users(Doctors, Nurses, Parents)
export const createUser = async (req: Request, res: Response) => {
  CreateUserSchema.parse(req.body);
  const {
    name,
    username,
    password,
    phoneNumber,
    role,
    nic
  } = req.body;

  let user = await prismaClient.user.findUnique({
    where: { username }
  });
  if (user) {
    throw new BadRequestsException(
      "Username already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  user = await prismaClient.user.create({
    data: {
      name,
      username,
      password: hashSync(password, 10),
      phoneNumber,
      role,
      nic
    }
  });

  res.json(user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    where: {
      role: {
        not: "ADMIN",  
      },
    },
    orderBy: { 
      createdAt: "desc" 
    },
  });

  res.json(users);
};

export const generateInviteLink = async (req: Request, res: Response) => {
  const { babyId } = req.body;

  // Check if the baby exists
  const baby = await prismaClient.baby.findUnique({
    where: { id: babyId },
  });
  if (!baby) {
    throw new NotFoundException("Baby not found", ErrorCode.BABY_NOT_FOUND);
  }

  // Generate the invite link
  const inviteLink = `${process.env.FRONTEND_URL}/register?babyId=${babyId}`;

  // Send the invite link back to the doctor
  res.json({ inviteLink });
};

export const registerParent = async (req: Request, res: Response) => {
  const { babyId, username, password } = req.body;

  // Validate input
  if (!babyId || !username || !password) {
    throw new BadRequestsException("Missing required fields", ErrorCode.MISSING_FIELD);
  }

  // Check if the parent already exists
  const existingUser = await prismaClient.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    throw new BadRequestsException("Username already exists", ErrorCode.USER_ALREADY_EXISTS);
  }

  // Register the parent
  const parent = await prismaClient.user.create({
    data: {
      username,
      password: hashSync(password, 10),
      role: "PARENT",
      babyId: babyId,  // Associate the parent with the baby
    },
  });

  res.json({ message: "Parent registered successfully", user: parent });
};


