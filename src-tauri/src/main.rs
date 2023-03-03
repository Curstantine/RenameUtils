#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod error;
mod files;

use crate::files::select_files;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![select_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
