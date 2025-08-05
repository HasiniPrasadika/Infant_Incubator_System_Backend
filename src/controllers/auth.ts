import { NextFunction, Request, Response } from "express";
import { AdminSignUpSchema } from "../schema/users";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad_requests";
import { NotFoundException } from "../exceptions/not-found";
import { JWT_SECRET } from "../secrets";

//Initialize the admin user
export const initializeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  AdminSignUpSchema.parse(req.body);
  const { username, password } = req.body;

  let admin = await prismaClient.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (admin) {
    throw new BadRequestsException(
      "Admin already exists!",
      ErrorCode.ADMIN_ALREADY_EXISTS
    );
  }

  admin = await prismaClient.user.create({
    data: {
      username,
      password: hashSync(password, 10),
      role: "ADMIN",
    },
  });

  res.json(admin);
};

//Login
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  let user = await prismaClient.user.findUnique({
    where: { username }
  });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    },
  });
};

//Get the logged in user details
export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};


