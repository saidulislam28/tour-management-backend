import dotenv from "dotenv";

dotenv.config();

interface ENV_VARS {
  PORT: string;
  DB_URL: string;
  NODE_ENV: string;
  JWT_ACCESS_TOKEN_EXPIRES: string;
  JWT_SECRET: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASS: string;
  JWT_REFRESH_TOKEN_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  SSL: {
    SSL_STORE_ID: string;
    SSL_STORE_PASS: string;
    SSL_PAYMENT_API: string;
    SSL_VALIDATION_API: string;
    SSL_SUCCESS_URL: string;
    SSL_FAIL_URL: string;
    SSL_CANCEL_URL: string;
    FRONTEND_SUCCESS_URL: string;
    FRONTEND_FAIL_URL: string;
    FRONTEND_CANCEL_URL: string;
  },
  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  EMAIL_SENDER: {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_FROM: string;
    SMTP_PASS: string;
  }

}

const loadEnvVars = (): ENV_VARS => {
  const envArray: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_ACCESS_TOKEN_EXPIRES",
    "JWT_SECRET",
    "SUPER_ADMIN_PASS",
    "SUPER_ADMIN_EMAIL",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_TOKEN_EXPIRES",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "SSL_STORE_ID",
    "SSL_STORE_PASS",
    "SSL_PAYMENT_API",
    "SSL_VALIDATION_API",
    "SSL_SUCCESS_URL",
    "SSL_FAIL_URL",
    "SSL_CANCEL_URL",
    "FRONTEND_SUCCESS_URL",
    "FRONTEND_FAIL_URL",
    "FRONTEND_CANCEL_URL",
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_FROM",
    "SMTP_PASS",
  ];

  envArray.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Required env variables not found: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as string,
    JWT_ACCESS_TOKEN_EXPIRES: process.env.JWT_ACCESS_TOKEN_EXPIRES as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_TOKEN_EXPIRES: process.env.JWT_REFRESH_TOKEN_EXPIRES as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    SSL: {
      SSL_STORE_ID: process.env.SSL_STORE_ID as string,
      SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      SSL_SUCCESS_URL: process.env.SSL_SUCCESS_URL as string,
      SSL_FAIL_URL: process.env.SSL_FAIL_URL as string,
      SSL_CANCEL_URL: process.env.SSL_CANCEL_URL as string,
      FRONTEND_SUCCESS_URL: process.env.FRONTEND_SUCCESS_URL as string,
      FRONTEND_FAIL_URL: process.env.FRONTEND_FAIL_URL as string,
      FRONTEND_CANCEL_URL: process.env.FRONTEND_CANCEL_URL as string,
    },
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
    }
  };
};

export const envVars = loadEnvVars();
