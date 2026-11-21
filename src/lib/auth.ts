
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import db from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    modelName: "users",

    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "student",
        input: true,
      },

      plan: {
        type: "string",
        required: true,
        defaultValue: "free",
        input: false,
      },

      phone: {
        type: "string",
        required: false,
        input: true,
      },

      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Only students and tutors can register publicly.
          if (
            user.role !== "student" &&
            user.role !== "tutor"
          ) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid registration role.",
            });
          }

          // Every new account starts with the free plan.
          return {
            data: {
              ...user,
              plan: "free",
            },
          };
        },
      },

      update: {
        before: async (user) => {
          // Prevent users from changing their own role.
          if ("role" in user) {
            throw new APIError("FORBIDDEN", {
              message: "You cannot change your account role.",
            });
          }

          return {
            data: user,
          };
        },
      },
    },
  },

   plugins: [jwt()],

  trustedOrigins: [
  "http://localhost:3000",
  "https://mentor-lagbe-flax.vercel.app",
],
});
