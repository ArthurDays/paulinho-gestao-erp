/**
 * Paulinho Gestão - Definições de Tipos do Motor de Sincronização (Sync Engine)
 * Arquitetura "System-First" (Zero-Latency Local Mutation + Background Mirror Queue)
 */

export type SyncMutationType =
  | 'INVENTORY_ADD'
  | 'INVENTORY_UPDATE'
  | 'INVENTORY_SALE'
  | 'BARCODE_SCAN'
  | 'VEHICLE_ADD'
  | 'VEHICLE_DECONTAMINATE'
  | 'BULK_IMPORT';

export type SyncTaskStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'RETRY';

export interface SyncTask<T = any> {
  id: string;
  type: SyncMutationType;
  entity: 'PECA' | 'VEICULO' | 'ROMANEIO' | 'LOTE';
  entityId: string;
  data: T;
  timestamp: number;
  status: SyncTaskStatus;
  retries: number;
  error?: string;
  latencyMs?: number;
}

export interface SyncEngineStats {
  isSyncing: boolean;
  pendingCount: number;
  syncedCount: number;
  failedCount: number;
  lastSyncedAt: Date | null;
  lastError: string | null;
  isOnline: boolean;
  googleSheetsMirrorUrl: string;
}

export interface BarcodeScanResult {
  code: string;
  timestamp: number;
  format: 'CODE128' | 'EAN13' | 'QR_CODE' | 'MANUAL';
  foundEntity?: any;
}
