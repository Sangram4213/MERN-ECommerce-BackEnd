import { NextFunction } from "express";
import { Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;

    let user = await User.findById(_id);
    if (user)
      return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
      });
    if (!name || !email || !photo || !gender || !_id || !dob) {
      return next(new ErrorHandler("Please add all field", 400));
    }
    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user)
    return res.status(200).json({
      success: true,
      user,
    });

  return next(new ErrorHandler("User is not found", 404));
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler("User is not found", 404));

  await User.findByIdAndDelete(req.params.id);
  
  return res.status(200).json({
    success: true,
    message: `User ${user.name} detailed is deleted`,
  });
});
