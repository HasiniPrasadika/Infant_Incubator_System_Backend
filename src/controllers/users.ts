import { Request, Response } from "express";
import {
  CreateUserSchema,
} from "../schema/users";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcryptjs";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad_requests";

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

