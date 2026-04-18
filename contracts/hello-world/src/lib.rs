#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec};

// 1. Struktur Data Sertifikat (Mirip NFT Metadata)
#[contracttype]
#[derive(Clone, Debug)]
pub struct Certificate {
    pub owner: Address,
    pub score: u32,
    pub cid: String, // Tempat naruh CID Pinata kamu
}

// 2. Kunci Storage
const CERT_DATA: Symbol = symbol_short!("CERT");

#[contract]
pub struct QuizContract;

#[contractimpl]
impl QuizContract {
    // Fungsi untuk Klaim Sertifikat (Hanya jika skor >= 3)
    pub fn claim_certificate(env: Env, user: Address, score: u32, cid: String) -> String {
        // Cek syarat kelulusan
        if score < 3 {
            return String::from_str(&env, "Skor kurang! Belajar lagi ya.");
        }

        // Ambil daftar sertifikat yang sudah ada
        let mut certs: Vec<Certificate> = env.storage()
            .instance()
            .get(&CERT_DATA)
            .unwrap_or(Vec::new(&env));

        // Buat data sertifikat baru
        let new_cert = Certificate {
            owner: user.clone(),
            score,
            cid,
        };

        certs.push_back(new_cert);

        // Simpan ke Blockchain
        env.storage().instance().set(&CERT_DATA, &certs);

        String::from_str(&env, "Selamat! Sertifikat NFT berhasil dicetak.")
    }

    // Fungsi untuk melihat semua orang yang sudah lulus
    pub fn get_all_certificates(env: Env) -> Vec<Certificate> {
        env.storage()
            .instance()
            .get(&CERT_DATA)
            .unwrap_or(Vec::new(&env))
    }
}