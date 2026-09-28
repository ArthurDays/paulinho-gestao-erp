/**
 * Paulinho Gestão - BarcodeScannerService (Zero-Latency Barcode / QR Code Listener)
 * 
 * Suporta:
 * 1. Leitores de Código de Barras USB / Bluetooth (Keyboard Wedge) com detecção de cadência ultrarrápida (< 45ms)
 * 2. Emissão de feedback sonoro de alta frequência (Web Audio API Chime)
 * 3. Disparo imediato para processamento no PDV e Pátio com "System-First"
 */

import { BarcodeScanResult } from '../types/sync';

type BarcodeScanCallback = (result: BarcodeScanResult) => void;

class BarcodeScannerService {
  private buffer = '';
  private lastKeyTimestamp = 0;
  private readonly maxIntervalMs = 45; // Intervalo típico de leitores laser/CCD
  private readonly minBarcodeLength = 3;
  private callbacks: Set<BarcodeScanCallback> = new Set();
  private isListening = false;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initKeyboardListener();
    }
  }

  /**
   * Registra callback para leitura de código de barras
   */
  public onScan(callback: BarcodeScanCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Simula leitura manual de código de barras (via input ou botão de teste)
   */
  public simulateScan(code: string, format: BarcodeScanResult['format'] = 'MANUAL'): void {
    this.playSuccessBeep();
    const result: BarcodeScanResult = {
      code: code.trim(),
      timestamp: Date.now(),
      format
    };
    this.dispatch(result);
  }

  /**
   * Toca o beep sonoro de confirmação instantânea
   */
  public playSuccessBeep(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1900, this.audioCtx.currentTime); // 1.9 kHz (beep industrial limpo)
      osc.frequency.exponentialRampToValueAtTime(2400, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch {
      // Ignora silenciosamente se o navegador bloquear autoplay de áudio
    }
  }

  private initKeyboardListener(): void {
    if (this.isListening) return;
    this.isListening = true;

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ignora teclas de controle puro
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
        return;
      }

      const now = performance.now();
      const interval = now - this.lastKeyTimestamp;
      this.lastKeyTimestamp = now;

      // Se a tecla for Enter, verifica se o buffer foi digitado com cadência de leitor
      if (e.key === 'Enter') {
        if (this.buffer.length >= this.minBarcodeLength) {
          // Previne submissão acidental de formulários pelo leitor
          const activeEl = document.activeElement;
          const isNormalTextarea = activeEl && activeEl.tagName === 'TEXTAREA';

          if (!isNormalTextarea) {
            const rawCode = this.buffer.trim();
            this.playSuccessBeep();
            
            let format: BarcodeScanResult['format'] = 'CODE128';
            if (rawCode.startsWith('QR-') || rawCode.length > 20) format = 'QR_CODE';
            else if (rawCode.length === 13 && /^\d+$/.test(rawCode)) format = 'EAN13';

            this.dispatch({
              code: rawCode,
              timestamp: Date.now(),
              format
            });
            this.buffer = '';
            return;
          }
        }
        this.buffer = '';
        return;
      }

      // Se o intervalo entre teclas for maior que o tempo limite, reseta o buffer
      if (interval > this.maxIntervalMs && this.buffer.length > 0) {
        this.buffer = '';
      }

      if (e.key.length === 1) {
        this.buffer += e.key;
      }
    }, true);
  }

  private dispatch(result: BarcodeScanResult): void {
    this.callbacks.forEach(cb => {
      try {
        cb(result);
      } catch (err) {
        console.error('Erro no callback do leitor de código de barras:', err);
      }
    });
  }
}

export const barcodeScannerService = new BarcodeScannerService();
