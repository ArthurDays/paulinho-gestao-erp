import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { barcodeScannerService } from '../../services/barcodeScannerService';
import { BarcodeScanResult } from '../../types/sync';
import { useToast } from './Toast';

interface BarcodeContextType {
  lastScan: BarcodeScanResult | null;
  scanHistory: BarcodeScanResult[];
  isScannerActive: boolean;
  simulateScan: (code: string) => void;
  registerScanHandler: (handler: (scan: BarcodeScanResult) => boolean | void) => () => void;
}

const BarcodeContext = createContext<BarcodeContextType | undefined>(undefined);

export const useBarcodeScanner = () => {
  const context = useContext(BarcodeContext);
  if (!context) {
    throw new Error('useBarcodeScanner must be used within a BarcodeListenerProvider');
  }
  return context;
};

export const BarcodeListenerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [lastScan, setLastScan] = useState<BarcodeScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<BarcodeScanResult[]>([]);
  const [handlers, setHandlers] = useState<Array<(scan: BarcodeScanResult) => boolean | void>>([]);

  const registerScanHandler = useCallback((handler: (scan: BarcodeScanResult) => boolean | void) => {
    setHandlers(prev => [handler, ...prev]);
    return () => {
      setHandlers(prev => prev.filter(h => h !== handler));
    };
  }, []);

  const simulateScan = useCallback((code: string) => {
    barcodeScannerService.simulateScan(code, 'MANUAL');
  }, []);

  useEffect(() => {
    const unsubscribe = barcodeScannerService.onScan((result) => {
      setLastScan(result);
      setScanHistory(prev => [result, ...prev].slice(0, 30));

      // Dispara handlers prioritários registrados (ex: se o PDV ou Desmanche capturou, interrompe)
      let handled = false;
      for (const handler of handlers) {
        const res = handler(result);
        if (res === true) {
          handled = true;
          break;
        }
      }

      if (!handled) {
        addToast({
          title: 'Código de Barras Capturado (0ms)',
          message: `Código [${result.code}] reconhecido pelo Barcode Engine.`,
          type: 'info'
        });
      }
    });

    return unsubscribe;
  }, [handlers, addToast]);

  return (
    <BarcodeContext.Provider value={{
      lastScan,
      scanHistory,
      isScannerActive: true,
      simulateScan,
      registerScanHandler
    }}>
      {children}
    </BarcodeContext.Provider>
  );
};

export const BarcodeListener: React.FC = () => {
  // Componente semântico que pode renderizar status flutuante se necessário
  return null;
};
