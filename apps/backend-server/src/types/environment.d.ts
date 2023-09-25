export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      jwtSecret : string;
    }
  }
}