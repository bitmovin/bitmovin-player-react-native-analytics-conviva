import type { NativeConviva } from './modules/BitmovinPlayerReactNativeAnalyticsConvivaModule';

// Compatibility aliases live only in JS. Labels alone never keep native objects alive.
const instances = new Map<string, WeakRef<Promise<NativeConviva>>>();

export const legacyConvivaRegistry = {
  create(
    nativeId: string,
    factory: () => Promise<NativeConviva>
  ): Promise<NativeConviva> {
    const cached = instances.get(nativeId)?.deref();
    if (cached) return cached;
    for (const [id, reference] of instances) {
      if (!reference.deref()) instances.delete(id);
    }
    const creation = factory();
    instances.set(nativeId, new WeakRef(creation));
    void creation.catch(() => this.remove(nativeId, creation));
    return creation;
  },

  remove(nativeId: string, creation: Promise<NativeConviva>): void {
    if (instances.get(nativeId)?.deref() === creation)
      instances.delete(nativeId);
  },
};
