import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { syncQueueService } from '../../services/syncQueueService';
import { SyncEngineStats, SyncTask, SyncMutationType } from '../../types/sync';

interface SyncEngineContextType {
  stats: SyncEngineStats;
  queue: SyncTask[];
  enqueueMutation: <T>(mutation: {
    mutateLocal: () => T;
    task: {
      type: SyncMutationType;
      entity: 'PECA' | 'VEICULO' | 'ROMANEIO' | 'LOTE';
      entityId: string;
      data: any;
    };
  }) => T;
  forceSync: () => Promise<void>;
  clearCompleted: () => void;
}

const SyncEngineContext = createContext<SyncEngineContextType | undefined>(undefined);

export const useSyncEngine = () => {
  const context = useContext(SyncEngineContext);
  if (!context) {
    throw new Error('useSyncEngine must be used within a SyncEngineProvider');
  }
  return context;
};

export const SyncEngineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<SyncEngineStats>(syncQueueService.getStats());
  const [queue, setQueue] = useState<SyncTask[]>(syncQueueService.getQueue());

  useEffect(() => {
    const unsubscribe = syncQueueService.subscribe((newStats, newQueue) => {
      setStats(newStats);
      setQueue(newQueue);
    });
    return unsubscribe;
  }, []);

  return (
    <SyncEngineContext.Provider value={{
      stats,
      queue,
      enqueueMutation: (opts) => syncQueueService.executeSystemFirst(opts),
      forceSync: () => syncQueueService.forceSyncNow(),
      clearCompleted: () => syncQueueService.clearCompleted()
    }}>
      {children}
    </SyncEngineContext.Provider>
  );
};

export const SyncEngine: React.FC = () => {
  return null;
};
