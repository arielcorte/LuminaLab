# Eureka
A platform that facilitates patent creation, use and safekeeping in latin america.

## Despliegue de Contratos

Este proyecto incluye scripts para desplegar los contratos inteligentes usando Python.

### Requisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Instalación

1. Instala las dependencias:
```bash
pip install -r requirements.txt
```

2. Crea un archivo `.env` en la raíz del proyecto:
```env
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=tu_clave_privada_sin_0x
```

### Despliegue

#### Opción 1: Red Local

1. Inicia una red local (Ganache, Hardhat node, o cualquier nodo local):
```bash
# Ejemplo con Ganache CLI
ganache-cli

# O con Hardhat
npx hardhat node
```

2. En otro terminal, ejecuta el script de despliegue:
```bash
python deploy.py
```

#### Opción 2: Sepolia Testnet

1. Configura tu `.env` con:
```env
RPC_URL=https://sepolia.infura.io/v3/TU_PROJECT_ID
PRIVATE_KEY=tu_clave_privada
```

2. Asegúrate de tener ETH de prueba en Sepolia en tu cuenta.

3. Ejecuta:
```bash
python deploy.py
```

#### Opción 3: Mainnet

⚠️ **ADVERTENCIA**: Solo despliega en mainnet si estás completamente seguro.

1. Configura tu `.env` con la RPC de mainnet
2. Verifica que tienes suficiente ETH para el gas
3. Ejecuta:
```bash
python deploy.py
```

### Estructura de Contratos

- **PatentFactory**: Contrato factory que crea instancias de Patent
- **Patent**: Contrato individual que representa una patente con:
  - Propietario
  - Link al PDF de la patente
  - Hash SHA256 del PDF
  - Funciones de depósito y retiro de fondos

### Información de Despliegue

Después de cada despliegue, la información se guarda en `deployments/[red].json` con:
- Dirección del contrato desplegado
- Hash de la transacción
- Red y Chain ID
- Cuenta que desplegó

### Notas de Seguridad

- ⚠️ **NUNCA** compartas tu archivo `.env` o tu clave privada
- Usa cuentas de prueba para desarrollo
- Verifica siempre las direcciones de los contratos antes de interactuar con ellos
