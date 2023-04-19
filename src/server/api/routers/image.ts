import { uploadToCloudinary } from "@/lib/cloudinary";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const imageRouter = createTRPCRouter({
  uploadImage: protectedProcedure
    .input(z.string())
    .output(z.string())
    .mutation(async ({ input }) => {
      const image = await uploadToCloudinary(input);
      if (!image) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return image.secure_url;
    }),
});
