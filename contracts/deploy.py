#!/usr/bin/env python3
"""
Script para desplegar los contratos Factory y Patent
Guarda las direcciones en un archivo txt
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from web3 import Web3
from solcx import compile_standard, install_solc, set_solc_version
from eth_account import Account

# Cargar variables de entorno
load_dotenv()

RPC_URL = os.getenv("RPC_URL", "http://127.0.0.1:8545")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
SOLIDITY_VERSION = "0.8.20"

def compile_contracts():
    """Compila los contratos Solidity"""
    print("📦 Compilando contratos...")
    
    install_solc(SOLIDITY_VERSION)
    set_solc_version(SOLIDITY_VERSION)
    
    # Leer todos los archivos .sol
    contracts_dir = Path(__file__).parent
    sources = {}
    for sol_file in contracts_dir.glob("*.sol"):
        sources[f"contracts/{sol_file.name}"] = {"content": sol_file.read_text()}
    
    # Compilar
    compiled = compile_standard({
        "language": "Solidity",
        "sources": sources,
        "settings": {
            "outputSelection": {"*": {"*": ["abi", "evm.bytecode"]}}
        }
    })
    
    # Verificar errores
    if "errors" in compiled:
        errors = [e for e in compiled["errors"] if e["severity"] == "error"]
        if errors:
            for error in errors:
                print(f"❌ {error.get('formattedMessage', error.get('message'))}")
            raise Exception("Error en la compilación")
    
    # Extraer Factory y Patent
    factory_data = None
    patent_data = None
    
    for file_path, file_contracts in compiled["contracts"].items():
        if "Factory.sol" in file_path and "PatentFactory" in file_contracts:
            factory_data = file_contracts["PatentFactory"]
        if "Patent.sol" in file_path and "Patent" in file_contracts:
            patent_data = file_contracts["Patent"]
    
    if not factory_data:
        raise Exception("PatentFactory no encontrado")
    if not patent_data:
        raise Exception("Patent no encontrado")
    
    print("✅ Compilación exitosa\n")
    
    return {
        "factory": {
            "abi": factory_data["abi"],
            "bin": factory_data["evm"]["bytecode"]["object"]
        },
        "patent": {
            "abi": patent_data["abi"],
            "bin": patent_data["evm"]["bytecode"]["object"]
        }
    }

def deploy_contract(w3, account, contract_interface, constructor_args=None):
    """Despliega un contrato"""
    contract = w3.eth.contract(abi=contract_interface["abi"], bytecode=contract_interface["bin"])
    
    if constructor_args:
        constructor = contract.constructor(*constructor_args)
    else:
        constructor = contract.constructor()
    
    tx = constructor.build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "gas": 3000000,
        "gasPrice": w3.eth.gas_price,
    })
    
    signed = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    print(f"  ⏳ Transacción: {tx_hash.hex()}")
    
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"  ✅ Desplegado en: {receipt.contractAddress}")
    
    return receipt.contractAddress, receipt

def main():
    print("🚀 Despliegue de Contratos Eureka\n")
    
    # Conectar a la red
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        print(f"❌ Error: No se pudo conectar a {RPC_URL}")
        return
    
    # Detectar red
    network = "localhost"
    if "sepolia" in RPC_URL.lower():
        network = "sepolia"
    elif "mainnet" in RPC_URL.lower():
        network = "mainnet"
    
    print(f"🌐 Red: {network}\n")
    
    # Verificar cuenta
    if not PRIVATE_KEY:
        print("❌ Error: PRIVATE_KEY no encontrada en .env")
        return
    
    private_key = PRIVATE_KEY.strip().lstrip("0x")
    account = Account.from_key(private_key)
    balance = Web3.from_wei(w3.eth.get_balance(account.address), "ether")
    
    print(f"👤 Dirección: {account.address}")
    print(f"💰 Balance: {balance} ETH\n")
    
    if balance == 0:
        print("⚠️  Sin fondos en la cuenta")
        return
    
    # Compilar contratos
    contracts = compile_contracts()
    
    # Desplegar Factory
    print("📤 Desplegando PatentFactory...")
    factory_address, factory_receipt = deploy_contract(w3, account, contracts["factory"])
    print()
    
    # Desplegar Patent (con parámetros por defecto para el constructor)
    print("📤 Desplegando Patent...")
    # Parámetros del constructor: owner, patentLink, patentHash, royaltiesSessionLink
    patent_args = (
        account.address,  # owner
        "",  # patentLink (vacío por defecto)
        b'\x00' * 32,  # patentHash (bytes32 vacío)
        ""  # royaltiesSessionLink (vacío por defecto)
    )
    patent_address, patent_receipt = deploy_contract(w3, account, contracts["patent"], patent_args)
    print()
    
    # Guardar direcciones en archivo txt
    output_file = Path(__file__).parent / "deployments.txt"
    with open(output_file, "w") as f:
        f.write("=== Direcciones de Contratos Desplegados ===\n\n")
        f.write(f"Red: {network}\n")
        f.write(f"Chain ID: {w3.eth.chain_id}\n")
        f.write(f"Desplegado por: {account.address}\n\n")
        f.write(f"Factory Address: {factory_address}\n")
        f.write(f"Factory Tx Hash: {factory_receipt.transactionHash.hex()}\n\n")
        f.write(f"Patent Address: {patent_address}\n")
        f.write(f"Patent Tx Hash: {patent_receipt.transactionHash.hex()}\n")
    
    print("✨ Despliegue completado!")
    print(f"📝 Direcciones guardadas en: {output_file}")
    print(f"\n📋 Resumen:")
    print(f"   Factory: {factory_address}")
    print(f"   Patent:  {patent_address}")

if __name__ == "__main__":
    main()


