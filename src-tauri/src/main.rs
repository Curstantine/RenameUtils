#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod error;
mod files;

pub type Result<T> = std::result::Result<T, error::Error>;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            files::select_files,
            files::get_file_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
