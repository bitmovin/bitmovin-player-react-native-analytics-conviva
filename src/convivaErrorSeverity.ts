/**
 * All possible severity of errors reported to Conviva.
 */
export enum ConvivaErrorSeverity {
  /**
   * The error could prevent playback altogether.
   */
  FATAL = 'FATAL',
  /**
   * The error should not affect playback.
   */
  WARNING = 'WARNING',
}
