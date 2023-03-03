#[derive(serde::Serialize, serde::Deserialize)]
pub struct Error {
    pub message: String,
    pub context: Option<String>,
}
