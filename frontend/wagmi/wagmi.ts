import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

// 1. Define las cadenas de Ethereum que usarás (solo Sepolia en este caso)
const chains = [sepolia] as const;

// 2. Crea la configuración de Wagmi
export const config = createConfig({
  chains,
  connectors: [
    metaMask(), // Conector para Metamask
    injected(), // Conector para cualquier billetera inyectada (ej: Brave, Coinbase)
  ],
  transports: {
    // 3. Define cómo se conecta cada cadena (puedes usar un RPC público o tu propio nodo)
    [sepolia.id]: http(),
  },
});