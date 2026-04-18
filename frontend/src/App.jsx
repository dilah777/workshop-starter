import { useContract } from "./hooks/useContract";
import Quiz from "./Quiz"; // Memanggil file Quiz yang baru dibuat

// - Styles --------------------------
const s = {
  app: { maxWidth: 600, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" },
  title: { fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#111827" },
  btnPrimary: { background: "#6366f1", color: "#fff", border: "none", padding: "0.5rem 1.1rem", borderRadius: 8, cursor: "pointer", fontWeight: 500 },
  btnOutline: { background: "transparent", color: "#374151", border: "1px solid #d1d5db", padding: "0.5rem 1.1rem", borderRadius: 8, cursor: "pointer" },
  walletInfo: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  address: { fontSize: "0.8rem", color: "#6b7280", fontFamily: "monospace", background: "#f3f4f6", padding: "0.4rem 0.75rem", borderRadius: 6 },
  balance: { fontSize: "0.75rem", color: "#6366f1", fontWeight: 600 },
  walletRow: { display: "flex", alignItems: "center", gap: 10 },
  error: { color: "#ef4444", fontSize: "0.85rem", margin: "0.5rem 0" },
  welcomeMsg: { textAlign: "center", padding: "3rem 1rem", background: "#f8fafc", borderRadius: "10px", border: "2px dashed #cbd5e1" }
};

export default function App() {
  // - Hook - mengambil status dompet pengguna ---
  const {
    publicKey,
    isWalletConnected,
    walletLoading,
    walletError,
    connectWallet,
    disconnectWallet,
    xlmBalance,
  } = useContract();

  // - UI ---------------------------
  return (
    <div style={s.app}>

      {/* Header Aplikasi */}
      <div style={s.header}>
        <h1 style={s.title}>Edu-DApp Kimia</h1> {/* Nama disesuaikan dengan skripsi kamu */}

        {isWalletConnected ? (
          <div style={s.walletInfo}>
            <div style={s.walletRow}>
              <span style={s.address}>
                {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
              </span>
              <button style={s.btnOutline} onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
            {xlmBalance !== null && (
              <span style={s.balance}>
                {parseFloat(xlmBalance).toFixed(2)} XLM
              </span>
            )}
          </div>
        ) : (
          <button style={s.btnPrimary} onClick={connectWallet} disabled={walletLoading}>
            {walletLoading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>

      {/* Menampilkan pesan error jika dompet gagal konek */}
      {walletError && <p style={s.error}>⚠ {walletError}</p>}

      {/* LOGIKA UTAMA: Jika dompet konek = Muncul Kuis, Jika tidak = Muncul Pesan */}
      {isWalletConnected ? (
        // Mengirimkan alamat dompet (publicKey) ke komponen Quiz
        <Quiz userAddress={publicKey} />
      ) : (
        <div style={s.welcomeMsg}>
          <h2 style={{marginTop: 0, color: "#334155"}}>Selamat Datang, Praktisi!</h2>
          <p style={{color: "#64748b", lineHeight: 1.6}}>
            Silakan hubungkan dompet Freighter kamu di pojok kanan atas untuk memulai Uji Kompetensi Kimia & Web3. 
            Raih skor minimal 3 untuk mengklaim Sertifikat NFT!
          </p>
        </div>
      )}

    </div>
  );
}