use std::path::PathBuf;
use tauri::api::dialog::blocking::FileDialogBuilder;

use crate::{error::Error, Result};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct FileStruct {
    pub name: String,
    pub path: String,
    pub extension: String,
}

impl FileStruct {
    fn from(path: PathBuf) -> Result<FileStruct> {
        let path_str = path.to_str().unwrap_or("").to_string();
        let name = path.file_name().and_then(|name| name.to_str());
        let extension = path.extension().and_then(|ext| ext.to_str());

        if !path.exists() {
            return Err(Error {
                message: "File does not exist".to_string(),
                context: Some(path_str),
            });
        }

        if name.is_none() {
            return Err(Error {
                message: "No File Name".to_string(),
                context: Some(path_str),
            });
        }

        if extension.is_none() {
            return Err(Error {
                message: "No file extension".to_string(),
                context: Some(path_str),
            });
        }

        Ok(FileStruct {
            path: path_str,
            name: name.unwrap().to_string(),
            extension: extension.unwrap().to_string(),
        })
    }
}

#[tauri::command]
pub async fn select_files() -> Result<Vec<FileStruct>> {
    match FileDialogBuilder::new().pick_files() {
        Some(buffers) => {
            let mut files: Vec<FileStruct> = Vec::new();
            for buffer in buffers {
                files.push(FileStruct::from(buffer)?);
            }

            Ok(files)
        }
        None => Err(Error {
            message: "No files selected".to_string(),
            context: None,
        }),
    }
}

#[tauri::command]
pub fn get_file_info(path: String) -> Result<FileStruct> {
    FileStruct::from(PathBuf::from(path))
}
