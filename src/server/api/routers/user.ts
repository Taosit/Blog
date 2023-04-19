import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  getUser,
  updateAvatar,
  updateBasicUserInfo,
  updateStudentCourses,
  updateUserColor,
} from "@/lib/dbActions";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.currentUser?.id;
      if (currentUserId !== input.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const user = await getUser(input.userId);
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return user;
    }),
  registerUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.enum(["STUDENT", "TEACHER"]),
        studentNumber: z.string(),
        courses: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.currentUser?.id;
      if (currentUserId !== input.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const user = await updateBasicUserInfo(
        input.userId,
        input.firstName,
        input.lastName,
        input.role,
        input.studentNumber
      );
      await updateAvatar(input.userId, "");
      await updateStudentCourses(input.userId, input.courses);
      await updateUserColor(input.userId, {
        h: Math.floor(Math.random() * 360),
        s: 100,
        l: 80,
      });
      return { user: { ...user, courses: input.courses } };
    }),
  updateBasicUserInfo: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        courses: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.currentUser?.id;
      if (currentUserId !== input.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const user = await updateBasicUserInfo(
        input.userId,
        input.firstName,
        input.lastName
      );
      await updateStudentCourses(input.userId, input.courses);
      return { user: { ...user, courses: input.courses } };
    }),
  updateUserColor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        color: z.object({
          h: z.number(),
          s: z.number(),
          l: z.number(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.currentUser?.id;
      if (currentUserId !== input.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const user = await updateUserColor(input.userId, input.color);
      return { color: user.color };
    }),
  updateUserAvatar: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        image: z.string(),
      })
    )
    .output(
      z.object({
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.currentUser?.id;
      if (currentUserId !== input.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const imageUrl = await uploadToCloudinary(input.image);
      await updateAvatar(input.userId, imageUrl.secure_url);
      return { image: imageUrl.secure_url };
    }),
});
