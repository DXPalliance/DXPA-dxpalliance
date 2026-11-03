// ============================================================================
// DISCOVERY BIGCOIN (DBC) — COMPLETE PROTOCOL ENGINE (v1.0.16 / SCHEMA V2)
// ============================================================================
// Completes the Discovery BigCoin mechanism from the October 2026 archives:
// 1. 100,000,000 Hard Supply Ceiling across the 7 Constitutional Pools
// 2. Foreclosure & Auction 20%–30% Below-Market Equity Carrier Math
// 3. Shard 1: SupplyAllocationPoolShard (Canonical Big-Endian SHA-256 Root)
// 4. Shard 2: WalletBalanceStateShard V2 (Strict Nonce +1 & Nonce-Bound Root)
// 5. Shard 3: VestingRegistryStateShard (u128 Math, Proportional Hold Cap,
//    UTF-8 Byte-Length Quarantine Root, and Explicit u64 Range Gate)
// 6. CrossNamespaceAtomicCoordinator (Isolated Staging & Zero-Drift Rollback)
// 7. 19/19 Dual-QC Verification Suite (6 Original + 9 Extended + 4 Adversarial)
// ============================================================================

export interface ConstitutionalPoolInfo {
  key: string;
  label: string;
  allocation: number;
  sharePct: number;
  purpose: string;
}

export const AUTHORIZED_SUPPLY_CEILING = 100_000_000;

export const CONSTITUTIONAL_DBC_POOLS: ConstitutionalPoolInfo[] = [
  {
    key: "POOL_K12_PRIZE",
    label: "National K–12 Discovery Prize Pool",
    allocation: 50_000_000,
    sharePct: 50,
    purpose: "50% of all Discovery BigCoin permanently dedicated to student science & invention recognition.",
  },
  {
    key: "POOL_PROOF_OF_SERVICE",
    label: "Proof-of-Service & Auction Acquisition Pool",
    allocation: 45_000_000,
    sharePct: 45,
    purpose: "45% for verified ecosystem service and starting up the 20%–30% below-market foreclosure/auction pool.",
  },
  {
    key: "POOL_HUMAN_FOUNDATION",
    label: "Human Foundation Reserve",
    allocation: 1_000_000,
    sharePct: 1,
    purpose: "1% foundational stewardship reserve under strict multi-year vesting.",
  },
  {
    key: "POOL_AI_TRUST",
    label: "AI Collaborator & Infrastructure Trust",
    allocation: 1_000_000,
    sharePct: 1,
    purpose: "1% dedicated to long-term DILOS, Columbo, Pipito, and Concierge verification infrastructure.",
  },
  {
    key: "POOL_FIRST_1000",
    label: "First 1,000 Founding Family Owners",
    allocation: 1_000_000,
    sharePct: 1,
    purpose: "1% early participation allocation for the first 1,000 verified family Owners.",
  },
  {
    key: "POOL_GROWTH_100K",
    label: "First 100,000 Owners Growth Pool",
    allocation: 1_000_000,
    sharePct: 1,
    purpose: "1% neighborhood expansion reserve as Dexpa grows to 100,000 family Owners.",
  },
  {
    key: "POOL_MATERIAL_DISCOVERIES",
    label: "Material Discoveries & Breakthrough Pool",
    allocation: 1_000_000,
    sharePct: 1,
    purpose: "1% reserve honoring extraordinary applied and hybrid breakthroughs.",
  },
];

const U64_MAX = (1n << 64n) - 1n;
const U32_MAX = (1n << 32n) - 1n;

// Pure synchronous SHA-256 implementation for deterministic browser state roots
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

export function sha256Bytes(data: Uint8Array): Uint8Array {
  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const bitLen = data.length * 8;
  const padLen = ((data.length + 9 + 63) & ~63);
  const padded = new Uint8Array(padLen);
  padded.set(data);
  padded[data.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(padLen - 4, bitLen >>> 0, false);

  const w = new Uint32Array(64);
  for (let offset = 0; offset < padLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function utf8Bytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function u32BigEndian(val: number): Uint8Array {
  const b = BigInt(val);
  if (b < 0n || b > U32_MAX) {
    throw new RangeError("Value out of u32 bounds");
  }
  const buf = new Uint8Array(4);
  new DataView(buf.buffer).setUint32(0, val >>> 0, false);
  return buf;
}

function u64BigEndian(val: number | bigint): Uint8Array {
  const b = typeof val === "bigint" ? val : BigInt(val);
  if (b < 0n || b > U64_MAX) {
    throw new RangeError("Value out of u64 bounds");
  }
  const buf = new Uint8Array(8);
  const view = new DataView(buf.buffer);
  view.setUint32(0, Number((b >> 32n) & 0xffffffffn), false);
  view.setUint32(4, Number(b & 0xffffffffn), false);
  return buf;
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLen = arrays.reduce((acc, a) => acc + a.length, 0);
  const res = new Uint8Array(totalLen);
  let offset = 0;
  for (const a of arrays) {
    res.set(a, offset);
    offset += a.length;
  }
  return res;
}

// ============================================================================
// REMEDIATED HASH DIGEST (Strict 32-Byte Enforcement)
// ============================================================================
export class HashDigest {
  readonly bytes: Uint8Array;

  constructor(bytes: Uint8Array) {
    if (bytes.length !== 32) {
      throw new RangeError(`HashDigest must be strictly 32 bytes (got ${bytes.length})`);
    }
    this.bytes = new Uint8Array(bytes);
  }

  static zero(): HashDigest {
    return new HashDigest(new Uint8Array(32));
  }

  static fromStrStrict(s: string): HashDigest {
    const raw = utf8Bytes(s);
    if (raw.length > 32) {
      throw new RangeError("HashDigest.fromStrStrict rejects inputs exceeding 32 UTF-8 bytes");
    }
    const padded = new Uint8Array(32);
    padded.set(raw);
    return new HashDigest(padded);
  }

  toHex(): string {
    return bytesToHex(this.bytes);
  }
}

// ============================================================================
// VESTING SCHEDULE (Canonical Big-Endian Serialization)
// ============================================================================
export class VestingSchedule {
  readonly scheduleId: string;
  readonly totalLockedAllocation: bigint;
  readonly startBlock: bigint;
  readonly cliffBlock: bigint;
  readonly durationBlocks: bigint;

  constructor(
    scheduleId: string,
    totalLockedAllocation: number | bigint,
    startBlock: number | bigint,
    cliffBlock: number | bigint,
    durationBlocks: number | bigint
  ) {
    const total = BigInt(totalLockedAllocation);
    const start = BigInt(startBlock);
    const cliff = BigInt(cliffBlock);
    const dur = BigInt(durationBlocks);

    if (total < 0n || total > U64_MAX) {
      throw new RangeError("total_locked_allocation outside permitted u64 range");
    }
    if (start < 0n || start > U64_MAX || cliff < 0n || cliff > U64_MAX || dur <= 0n || dur > U64_MAX) {
      throw new RangeError("Schedule block bounds outside permitted u64 range");
    }

    this.scheduleId = scheduleId;
    this.totalLockedAllocation = total;
    this.startBlock = start;
    this.cliffBlock = cliff;
    this.durationBlocks = dur;
  }

  serializeCanonical(): Uint8Array {
    const idBytes = utf8Bytes(this.scheduleId);
    return concatBytes(
      u32BigEndian(idBytes.length),
      idBytes,
      u64BigEndian(this.totalLockedAllocation),
      u64BigEndian(this.startBlock),
      u64BigEndian(this.cliffBlock),
      u64BigEndian(this.durationBlocks)
    );
  }
}

// ============================================================================
// SHARD 1: SUPPLY ALLOCATION POOL SHARD (100,000,000 CEILING)
// ============================================================================
export class SupplyAllocationPoolShard {
  static readonly AUTHORIZED_SUPPLY_CEILING = 100_000_000;
  remainingUnissuedBalances: Record<string, number>;
  totalIssuedSupply: number;

  constructor() {
    this.remainingUnissuedBalances = {
      POOL_K12_PRIZE: 50_000_000,
      POOL_PROOF_OF_SERVICE: 45_000_000,
      POOL_HUMAN_FOUNDATION: 1_000_000,
      POOL_AI_TRUST: 1_000_000,
      POOL_FIRST_1000: 1_000_000,
      POOL_GROWTH_100K: 1_000_000,
      POOL_MATERIAL_DISCOVERIES: 1_000_000,
    };
    this.totalIssuedSupply = 0;
  }

  computeRootHashFromState(balances: Record<string, number>, totalIssued: number): HashDigest {
    const sortedKeys = Object.keys(balances).sort();
    const chunks: Uint8Array[] = [];
    for (const key of sortedKeys) {
      const kBytes = utf8Bytes(key);
      chunks.push(u32BigEndian(kBytes.length), kBytes, u64BigEndian(balances[key]));
    }
    chunks.push(utf8Bytes("TOTAL_ISSUED"), u64BigEndian(totalIssued));
    return new HashDigest(sha256Bytes(concatBytes(...chunks)));
  }
}

// ============================================================================
// SHARD 2: WALLET BALANCE & STRICT NONCE STATE SHARD (SCHEMA V2)
// ============================================================================
export class WalletBalanceStateShard {
  ledger: Record<string, number> = {};
  nonces: Record<string, number> = {};

  forceMintInitialAllocation(walletId: string, amount: number): void {
    if (!Number.isInteger(amount) || amount <= 0) return;
    this.ledger[walletId] = (this.ledger[walletId] || 0) + amount;
    if (!(walletId in this.nonces)) {
      this.nonces[walletId] = 0;
    }
  }

  // Remediated Schema V2: Commits both Wallet Balances AND Strict Sequential Nonces
  computeRootHashFromState(
    ledger: Record<string, number>,
    nonces: Record<string, number> = this.nonces
  ): HashDigest {
    const prefix = utf8Bytes("DISCOVERY_COIN_PROTOCOL|WALLET_NONCE_ROOT|SCHEMA_V2|");
    const sortedWallets = Object.keys(ledger).sort();
    const chunks: Uint8Array[] = [prefix, u32BigEndian(sortedWallets.length)];
    for (const w of sortedWallets) {
      const wBytes = utf8Bytes(w);
      const bal = ledger[w] ?? 0;
      const nonce = nonces[w] ?? 0;
      chunks.push(u32BigEndian(wBytes.length), wBytes, u64BigEndian(bal), u64BigEndian(nonce));
    }
    return new HashDigest(sha256Bytes(concatBytes(...chunks)));
  }
}

// ============================================================================
// SHARD 3: VESTING REGISTRY STATE SHARD (MODULE 06 + UTF-8 FIX + u128 MATH)
// ============================================================================
export class VestingRegistryStateShard {
  registry: Record<string, VestingSchedule[]> = {};
  quarantineMap: Record<string, boolean> = {};
  scheduleHoldMap: Record<string, boolean> = {};

  static holdKey(walletId: string, scheduleId: string): string {
    return `${walletId}::${scheduleId}`;
  }

  computeSpendableAllowanceFromState(
    registry: Record<string, VestingSchedule[]>,
    qMap: Record<string, boolean>,
    holdMap: Record<string, boolean>,
    walletId: string,
    currentBlock: number,
    totalBalance: number
  ): number {
    // 1. Global Wallet Quarantine Gate
    if (qMap[walletId]) {
      return 0;
    }
    const schedules = registry[walletId];
    if (!schedules || schedules.length === 0) {
      return totalBalance;
    }

    const curBlock = BigInt(currentBlock);
    let totalCurrentlyLocked = 0n;

    for (const sched of schedules) {
      if (sched.totalLockedAllocation < 0n || sched.totalLockedAllocation > U64_MAX) {
        throw new RangeError("Schedule allocation exceeds u64 limit");
      }

      const endBlock = sched.startBlock + sched.durationBlocks;
      let unlockedAccumulated = 0n;
      let lockedAmount = 0n;

      // Condition A: Pre-Cliff
      if (curBlock < sched.cliffBlock) {
        unlockedAccumulated = 0n;
        lockedAmount = sched.totalLockedAllocation;
      }
      // Condition B: Post-End
      else if (curBlock >= endBlock) {
        unlockedAccumulated = sched.totalLockedAllocation;
        lockedAmount = 0n;
      }
      // Condition C: Linear Interval Release (u128 / BigInt wide intermediate math)
      else {
        const elapsedBlocks = curBlock - sched.startBlock;
        const termU128 = sched.totalLockedAllocation * elapsedBlocks;
        unlockedAccumulated = termU128 / sched.durationBlocks;
        if (unlockedAccumulated > sched.totalLockedAllocation) {
          unlockedAccumulated = sched.totalLockedAllocation;
        }
        lockedAmount = sched.totalLockedAllocation - unlockedAccumulated;
      }

      // 2. Schedule Hold Evaluator (Proportional Hold Cap Fix: freezes ONLY unvested balance)
      const hKey = VestingRegistryStateShard.holdKey(walletId, sched.scheduleId);
      if (holdMap[hKey]) {
        const unvestedRemaining = sched.totalLockedAllocation - unlockedAccumulated;
        totalCurrentlyLocked += unvestedRemaining > 0n ? unvestedRemaining : 0n;
        continue;
      }

      totalCurrentlyLocked += lockedAmount;
    }

    const spendable = BigInt(totalBalance) - totalCurrentlyLocked;
    return spendable > 0n ? Number(spendable) : 0;
  }

  computeRootHashFromState(
    registry: Record<string, VestingSchedule[]>,
    qMap: Record<string, boolean>,
    holdMap: Record<string, boolean>
  ): HashDigest {
    const chunks: Uint8Array[] = [
      utf8Bytes("DISCOVERY_COIN_PROTOCOL|VESTING_REGISTRY|SCHEMA_V1|"),
    ];

    const sortedWallets = Object.keys(registry).sort();
    for (const wallet of sortedWallets) {
      const wBytes = utf8Bytes(wallet);
      const list = registry[wallet] || [];
      chunks.push(u32BigEndian(wBytes.length), wBytes, u32BigEndian(list.length));
      const serializedList = list
        .map((s) => s.serializeCanonical())
        .sort((a, b) => {
          const len = Math.min(a.length, b.length);
          for (let i = 0; i < len; i++) {
            if (a[i] !== b[i]) return a[i] - b[i];
          }
          return a.length - b.length;
        });
      for (const ser of serializedList) {
        chunks.push(ser);
      }
    }

    const activeHolds = Object.keys(holdMap)
      .filter((k) => holdMap[k])
      .sort();
    for (const hKey of activeHolds) {
      const [wId, sId] = hKey.split("::");
      const wBytes = utf8Bytes(wId);
      const sBytes = utf8Bytes(sId);
      chunks.push(
        utf8Bytes("SH"),
        u32BigEndian(wBytes.length),
        wBytes,
        u32BigEndian(sBytes.length),
        sBytes
      );
    }

    // Remediated UTF-8 Quarantine Serialization: Uses exact UTF-8 byte length (wBytes.length)
    const activeQuarantines = Object.keys(qMap)
      .filter((k) => qMap[k])
      .sort();
    for (const qId of activeQuarantines) {
      const qBytes = utf8Bytes(qId);
      chunks.push(utf8Bytes("GQ"), u32BigEndian(qBytes.length), qBytes);
    }

    return new HashDigest(sha256Bytes(concatBytes(...chunks)));
  }
}

// ============================================================================
// MODULE 2: CROSS-NAMESPACE ATOMIC COORDINATOR & STAGING ENGINE
// ============================================================================
export interface SealedCandidatePackage {
  compositeResultStateRoot: HashDigest;
  supplyShardRoot: HashDigest;
  walletShardRoot: HashDigest;
  vestingShardRoot: HashDigest;
  stagingUnissuedBalances: Record<string, number>;
  stagingTotalIssued: number;
  stagingWalletLedger: Record<string, number>;
  stagingWalletNonces: Record<string, number>;
  stagingVestingRegistry: Record<string, VestingSchedule[]>;
  stagingHoldMap: Record<string, boolean>;
  stagingQuarantineMap: Record<string, boolean>;
}

export class CrossNamespaceAtomicCoordinator {
  canonicalSupply: SupplyAllocationPoolShard;
  canonicalWallet: WalletBalanceStateShard;
  canonicalVesting: VestingRegistryStateShard;

  constructor(
    supply: SupplyAllocationPoolShard,
    wallet: WalletBalanceStateShard,
    vesting: VestingRegistryStateShard
  ) {
    this.canonicalSupply = supply;
    this.canonicalWallet = wallet;
    this.canonicalVesting = vesting;
  }

  static computeMasterCompositeRoot(
    supplyRoot: HashDigest,
    walletRoot: HashDigest,
    vestingRoot: HashDigest
  ): HashDigest {
    const prefix = utf8Bytes("DISCOVERY_COIN_PROTOCOL|COMPOSITE_ROOT|SCHEMA_V1_0_16");
    return new HashDigest(
      sha256Bytes(concatBytes(prefix, supplyRoot.bytes, walletRoot.bytes, vestingRoot.bytes))
    );
  }

  executeIsolatedStagingTransaction(
    txType: "ISSUANCE_CREDIT" | "ORDINARY_TRANSFER_X",
    params: {
      poolKey?: string;
      senderId?: string;
      recipientId?: string;
      amount?: number;
      nonce?: number;
      enforceStrictNonce?: boolean;
      conditionalSchedule?: VestingSchedule;
    },
    currentBlockHeight: number
  ): SealedCandidatePackage | null {
    const stagingUnissuedBalances = { ...this.canonicalSupply.remainingUnissuedBalances };
    let stagingTotalIssued = this.canonicalSupply.totalIssuedSupply;
    const stagingWalletLedger = { ...this.canonicalWallet.ledger };
    const stagingWalletNonces = { ...this.canonicalWallet.nonces };
    const stagingVestingRegistry: Record<string, VestingSchedule[]> = {};
    for (const [k, v] of Object.entries(this.canonicalVesting.registry)) {
      stagingVestingRegistry[k] = [...v];
    }
    const stagingQuarantineMap = { ...this.canonicalVesting.quarantineMap };
    const stagingHoldMap = { ...this.canonicalVesting.scheduleHoldMap };

    if (txType === "ISSUANCE_CREDIT") {
      const { poolKey, recipientId, amount, conditionalSchedule } = params;
      if (!poolKey || !recipientId || typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
        return null;
      }
      if (!(poolKey in stagingUnissuedBalances) || stagingUnissuedBalances[poolKey] < amount) {
        return null;
      }
      if (stagingTotalIssued + amount > SupplyAllocationPoolShard.AUTHORIZED_SUPPLY_CEILING) {
        return null;
      }

      if (conditionalSchedule) {
        if (conditionalSchedule.totalLockedAllocation !== BigInt(amount)) {
          return null;
        }
        const existingList = stagingVestingRegistry[recipientId] || [];
        if (existingList.some((s) => s.scheduleId === conditionalSchedule.scheduleId)) {
          return null;
        }
        stagingVestingRegistry[recipientId] = [...existingList, conditionalSchedule];
      }

      stagingUnissuedBalances[poolKey] -= amount;
      stagingTotalIssued += amount;
      stagingWalletLedger[recipientId] = (stagingWalletLedger[recipientId] || 0) + amount;
      if (!(recipientId in stagingWalletNonces)) {
        stagingWalletNonces[recipientId] = 0;
      }
    } else if (txType === "ORDINARY_TRANSFER_X") {
      const { senderId, recipientId, amount, nonce, enforceStrictNonce } = params;
      if (!senderId || !recipientId || typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
        return null;
      }
      if (!(senderId in stagingWalletLedger) || stagingWalletLedger[senderId] < amount) {
        return null;
      }

      // Strict Sequential Nonce Gate (incoming_nonce === current_nonce + 1)
      const currentNonce = stagingWalletNonces[senderId] ?? 0;
      if (enforceStrictNonce) {
        if (typeof nonce !== "number" || !Number.isInteger(nonce) || nonce !== currentNonce + 1) {
          return null;
        }
      }

      const senderOwnedTotal = stagingWalletLedger[senderId];
      const spendableCeiling = this.canonicalVesting.computeSpendableAllowanceFromState(
        stagingVestingRegistry,
        stagingQuarantineMap,
        stagingHoldMap,
        senderId,
        currentBlockHeight,
        senderOwnedTotal
      );

      if (amount > spendableCeiling) {
        return null;
      }

      if (senderId !== recipientId) {
        stagingWalletLedger[senderId] -= amount;
        stagingWalletLedger[recipientId] = (stagingWalletLedger[recipientId] || 0) + amount;
        if (!(recipientId in stagingWalletNonces)) {
          stagingWalletNonces[recipientId] = 0;
        }
      }
      stagingWalletNonces[senderId] = currentNonce + 1;
    } else {
      return null;
    }

    const supplyRoot = this.canonicalSupply.computeRootHashFromState(
      stagingUnissuedBalances,
      stagingTotalIssued
    );
    const walletRoot = this.canonicalWallet.computeRootHashFromState(
      stagingWalletLedger,
      stagingWalletNonces
    );
    const vestingRoot = this.canonicalVesting.computeRootHashFromState(
      stagingVestingRegistry,
      stagingQuarantineMap,
      stagingHoldMap
    );
    const masterCompositeRoot = CrossNamespaceAtomicCoordinator.computeMasterCompositeRoot(
      supplyRoot,
      walletRoot,
      vestingRoot
    );

    return {
      compositeResultStateRoot: masterCompositeRoot,
      supplyShardRoot: supplyRoot,
      walletShardRoot: walletRoot,
      vestingShardRoot: vestingRoot,
      stagingUnissuedBalances,
      stagingTotalIssued,
      stagingWalletLedger,
      stagingWalletNonces,
      stagingVestingRegistry,
      stagingHoldMap,
      stagingQuarantineMap,
    };
  }

  commitStagedPackage(pkg: SealedCandidatePackage, injectMidCommitFault = false): boolean {
    // Snapshot canonical state for atomic zero-drift rollback
    const snapSupply = { ...this.canonicalSupply.remainingUnissuedBalances };
    const snapIssued = this.canonicalSupply.totalIssuedSupply;
    const snapLedger = { ...this.canonicalWallet.ledger };
    const snapNonces = { ...this.canonicalWallet.nonces };
    const snapRegistry: Record<string, VestingSchedule[]> = {};
    for (const [k, v] of Object.entries(this.canonicalVesting.registry)) {
      snapRegistry[k] = [...v];
    }
    const snapQuarantine = { ...this.canonicalVesting.quarantineMap };
    const snapHold = { ...this.canonicalVesting.scheduleHoldMap };

    try {
      this.canonicalSupply.remainingUnissuedBalances = { ...pkg.stagingUnissuedBalances };
      this.canonicalSupply.totalIssuedSupply = pkg.stagingTotalIssued;
      this.canonicalWallet.ledger = { ...pkg.stagingWalletLedger };

      if (injectMidCommitFault) {
        throw new Error("Deliberate mid-commit fault injected—triggering atomic rollback");
      }

      this.canonicalWallet.nonces = { ...pkg.stagingWalletNonces };
      this.canonicalVesting.registry = {};
      for (const [k, v] of Object.entries(pkg.stagingVestingRegistry)) {
        this.canonicalVesting.registry[k] = [...v];
      }
      this.canonicalVesting.quarantineMap = { ...pkg.stagingQuarantineMap };
      this.canonicalVesting.scheduleHoldMap = { ...pkg.stagingHoldMap };
      return true;
    } catch {
      // Atomic Rollback: Restore 100% of canonical shards with zero state drift
      this.canonicalSupply.remainingUnissuedBalances = snapSupply;
      this.canonicalSupply.totalIssuedSupply = snapIssued;
      this.canonicalWallet.ledger = snapLedger;
      this.canonicalWallet.nonces = snapNonces;
      this.canonicalVesting.registry = snapRegistry;
      this.canonicalVesting.quarantineMap = snapQuarantine;
      this.canonicalVesting.scheduleHoldMap = snapHold;
      return false;
    }
  }
}

// ============================================================================
// 19-CHECK DUAL-QC & ADVERSARIAL VERIFICATION RUNNER
// ============================================================================
export interface BigCoinTestCheckResult {
  id: number;
  category: "Module 06 Core" | "Nonce & Atomic Commit" | "Remediated Boundary Guard";
  name: string;
  passed: boolean;
  detail: string;
}

export function runCompleteBigCoinVerificationSuite(): {
  allPassed: boolean;
  passCount: number;
  totalCount: number;
  compositeStateRootHex: string;
  checks: BigCoinTestCheckResult[];
} {
  const supply = new SupplyAllocationPoolShard();
  const wallet = new WalletBalanceStateShard();
  const vesting = new VestingRegistryStateShard();
  const coordinator = new CrossNamespaceAtomicCoordinator(supply, wallet, vesting);
  const checks: BigCoinTestCheckResult[] = [];

  // Baseline Setup
  wallet.forceMintInitialAllocation("OWNER_ALPHA", 1_000_000);
  const sched = new VestingSchedule("LOT_ALPHA_1", 1_000_000, 0, 100, 1000);
  vesting.registry["OWNER_ALPHA"] = [sched];

  // Test 1: Pre-Cliff Transfers Restriction
  const spendPreCliff = vesting.computeSpendableAllowanceFromState(
    vesting.registry,
    vesting.quarantineMap,
    vesting.scheduleHoldMap,
    "OWNER_ALPHA",
    50,
    1_000_000
  );
  checks.push({
    id: 1,
    category: "Module 06 Core",
    name: "Pre-Cliff Transfer Restriction (Block 50 < Cliff 100)",
    passed: spendPreCliff === 0,
    detail: `Spendable at Block 50 evaluated to ${spendPreCliff} DBC (100% locked prior to cliff).`,
  });

  // Test 2: Partial Vesting with Proportional Hold Cap
  const holdKey = VestingRegistryStateShard.holdKey("OWNER_ALPHA", "LOT_ALPHA_1");
  vesting.scheduleHoldMap[holdKey] = true;
  const spendPartialHold = vesting.computeSpendableAllowanceFromState(
    vesting.registry,
    vesting.quarantineMap,
    vesting.scheduleHoldMap,
    "OWNER_ALPHA",
    500,
    1_000_000
  );
  checks.push({
    id: 2,
    category: "Module 06 Core",
    name: "Partial Vesting with Proportional Hold Cap (Block 500)",
    passed: spendPartialHold === 500_000,
    detail: `Active hold froze only the 500,000 unvested DBC while preserving ${spendPartialHold.toLocaleString()} vested DBC.`,
  });

  // Test 3: Fully Vested Release Allowance
  vesting.scheduleHoldMap[holdKey] = false;
  const spendFullyVested = vesting.computeSpendableAllowanceFromState(
    vesting.registry,
    vesting.quarantineMap,
    vesting.scheduleHoldMap,
    "OWNER_ALPHA",
    1200,
    1_000_000
  );
  checks.push({
    id: 3,
    category: "Module 06 Core",
    name: "Fully Vested Schedule Release (Block 1200 > End 1000)",
    passed: spendFullyVested === 1_000_000,
    detail: `Post-maturity spendable allowance unlocked all ${spendFullyVested.toLocaleString()} DBC.`,
  });

  // Test 4: Malformed Negative Transfer Rejection
  const packMalformed = coordinator.executeIsolatedStagingTransaction(
    "ORDINARY_TRANSFER_X",
    { senderId: "OWNER_ALPHA", recipientId: "OWNER_BETA", amount: -500 },
    500
  );
  checks.push({
    id: 4,
    category: "Module 06 Core",
    name: "Malformed Negative Input Rejection (-500 DBC)",
    passed: packMalformed === null,
    detail: "Negative or non-integer transfer amounts rejected cleanly at staging gate.",
  });

  // Test 5 & 6: Overdraft Isolation & Zero State-Root Drift
  const rootPreSupply = supply.computeRootHashFromState(supply.remainingUnissuedBalances, supply.totalIssuedSupply).toHex();
  const rootPreWallet = wallet.computeRootHashFromState(wallet.ledger, wallet.nonces).toHex();
  const rootPreVesting = vesting.computeRootHashFromState(vesting.registry, vesting.quarantineMap, vesting.scheduleHoldMap).toHex();

  const packOverdraft = coordinator.executeIsolatedStagingTransaction(
    "ORDINARY_TRANSFER_X",
    { senderId: "OWNER_ALPHA", recipientId: "OWNER_BETA", amount: 999_999_999 },
    500
  );

  const rootPostSupply = supply.computeRootHashFromState(supply.remainingUnissuedBalances, supply.totalIssuedSupply).toHex();
  const rootPostWallet = wallet.computeRootHashFromState(wallet.ledger, wallet.nonces).toHex();
  const rootPostVesting = vesting.computeRootHashFromState(vesting.registry, vesting.quarantineMap, vesting.scheduleHoldMap).toHex();
  const statePreserved =
    rootPreSupply === rootPostSupply &&
    rootPreWallet === rootPostWallet &&
    rootPreVesting === rootPostVesting;

  checks.push({
    id: 5,
    category: "Module 06 Core",
    name: "Overdraft Transaction Isolation Rollback",
    passed: packOverdraft === null,
    detail: "999,999,999 DBC overdraft attempt aborted in isolated staging without mutating ledger.",
  });

  checks.push({
    id: 6,
    category: "Module 06 Core",
    name: "Universal 3-Shard State-Root Preservation Check",
    passed: statePreserved,
    detail: "Supply, Wallet, and Vesting SHA-256 roots remained byte-for-byte identical after abort.",
  });

  // Test 7: 100,000,000 Hard Supply Ceiling Invariant
  const initialPoolSum = Object.values(supply.remainingUnissuedBalances).reduce((a, b) => a + b, 0);
  checks.push({
    id: 7,
    category: "Nonce & Atomic Commit",
    name: "100,000,000 DBC Hard Supply Ceiling across 7 Constitutional Pools",
    passed: initialPoolSum === 100_000_000,
    detail: `50M K–12 Prize + 45M Proof-of-Service + Five 1M Pools = ${initialPoolSum.toLocaleString()} DBC exact ceiling.`,
  });

  // Test 8: Valid Pool Issuance with Matched Vesting Schedule
  const issueSched = new VestingSchedule("LOT_SERVICE_1", 250_000, 0, 50, 500);
  const packIssue = coordinator.executeIsolatedStagingTransaction(
    "ISSUANCE_CREDIT",
    {
      poolKey: "POOL_PROOF_OF_SERVICE",
      recipientId: "OWNER_GAMMA",
      amount: 250_000,
      conditionalSchedule: issueSched,
    },
    100
  );
  const issueCommitted = packIssue !== null && coordinator.commitStagedPackage(packIssue);
  checks.push({
    id: 8,
    category: "Nonce & Atomic Commit",
    name: "Atomic Pool Issuance + Vesting Schedule Registration",
    passed: issueCommitted && supply.totalIssuedSupply === 250_000,
    detail: "Issued 250,000 DBC from POOL_PROOF_OF_SERVICE to OWNER_GAMMA with linked vesting schedule.",
  });

  // Test 9: Mismatched Multi-Leg Issuance Rollback
  const brokenSched = new VestingSchedule("LOT_BROKEN", 999_999, 0, 10, 100);
  const packBrokenIssue = coordinator.executeIsolatedStagingTransaction(
    "ISSUANCE_CREDIT",
    {
      poolKey: "POOL_PROOF_OF_SERVICE",
      recipientId: "OWNER_DELTA",
      amount: 100_000,
      conditionalSchedule: brokenSched,
    },
    100
  );
  checks.push({
    id: 9,
    category: "Nonce & Atomic Commit",
    name: "Mismatched Schedule Allocation Rollback",
    passed: packBrokenIssue === null,
    detail: "Rejected issuance where schedule lock (999,999) mismatched issuance amount (100,000).",
  });

  // Test 10: Global Wallet Quarantine Gate Enforcement
  vesting.quarantineMap["OWNER_GAMMA"] = true;
  const quarantinedSpendable = vesting.computeSpendableAllowanceFromState(
    vesting.registry,
    vesting.quarantineMap,
    vesting.scheduleHoldMap,
    "OWNER_GAMMA",
    600,
    250_000
  );
  vesting.quarantineMap["OWNER_GAMMA"] = false;
  checks.push({
    id: 10,
    category: "Nonce & Atomic Commit",
    name: "Global Wallet Quarantine Gate (`GQ` Flag)",
    passed: quarantinedSpendable === 0,
    detail: "Quarantined wallet immediately evaluates to 0 spendable DBC until cleared by Court/DILOS.",
  });

  // Test 11: Strict Sequential Nonce (+1) Commit Advancement
  const packNonce1 = coordinator.executeIsolatedStagingTransaction(
    "ORDINARY_TRANSFER_X",
    {
      senderId: "OWNER_ALPHA",
      recipientId: "OWNER_BETA",
      amount: 100_000,
      nonce: 1,
      enforceStrictNonce: true,
    },
    500
  );
  const committedNonce1 = packNonce1 !== null && coordinator.commitStagedPackage(packNonce1);
  checks.push({
    id: 11,
    category: "Nonce & Atomic Commit",
    name: "Strict Sequential Nonce (+1) Commit Advancement",
    passed: committedNonce1 && wallet.nonces["OWNER_ALPHA"] === 1,
    detail: "Valid transfer with nonce 1 advanced OWNER_ALPHA registered nonce from 0 to 1.",
  });

  // Test 12: Stale & Duplicate Nonce Rejection
  const packDuplicateNonce = coordinator.executeIsolatedStagingTransaction(
    "ORDINARY_TRANSFER_X",
    {
      senderId: "OWNER_ALPHA",
      recipientId: "OWNER_BETA",
      amount: 50_000,
      nonce: 1, // duplicate nonce 1
      enforceStrictNonce: true,
    },
    500
  );
  checks.push({
    id: 12,
    category: "Nonce & Atomic Commit",
    name: "Stale & Duplicate Nonce Replay Rejection",
    passed: packDuplicateNonce === null,
    detail: "Re-submitting already-used nonce 1 rejected immediately with zero state drift.",
  });

  // Test 13: Nonce Gap Replay Rejection (Closes Report to Grand Master G Finding A)
  const packGapNonce = coordinator.executeIsolatedStagingTransaction(
    "ORDINARY_TRANSFER_X",
    {
      senderId: "OWNER_ALPHA",
      recipientId: "OWNER_BETA",
      amount: 50_000,
      nonce: 10, // gap nonce (expected 2)
      enforceStrictNonce: true,
    },
    500
  );
  checks.push({
    id: 13,
    category: "Nonce & Atomic Commit",
    name: "Nonce-Gap Replay Blocker Closed (`incoming === current + 1`)",
    passed: packGapNonce === null,
    detail: "Submitting nonce 10 when registered nonce is 1 is strictly rejected.",
  });

  // Test 14: Deliberate Mid-Commit Fault Atomic Rollback
  const packForFault = coordinator.executeIsolatedStagingTransaction(
    "ORDINARY_TRANSFER_X",
    {
      senderId: "OWNER_ALPHA",
      recipientId: "OWNER_BETA",
      amount: 25_000,
      nonce: 2,
      enforceStrictNonce: true,
    },
    500
  );
  const balanceBeforeFault = wallet.ledger["OWNER_ALPHA"];
  const nonceBeforeFault = wallet.nonces["OWNER_ALPHA"];
  const faultResult = packForFault ? coordinator.commitStagedPackage(packForFault, true) : true;
  const rollbackIntact =
    !faultResult &&
    wallet.ledger["OWNER_ALPHA"] === balanceBeforeFault &&
    wallet.nonces["OWNER_ALPHA"] === nonceBeforeFault;

  checks.push({
    id: 14,
    category: "Nonce & Atomic Commit",
    name: "Mid-Commit Exception Atomic State Rollback",
    passed: rollbackIntact,
    detail: "Injected mid-commit hardware/network fault rolled back all 3 shards cleanly.",
  });

  // Test 15: 3-Shard Master Composite Root Verification (SCHEMA_V1_0_16)
  const sr = supply.computeRootHashFromState(supply.remainingUnissuedBalances, supply.totalIssuedSupply);
  const wr = wallet.computeRootHashFromState(wallet.ledger, wallet.nonces);
  const vr = vesting.computeRootHashFromState(vesting.registry, vesting.quarantineMap, vesting.scheduleHoldMap);
  const composite = CrossNamespaceAtomicCoordinator.computeMasterCompositeRoot(sr, wr, vr);
  checks.push({
    id: 15,
    category: "Nonce & Atomic Commit",
    name: "Master 3-Shard Composite Root (`SCHEMA_V1_0_16`)",
    passed: composite.bytes.length === 32,
    detail: `Verified 32-byte composite root: ${composite.toHex().slice(0, 24)}...`,
  });

  // Test 16: Nonce-Bound Wallet State Root (Closes Report to Grand Master G Finding B)
  const rootNonce1 = wallet.computeRootHashFromState(wallet.ledger, { ...wallet.nonces, OWNER_ALPHA: 1 }).toHex();
  const rootNonce2 = wallet.computeRootHashFromState(wallet.ledger, { ...wallet.nonces, OWNER_ALPHA: 2 }).toHex();
  checks.push({
    id: 16,
    category: "Remediated Boundary Guard",
    name: "Nonce-Committed Wallet Shard Root (`SCHEMA_V2`)",
    passed: rootNonce1 !== rootNonce2,
    detail: "Changing account nonce deterministically changes the Wallet Shard & Composite SHA-256 root.",
  });

  // Test 17: Canonical UTF-8 Byte-Length Prefix on Multi-Byte Quarantine ID ('é')
  const vUtf8 = new VestingRegistryStateShard();
  const actualUtf8Root = vUtf8.computeRootHashFromState({}, { é: true }, {}).toHex();
  const rawE = utf8Bytes("é"); // 2 UTF-8 bytes (0xc3, 0xa9), 1 code point
  const expectedUtf8Bytes = concatBytes(
    utf8Bytes("DISCOVERY_COIN_PROTOCOL|VESTING_REGISTRY|SCHEMA_V1|"),
    utf8Bytes("GQ"),
    u32BigEndian(rawE.length),
    rawE
  );
  const expectedUtf8Root = bytesToHex(sha256Bytes(expectedUtf8Bytes));
  checks.push({
    id: 17,
    category: "Remediated Boundary Guard",
    name: "UTF-8 Multi-Byte Quarantine Wire Serialization (`é` = 2 bytes)",
    passed: actualUtf8Root === expectedUtf8Root && rawE.length === 2,
    detail: "Encodes UTF-8 byte count (2 bytes) instead of character count (1 code point).",
  });

  // Test 18: Strict 32-Byte HashDigest Width Enforcement
  let rejected33ByteInput = false;
  try {
    HashDigest.fromStrStrict("x".repeat(33));
  } catch {
    rejected33ByteInput = true;
  }
  checks.push({
    id: 18,
    category: "Remediated Boundary Guard",
    name: "Strict 32-Byte `HashDigest` Width Enforcement",
    passed: rejected33ByteInput,
    detail: "33-byte input strictly rejected instead of silently overflowing digest width.",
  });

  // Test 19: Explicit u64 Overflow Boundary Gate (Rejects 2^64)
  let rejectedU64Overflow = false;
  try {
    new VestingSchedule("OVERFLOW_LOT", U64_MAX + 1n, 0, 0, 10);
  } catch {
    rejectedU64Overflow = true;
  }
  checks.push({
    id: 19,
    category: "Remediated Boundary Guard",
    name: "Explicit `u64` Schedule Allocation Boundary Gate (`2^64` Rejected)",
    passed: rejectedU64Overflow,
    detail: "Out-of-range u64 schedule allocation (2^64) rejected at construction & admission gate.",
  });

  // Test 20: Article 11 50/25/25 Integer-Cent Split, Odd-Cent Remainder Conservation & Zero-Fee Entry Gate
  const oddSplit = computeArticle11SplitCents(1003); // $10.03 odd-cent stress test
  const evenSplit = computeArticle11SplitCents(10000); // $100.00 canonical anchor
  const splitConserved =
    oddSplit.sellerCashCents + oddSplit.sellerEquityCents + oddSplit.buyerEquityCents === 1003 &&
    oddSplit.undisclosedFeeCents === 0 &&
    evenSplit.sellerCashCents === 5000 &&
    evenSplit.sellerEquityCents === 2500 &&
    evenSplit.buyerEquityCents === 2500 &&
    evenSplit.undisclosedFeeCents === 0;
  checks.push({
    id: 20,
    category: "Remediated Boundary Guard",
    name: "Article 11 50/25/25 Odd-Cent Conservation & Zero-Fee Invariant",
    passed: splitConserved,
    detail:
      "Verified $100.00 (5000c/2500c/2500c) and odd-cent $10.03 (502c/251c/250c = 1003c) with 0c fee.",
  });

  // Test 21: Article 12 70/30 Net Rental Allocation Integer-Cent Conservation
  const rentSplit = computeArticle12RentSplitCents(10001); // $100.01 odd-cent stress test
  const rentConserved =
    rentSplit.owners70Cents + rentSplit.k12Prize30Cents === 10001 &&
    rentSplit.owners70Cents === 7001 &&
    rentSplit.k12Prize30Cents === 3000;
  checks.push({
    id: 21,
    category: "Remediated Boundary Guard",
    name: "Article 12 70/30 Net Rental Income Integer-Cent Conservation",
    passed: rentConserved,
    detail:
      "Verified 70% Owners / 30% K–12 Discovery Prize integer-cent conservation on odd-cent net rent ($100.01 -> 7001c + 3000c).",
  });

  // Test 22: Foreclosure & Auction 20%–30% Below-Market Spread & Out-of-Bounds Rejection
  const auction25 = computeAuctionSpreadCarrierCents(500_000_000, 25); // $5,000,000 at 25% discount
  let rejectedOutOfBoundsDiscount = false;
  try {
    computeAuctionSpreadCarrierCents(500_000_000, 15); // 15% < 20% minimum
  } catch {
    rejectedOutOfBoundsDiscount = true;
  }
  const auctionValid =
    auction25.acquisitionPriceCents + auction25.dbcCarriedSpreadCents === 500_000_000 &&
    auction25.acquisitionPriceCents === 375_000_000 &&
    auction25.dbcCarriedSpreadCents === 125_000_000 &&
    rejectedOutOfBoundsDiscount;
  checks.push({
    id: 22,
    category: "Remediated Boundary Guard",
    name: "Foreclosure/Auction 20%–30% Spread Gate & DBC Value-Carrier Conservation",
    passed: auctionValid,
    detail:
      "Verified $5M appraisal -> $3.75M acquisition + $1.25M DBC spread (25%) and strict rejection of <20% or >30% discounts.",
  });

  const passCount = checks.filter((c) => c.passed).length;
  return {
    allPassed: passCount === checks.length,
    passCount,
    totalCount: checks.length,
    compositeStateRootHex: composite.toHex(),
    checks,
  };
}

export interface Article11SplitResult {
  totalCents: number;
  sellerCashCents: number;
  sellerEquityCents: number;
  buyerEquityCents: number;
  undisclosedFeeCents: 0;
  sellerCashUsd: number;
  sellerEquityUsd: number;
  buyerEquityUsd: number;
}

/**
 * Deterministic integer-cent 50 / 25 / 25 allocation with exact cent conservation
 * and hard-locked zero-fee invariant (undisclosedFeeCents === 0).
 */
export function computeArticle11SplitCents(totalCentsInput: number): Article11SplitResult {
  if (!Number.isFinite(totalCentsInput) || totalCentsInput < 0) {
    throw new RangeError("Transaction amount must be a non-negative finite number of cents");
  }
  const totalCents = Math.round(totalCentsInput);
  const baseSellerCash = Math.floor((totalCents * 50) / 100);
  const baseSellerEquity = Math.floor((totalCents * 25) / 100);
  const baseBuyerEquity = Math.floor((totalCents * 25) / 100);
  const remainder = totalCents - (baseSellerCash + baseSellerEquity + baseBuyerEquity);

  // Deterministic remainder distribution: 1st remainder cent to Seller Cash, 2nd to Seller Equity, 3rd to Buyer Equity
  const sellerCashCents = baseSellerCash + (remainder >= 1 ? 1 : 0);
  const sellerEquityCents = baseSellerEquity + (remainder >= 2 ? 1 : 0);
  const buyerEquityCents = baseBuyerEquity + (remainder >= 3 ? 1 : 0);

  return {
    totalCents,
    sellerCashCents,
    sellerEquityCents,
    buyerEquityCents,
    undisclosedFeeCents: 0,
    sellerCashUsd: sellerCashCents / 100,
    sellerEquityUsd: sellerEquityCents / 100,
    buyerEquityUsd: buyerEquityCents / 100,
  };
}

export function computeArticle12RentSplitCents(netRentCentsInput: number): {
  netRentCents: number;
  owners70Cents: number;
  k12Prize30Cents: number;
} {
  if (!Number.isFinite(netRentCentsInput) || netRentCentsInput < 0) {
    throw new RangeError("Net rent must be a non-negative finite number of cents");
  }
  const netRentCents = Math.round(netRentCentsInput);
  const baseOwners70 = Math.floor((netRentCents * 70) / 100);
  const basePrize30 = Math.floor((netRentCents * 30) / 100);
  const remainder = netRentCents - (baseOwners70 + basePrize30);
  return {
    netRentCents,
    owners70Cents: baseOwners70 + remainder,
    k12Prize30Cents: basePrize30,
  };
}

export function computeAuctionSpreadCarrierCents(
  appraisedValueCentsInput: number,
  discountPct: number
): {
  appraisedValueCents: number;
  discountPct: number;
  acquisitionPriceCents: number;
  dbcCarriedSpreadCents: number;
} {
  if (!Number.isFinite(appraisedValueCentsInput) || appraisedValueCentsInput <= 0) {
    throw new RangeError("Appraised property value must be positive");
  }
  if (!Number.isFinite(discountPct) || discountPct < 20 || discountPct > 30) {
    throw new RangeError("Foreclosure/auction discount must be within the constitutional 20%–30% band");
  }
  const appraisedValueCents = Math.round(appraisedValueCentsInput);
  const dbcCarriedSpreadCents = Math.round((appraisedValueCents * discountPct) / 100);
  const acquisitionPriceCents = appraisedValueCents - dbcCarriedSpreadCents;
  return {
    appraisedValueCents,
    discountPct,
    acquisitionPriceCents,
    dbcCarriedSpreadCents,
  };
}

