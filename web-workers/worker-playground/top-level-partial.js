function workerMethod() {
  throw new Error("Top level contributed this before throwing");
}
throw new Error("Recover from this please");
