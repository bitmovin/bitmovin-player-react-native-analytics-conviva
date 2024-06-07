export interface ConvivaConfig {
  /**
   * The `TOUCHSTONE_SERVICE_URL` for testing with Touchstone. Only to be used for development,
   * **must not be set in production or automated testing**.
   */
  gatewayUrl?: string;
  /**
   * Enables debug logging when set to true
   */
  debugLoggingEnabled: boolean;
}
