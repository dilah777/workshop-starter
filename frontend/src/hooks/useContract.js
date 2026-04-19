import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Networks,
  BASE_FEE,
  TransactionBuilder,
  Contract,
  scValToNative,
  Keypair,
  Account,
  rpc,
} from "@stellar/stellar-sdk";
import {
  getAddress,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

// Koneksi ke Soroban Testnet
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK = Networks.TESTNET;
const server = new rpc.Server(RPC_URL);

const getFreighter = () => {
  if (typeof window === "undefined") return null;

  // Check multiple possible global objects that Freighter might use
  return window.freighter ||
         window.freighterApi ||
         window.stellar ||
         (window.stellar && window.stellar.freighter) ||
         null;
};

const normalizeAddress = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.address || value.publicKey || "";
};

export function useContract() {
  // Mencegah error jika ID kontrak belum ada di .env
  const contractId = import.meta.env.VITE_CONTRACT_ID || "CAC...DUMMY";
  const contract = useMemo(() => new Contract(contractId), [contractId]);

  const getWalletAddress = useCallback(async (forceRequest = false) => {
    const freighter = getFreighter();

    if (freighter) {
      try {
        const direct =
          typeof freighter.getAddress === "function"
            ? await freighter.getAddress()
            : typeof freighter.requestPublicKey === "function"
            ? await freighter.requestPublicKey()
            : typeof freighter.getPublicKey === "function"
            ? await freighter.getPublicKey()
            : null;

        const address = normalizeAddress(direct);
        if (address) {
          return address;
        }
      } catch (err) {
        console.warn("Freighter direct address fallback failed:", err);
      }
    }

    if (forceRequest) {
      const response = await requestAccess();
      const address = normalizeAddress(response);
      if (address) return address;
      throw new Error(response?.error?.message || "Gagal mengambil Public Key.");
    }

    const response = await getAddress();
    const address = normalizeAddress(response);
    if (address) return address;
    if (response?.error) throw new Error(response.error.message || "Gagal mengambil Public Key.");
    return "";
  }, []);

  const [publicKey, setPublicKey] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [freighterInstalled, setFreighterInstalled] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState(null);
  const [txSuccess, setTxSuccess] = useState(null);
  const [manuallyDisconnected, setManuallyDisconnected] = useState(
    () => localStorage.getItem("wallet_disconnected") === "true"
  );
  const [xlmBalance, setXlmBalance] = useState(null);

  const isWalletConnected = !!publicKey;

  // -- DETEKSI DOMPET FREIGHTER (Diperbarui untuk API Terbaru) --
  useEffect(() => {
    async function check() {
      try {
        const freighter = getFreighter();
        console.log("Freighter detection:", freighter ? "Found" : "Not found");

        const connection = await isConnected();
        const installed = !!(connection?.isConnected || freighter);
        console.log("Freighter installed:", installed);

        setFreighterInstalled(installed);

        // Cek koneksi tanpa pop-up agresif
        if (installed && !manuallyDisconnected) {
          const address = await getWalletAddress(false);
          if (address) setPublicKey(address);
        }
      } catch (error) {
        console.error("Freighter check error:", error);
        setFreighterInstalled(false);
      }
    }

    // Check immediately
    check();

    // Polling setiap 2 detik supaya tidak terlalu membebani browser
    const interval = setInterval(async () => {
      try {
        const freighter = getFreighter();
        const connection = await isConnected();
        const installed = !!(connection?.isConnected || freighter);
        setFreighterInstalled(installed);

        if (installed && !manuallyDisconnected) {
          const address = await getWalletAddress(false);
          if (address) {
            setPublicKey((prev) => {
              if (prev !== address) return address;
              return prev;
            });
          }
        } else if (!installed) {
          setPublicKey(null);
        }
      } catch {
        // Abaikan error polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [manuallyDisconnected, getWalletAddress]);

  // -- FUNGSI CONNECT WALLET --
  const connectWallet = useCallback(async () => {
    setWalletLoading(true);
    setWalletError(null);
    localStorage.removeItem("wallet_disconnected");
    setManuallyDisconnected(false);

    try {
      // First check if Freighter is available
      const freighter = getFreighter();
      if (!freighter) {
        // Try to check connection status first
        const connection = await isConnected();
        if (!connection?.isConnected) {
          throw new Error("Freighter tidak terdeteksi. Pastikan ekstensi Freighter terpasang dan aktif, lalu refresh halaman.");
        }
      }

      // Try to request access
      const response = await requestAccess();
      const address = normalizeAddress(response);

      if (!address) {
        throw new Error(response?.error?.message || "Gagal mengambil Public Key dari Freighter.");
      }

      setPublicKey(address);
      return address;
    } catch (err) {
      console.error("Connect wallet error:", err);
      setWalletError(err?.message || "Koneksi dibatalkan atau dompet terkunci.");
      throw err;
    } finally {
      setWalletLoading(false);
    }
  }, []);

  // -- FUNGSI DISCONNECT --
  const disconnectWallet = useCallback(() => {
    localStorage.setItem("wallet_disconnected", "true");
    setManuallyDisconnected(true);
    setPublicKey(null);
    setWalletError(null);
    setTxError(null);
    setTxSuccess(null);
  }, []);

  // -- CEK SALDO XLM --
  const getXLMBalance = useCallback(async (address) => {
    try {
      const response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${address || publicKey}`
      );
      const data = await response.json();
      const balance = data.balances?.find((b) => b.asset_type === "native");
      return balance ? balance.balance : "0";
    } catch (err) {
      console.error("Error cek saldo XLM:", err);
      return "0";
    }
  }, [publicKey]);

  useEffect(() => {
    const loadBalance = async () => {
      if (publicKey) {
        const balance = await getXLMBalance(publicKey);
        setXlmBalance(balance);
      } else {
        setXlmBalance(null);
      }
    };

    loadBalance();
  }, [publicKey, getXLMBalance]);

  // -- BACA KONTRAK (Tanpa Bayar Gas) --
  const readContract = useCallback(async (functionName, args = []) => {
    try {
      const keypair = Keypair.random();
      const account = new Account(keypair.publicKey(), "0");

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK,
      })
        .addOperation(contract.call(functionName, ...args))
        .setTimeout(30)
        .build();

      const result = await server.simulateTransaction(tx);
      if (rpc.Api.isSimulationError(result)) throw new Error(result.error);

      return scValToNative(result.result?.retval);
    } catch (err) {
      console.error(`readContract error:`, err);
      throw err;
    }
  }, [contract]);

  // -- MENUNGGU KONFIRMASI BLOCKCHAIN --
  const waitConfirmation = async (hash, maxTry = 20) => {
    for (let i = 0; i < maxTry; i++) {
      const res = await server.getTransaction(hash);
      if (res.status === "SUCCESS") return { success: true, hash };
      if (res.status === "FAILED") throw new Error("Transaksi gagal: " + hash);
      await new Promise((r) => setTimeout(r, 2000));
    }
    throw new Error("Waktu tunggu konfirmasi habis.");
  };

  // -- TULIS KONTRAK (Muncul Pop-up Tanda Tangan, Bayar Gas) --
  const writeContract = useCallback(async (functionName, args = []) => {
    if (!publicKey) throw new Error("Dompet belum terkoneksi!");
    setTxLoading(true);
    setTxError(null);
    setTxSuccess(null);
    try {
      const account = await server.getAccount(publicKey);
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK,
      })
        .addOperation(contract.call(functionName, ...args))
        .setTimeout(30)
        .build();

      const simResult = await server.simulateTransaction(tx);
      if (rpc.Api.isSimulationError(simResult)) throw new Error(simResult.error);

      const preparedTx = rpc.assembleTransaction(tx, simResult).build();

      const signResult = await signTransaction(preparedTx.toXDR(), {
        network: "TESTNET",
        networkPassphrase: NETWORK,
      });
      
      if (signResult.error) throw new Error(signResult.error);

      const signedTx = TransactionBuilder.fromXDR(signResult.signedTxXdr, NETWORK);
      const submitResult = await server.sendTransaction(signedTx);
      
      if (submitResult.status === "ERROR") throw new Error("Gagal submit ke jaringan: " + submitResult.errorResult);

      const confirmation = await waitConfirmation(submitResult.hash);
      setTxSuccess(confirmation.hash);
      return confirmation;
    } catch (err) {
      setTxError(err.message);
      throw err;
    } finally {
      setTxLoading(false);
    }
  }, [publicKey, contract]);

  return {
    publicKey,
    isWalletConnected,
    freighterInstalled,
    walletLoading,
    walletError,
    xlmBalance,
    getXLMBalance,
    connectWallet,
    disconnectWallet,
    readContract,
    writeContract,
    txLoading,
    txError,
    txSuccess,
  };
}