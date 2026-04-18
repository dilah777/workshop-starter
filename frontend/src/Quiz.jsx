import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// Data soal kuis
const questions = [
  {
    question: "1. Atribut apa yang digunakan di baris paling atas pada Soroban Rust agar kontrak berjalan tanpa pustaka standar?",
    options: ["#[std]", "#[no_std]", "#[soroban_sdk]", "#[contract]"],
    answer: "#[no_std]"
  },
  {
    question: "2. Pada persamaan reaksi: aH2 + bO2 -> cH2O, berapakah nilai koefisien a, b, dan c agar reaksi setara?",
    options: ["1, 1, 1", "2, 1, 2", "1, 2, 1", "2, 2, 2"],
    answer: "2, 1, 2"
  },
  {
    question: "3. Perintah terminal apa yang digunakan untuk mengisi saldo XLM di Stellar Testnet?",
    options: ["stellar keys ls", "stellar contract deploy", "stellar keys fund [nama_akun]", "stellar contract build"],
    answer: "stellar keys fund [nama_akun]"
  },
  {
    question: "4. Pada reaksi pembakaran metana: CH4 + 2O2 -> CO2 + 2H2O, jumlah total atom Oksigen di sisi produk adalah...",
    options: ["2 atom", "3 atom", "4 atom", "5 atom"],
    answer: "4 atom"
  },
  {
    question: "5. Di dalam Soroban, tipe data apa yang sering digunakan sebagai 'Kunci' (Key) untuk menyimpan data di Storage?",
    options: ["String", "Integer", "Symbol", "Boolean"],
    answer: "Symbol"
  }
];

export default function Quiz({ userAddress }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fungsi saat user klik jawaban
  const handleAnswerOptionClick = (selectedOption) => {
    let currentScore = score;
    if (selectedOption === questions[currentQuestion].answer) {
      currentScore = score + 1;
      setScore(currentScore);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
      saveScoreToFirebase(currentScore); // Simpan ke Firebase pas soal habis
    }
  };

  // Fungsi menembak data ke Firebase
  const saveScoreToFirebase = async (finalScore) => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, "skor_kuis_kimia"), {
        address: userAddress || "Wallet-Belum-Konek",
        score: finalScore,
        waktu: new Date().toISOString()
      });
      console.log("Skor berhasil disimpan ke Firebase!");
    } catch (e) {
      console.error("Error menyimpan skor: ", e);
    }
    setIsSaving(false);
  };

  // Fungsi pura-pura klaim NFT untuk presentasi
  const claimNFT = () => {
    alert(`Memproses NFT Sertifikat untuk dompet:\n${userAddress}\n\nCID Gambar Kamu:\nipfs://bafkreia32fcmk5a6kraweiyvnbze45azem4ean5eht5yabiofo54pvhp7e\n\nSelamat! Anda telah lulus.`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
      <h2 style={{ color: "#111827", borderBottom: "2px solid #f3f4f6", paddingBottom: "10px", marginTop: 0 }}>Uji Kompetensi Web3 & Kimia</h2>

      {showResult ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h3 style={{ color: "#1f2937" }}>Kuis Selesai!</h3>
          <p style={{ fontSize: "1.2rem" }}>Skor Kamu: <strong style={{color: "#6366f1"}}>{score}</strong> dari {questions.length}</p>

          {isSaving ? (
            <p style={{ color: "#d97706" }}>⏳ Menyimpan skor ke database...</p>
          ) : (
            <p style={{ color: "#16a34a", fontWeight: "bold" }}>✅ Skor berhasil tersimpan di Firebase!</p>
          )}

          {score >= 3 ? (
            <div style={{ marginTop: "20px", padding: "15px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
              <p style={{ color: "#16a34a", fontWeight: "bold", fontSize: "1.1rem" }}>LULUS! Kamu berhak mendapatkan NFT Sertifikat.</p>
              <button onClick={claimNFT} style={{ padding: "12px 24px", backgroundColor: "#6366f1", color: "white", borderRadius: "8px", cursor: "pointer", border: "none", fontWeight: "bold", fontSize: "1rem", marginTop: "10px" }}>
                Klaim NFT Sertifikat Sekarang
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "20px", padding: "15px", background: "#fef2f2", borderRadius: "8px", border: "1px solid #fecaca" }}>
              <p style={{ color: "#dc2626", fontWeight: "bold", fontSize: "1.1rem" }}>Maaf, skor kamu belum cukup untuk mendapatkan Sertifikat.</p>
              <p style={{ color: "#991b1b" }}>Minimal jawaban benar adalah 3. Tetap semangat dan coba lagi!</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#6b7280", fontSize: "0.9rem" }}>
            <span>Pertanyaan {currentQuestion + 1} dari {questions.length}</span>
          </div>
          <p style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1f2937", lineHeight: "1.5" }}>
            {questions[currentQuestion].question}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(option)}
                style={{ padding: "12px 15px", cursor: "pointer", borderRadius: "8px", border: "1px solid #d1d5db", background: "#f9fafb", textAlign: "left", fontSize: "1rem" }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}