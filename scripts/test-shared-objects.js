const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

// These tests exercise real JS orchestration across a controlled Expo boundary.
// They do not validate native serialization, playback, or Conviva delivery.
function fixture(overrides = {}, ssaiOverrides = {}) {
  const calls = [];
  const owner = {};
  const module = new Proxy(overrides, {
    get(target, name) {
      return (
        target[name] ??
        (async (...args) => {
          calls.push([name, ...args]);
          return name === 'create' ? owner : undefined;
        })
      );
    },
  });
  const ssai = new Proxy(ssaiOverrides, {
    get(target, name) {
      return target[name] ?? (async (...args) => calls.push([name, ...args]));
    },
  });
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const result = { exports: {} };
    cache.set(file, result);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    }).outputText;
    const requireMock = (name) => {
      if (name === 'expo-modules-core') {
        return {
          requireNativeModule: (name) =>
            name.endsWith('Ssai') ? ssai : module,
        };
      }
      if (name === 'react-native')
        return { Platform: { OS: 'ios' }, findNodeHandle: () => 42 };
      if (name.startsWith('.'))
        return load(path.resolve(path.dirname(file), `${name}.ts`));
      throw new Error(`Unexpected runtime dependency: ${name}`);
    };
    vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, {
      filename: file,
    })(requireMock, result, result.exports);
    return result.exports;
  }
  return {
    ...load(path.resolve(__dirname, '../src/convivaAnalytics.ts')),
    calls,
    owner,
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

test('initialization and commands share one creation attempt and await the player', async () => {
  const playerCreation = deferred();
  const { ConvivaAnalytics, calls, owner } = fixture();
  const conviva = new ConvivaAnalytics({
    customerKey: 'test',
    player: { native: playerCreation.promise },
  });
  const pending = [
    conviva.initialize(),
    conviva.initializeSession(),
    conviva.ssai.reportAdStarted({ id: 'ad' }),
  ];
  assert.equal(calls.length, 0);
  const player = {};
  playerCreation.resolve(player);
  await Promise.all(pending);
  assert.deepEqual(
    calls.map(([name]) => name),
    ['create', 'initializeSession', 'reportAdStarted']
  );
  assert.equal(calls[0][1], player);
  assert.equal(calls[1][1], owner);
  assert.equal(calls[2][1], owner);
  assert.equal(owner.player, player);
  assert.equal(conviva.isInitialized, true);
});

test('failed creation rejects all callers and a new alias can retry', async () => {
  const failure = new Error('creation failed');
  let attempts = 0;
  const { ConvivaAnalytics } = fixture({
    create: async () => {
      if (++attempts === 1) throw failure;
      return {};
    },
  });
  const config = { nativeId: 'alias', customerKey: 'test' };
  const failed = new ConvivaAnalytics(config);
  await assert.rejects(failed.initialize(), (error) => error === failure);
  await assert.rejects(
    failed.ssai.isAdBreakActive(),
    (error) => error === failure
  );
  assert.equal(failed.isInitialized, false);
  await new ConvivaAnalytics(config).initialize();
  assert.equal(attempts, 2);
});

test('release waits for pending creation and does not remove a newer alias', async () => {
  const creation = deferred();
  let attempts = 0;
  const owner = {};
  const releases = [];
  const { ConvivaAnalytics } = fixture({
    create: () => (++attempts === 1 ? creation.promise : Promise.resolve({})),
    release: async (owner) => releases.push(owner),
  });
  const config = { nativeId: 'alias', customerKey: 'test' };
  const first = new ConvivaAnalytics(config);
  const alias = new ConvivaAnalytics(config);
  assert.equal(first.native, alias.native);
  const released = first.destroy();
  assert.equal(releases.length, 0);
  const replacement = new ConvivaAnalytics(config);
  creation.resolve(owner);
  await released;
  await alias.destroy();
  assert.equal(releases[0], owner);
  assert.equal(new ConvivaAnalytics(config).native, replacement.native);
  assert.equal(first.isDestroyed, true);
});

test('late attachment waits for the player and retains only an accepted player', async () => {
  const attachments = [];
  const { ConvivaAnalytics, owner } = fixture({
    attachPlayer: async (...args) => {
      attachments.push(args);
      return attachments.length === 1;
    },
  });
  const conviva = new ConvivaAnalytics({ customerKey: 'test' });
  const creation = deferred();
  const attached = conviva.attachPlayer({ native: creation.promise });
  assert.equal(attachments.length, 0);
  const player = {};
  creation.resolve(player);
  await attached;
  await conviva.attachPlayer({ native: Promise.resolve({}) });
  assert.equal(attachments[0][0], owner);
  assert.equal(attachments[0][1], player);
  assert.equal(owner.player, player);
  await conviva.release();
  assert.equal(owner.player, undefined);
});

test('command, SSAI, and release failures reach callers', async () => {
  const failure = new Error('native command failed');
  const reject = async () => {
    throw failure;
  };
  const { ConvivaAnalytics } = fixture(
    { release: reject, updateContentMetadata: reject },
    { updateAdInfo: reject }
  );
  const conviva = new ConvivaAnalytics({ customerKey: 'test' });
  await assert.rejects(
    conviva.updateContentMetadata({ assetName: 'asset' }),
    (error) => error === failure
  );
  await assert.rejects(
    conviva.ssai.updateAdInfo({ id: 'ad' }),
    (error) => error === failure
  );
  await assert.rejects(conviva.release(), (error) => error === failure);
});

test('view association uses the resolved owner and the view tag', async () => {
  const { ConvivaAnalytics, calls, owner } = fixture();
  const conviva = new ConvivaAnalytics({ customerKey: 'test' });
  await conviva.setPlayerViewRef({ current: {} });
  await conviva.setPlayerViewRef(undefined);
  assert.deepEqual(calls.slice(1), [
    ['setPlayerViewRef', owner, 42],
    ['resetPlayerViewRef', owner],
  ]);
});

test('an older Player binding fails with a migration error before native creation', async () => {
  const { ConvivaAnalytics, calls } = fixture();
  const conviva = new ConvivaAnalytics({
    customerKey: 'test',
    player: { nativeId: 'legacy' },
  });
  await assert.rejects(
    conviva.initialize(),
    /SharedObject-based Player bindings/
  );
  assert.equal(calls.length, 0);
  const standalone = new ConvivaAnalytics({ customerKey: 'test' });
  await standalone.initialize();
  await assert.rejects(
    standalone.attachPlayer({ nativeId: 'legacy' }),
    /SharedObject-based Player bindings/
  );
  assert.equal(calls.filter(([name]) => name === 'attachPlayer').length, 0);
});
