// Simple UUID v4 generator for native ID generation
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface NativeInstanceConfig {
  /**
   * Optionally user-defined string `id` for the native instance.
   * Used to access a certain native instance from any point in the source code then call
   * methods/properties on it.
   *
   * When left empty, a random `UUIDv4` is generated for it.
   * @example
   * Accessing or creating the `Player` with `nativeId` equal to `my-player`:
   * ```
   * const player = new Player({ nativeId: 'my-player' })
   * player.play(); // call methods and properties...
   * ```
   */
  nativeId?: string;
}

export default abstract class NativeInstance<
  Config extends NativeInstanceConfig,
> {
  /**
   * Optionally user-defined string `id` for the native instance, or UUIDv4.
   */
  readonly nativeId: string;

  /**
   * The configuration object used to initialize this instance.
   */
  readonly config?: Config;

  /**
   * Generate UUID in case the user-defined `nativeId` is empty.
   */
  constructor(config?: Config) {
    this.config = config;
    this.nativeId = config?.nativeId ?? uuidv4();
  }

  /**
   * Flag indicating whether the native resources of this object have been created internally
   * .i.e `initialize` has been called.
   */
  abstract isInitialized: boolean;

  /**
   * Create the native object/resources that will be managed by this instance.
   */
  abstract initialize(): void;

  /**
   * Flag indicating whether the native resources of this object have been disposed .i.e
   * `destroy` has been called.
   */
  abstract isDestroyed: boolean;

  /**
   * Dispose the native object/resources created by this instance during `initialize`.
   */
  abstract destroy(): void;
}
