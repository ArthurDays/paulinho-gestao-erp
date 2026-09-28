import React, { useState, useEffect } from 'react';
import { syncQueueService } from '../../services/syncQueueService';
import { SyncEngineStats, SyncTask } from '../../types/sync';
import { Badge } from '../common/Badge';

export const SyncStatusIndicator: React.FC = () => {
  const [stats, setStats] = useState<SyncEngineStats>(syncQueueService.getStats());
  const [queue, setQueue] = useState<SyncTask[]>(syncQueueService.getQueue());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = syncQueueService.subscribe((newStats, newQueue) => {
      setStats(newStats);
      setQueue(newQueue);
    });
    return unsubscribe;
  }, []);

  const handleForceFlush = () => {
    syncQueueService.forceSyncNow();
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Nunca';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return 'Agora mesmo';
    if (seconds < 60) return `Há ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `Há ${minutes}m`;
  };

  return (
    <div className="relative">
      {/* Pill Badge clicável */}
      <button
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-xs font-mono select-none"
        title="Status do Motor de Sincronização Assíncrona (System-First)"
      >
        {stats.isSyncing ? (
          <>
            <svg className="w-3.5 h-3.5 animate-spin text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              Espelhando ({stats.pendingCount})...
            </span>
          </>
        ) : stats.pendingCount > 0 ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              {stats.pendingCount} na fila (System-First)
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Google Sheets: Espelhado
            </span>
          </>
        )}
      </button>

      {/* Popover de Detalhes da Fila de Sincronização */}
      {isPopoverOpen && (
        <>
          <div 
            onClick={() => setIsPopoverOpen(false)}
            className="fixed inset-0 z-40 bg-transparent" 
          />

          <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 text-xs space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Sync Engine "System-First"
                </span>
                <Badge variant="emerald" size="sm">0ms Latência</Badge>
              </div>
              <button 
                onClick={() => setIsPopoverOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Mutações no PDV e Pátio são persistidas imediatamente no ERP. A fila em segundo plano garante o espelhamento na planilha sem travar a interface.
            </p>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="text-slate-400 block">Último espelho:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatTimeAgo(stats.lastSyncedAt)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total sincronizado:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.syncedCount} registros
                </span>
              </div>
            </div>

            {/* Lista de Tarefas na Fila */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-500 font-mono">
                <span>Fila em Segundo Plano ({queue.length})</span>
                {queue.length > 0 && (
                  <button 
                    onClick={() => syncQueueService.clearCompleted()}
                    className="text-slate-400 hover:text-slate-600 text-[10px]"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {queue.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-[11px] font-mono bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                  ✓ Nenhuma mutação pendente na fila.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {queue.map(task => (
                    <div 
                      key={task.id}
                      className="p-2 rounded border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-[11px]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {task.type} • {task.entityId}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Latência ERP: {task.latencyMs || 0}ms
                        </div>
                      </div>

                      <Badge 
                        variant={task.status === 'SYNCING' ? 'blue' : task.status === 'FAILED' ? 'rose' : 'amber'} 
                        size="sm"
                      >
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <a
                href={stats.googleSheetsMirrorUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Abrir Planilha Mestra</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>

              <button
                onClick={handleForceFlush}
                disabled={stats.isSyncing || stats.pendingCount === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-[11px] transition-all shadow-xs"
              >
                Forçar Flush
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
