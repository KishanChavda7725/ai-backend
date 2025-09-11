import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
};
