export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      jwtSecret: string;
      frontEndURL: string;
      DATABASE_URL: string;
      AWS_S3_BUCKET: string;
      AWS_S3_ACCESS_KEY: string;
      AWS_S3_ACCESS_SECRET: string;
      PORT: number;
    }
  }
}
