use tauri::api::dialog::blocking::FileDialogBuilder;

use crate::error::Error;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct FileStruct {
    pub name: String,
    pub path: String,
    pub extension: String,
}

#[tauri::command]
pub async fn select_files() -> Result<Vec<FileStruct>, Error> {
    match FileDialogBuilder::new().pick_files() {
        Some(buffers) => {
            let mut files: Vec<FileStruct> = Vec::new();
            for buffer in buffers {
                let path = buffer.to_str().unwrap_or("").to_string();
                let name = buffer.file_name().and_then(|name| name.to_str());
                let extension = buffer.extension().and_then(|ext| ext.to_str());

                if name.is_none() {
                    return Err(Error {
                        message: "No File Name".to_string(),
                        context: Some(path),
                    });
                }

                if extension.is_none() {
                    return Err(Error {
                        message: "No file extension".to_string(),
                        context: Some(path),
                    });
                }

                files.push(FileStruct {
                    path,
                    name: name.unwrap().to_string(),
                    extension: extension.unwrap().to_string(),
                });
            }

            Ok(files)
        }
        None => Err(Error {
            message: "No files selected".to_string(),
            context: None,
        }),
    }
}
