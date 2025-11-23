# Despliegue de PatentFactory en Sepolia

Este instructivo explica cómo desplegar el contrato `PatentFactory` en la red Sepolia usando el script `deploy.py` y Python + Web3.

## Requisitos
- Python 3.10+
- Node.js (para compilar Solidity si usas solcx)
- Paquetes: `web3`, `python-dotenv`, `py-solc-x`
- Archivo `.env` con tus claves y configuración
- Clave privada con fondos en Sepolia

## Pasos

### 1. Instalar dependencias
```sh
pip install web3 python-dotenv py-solc-x
```

### 2. Configurar el archivo `.env`
Agrega las siguientes variables:
```
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=tu_clave_privada_sin_0x
```

### 3. Compilar los contratos
El script `deploy.py` compila automáticamente los contratos usando solcx. Asegúrate de que los archivos `contracts/Patent.sol` y `contracts/Factory.sol` estén actualizados.

### 4. Ejecutar el despliegue
```sh
source luminalab_env/bin/activate  # Si usas un entorno virtual
python deploy.py
```

### 5. Parámetros para crear una patente
Cuando uses la función `createPatent` desde el Factory, debes pasar:
- `patentLink` (string)
- `patentHash` (bytes32)
- `royaltiesSessionLink` (string)
- `royaltiesSessionHash` (string)

Ejemplo en Python:
```python
factory.functions.createPatent(
    patentLink,
    patentHash,
    royaltiesSessionLink,
    royaltiesSessionHash
).transact({'from': deployer_address})
```

### 6. Verificar el despliegue
El script mostrará la dirección del contrato desplegado y el hash de la transacción. Puedes verificar en [Sepolia Etherscan](https://sepolia.etherscan.io/).

## Notas
- Si cambias la estructura del contrato, recompila antes de desplegar.
- Usa el ABI actualizado en el frontend para interactuar con el contrato.
- Si tienes errores, revisa los argumentos del constructor y la función `createPatent`.

---

¿Dudas? Consulta el script `deploy.py` o pide ayuda a tu equipo técnico.
