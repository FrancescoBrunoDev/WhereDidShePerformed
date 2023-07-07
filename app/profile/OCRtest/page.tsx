
"use client"
import { createWorker } from "tesseract.js";
import { useState } from "react";

interface OCRResult {
  text: string;
}

export default function OCR() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrResult, setOCRResult] = useState<OCRResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    setOCRResult(null);
  };

  const handleOCR = async () => {
    if (!imageFile) {
      return;
    }

    setIsLoading(true);
    const worker = await createWorker({
      logger: (m) => console.log(m),
    });
    await worker.loadLanguage('frk+deu');
    await worker.initialize('frk+deu');
    const { data: { text } } = await worker.recognize(imageFile);
    setOCRResult({ text });
    await worker.terminate();
    setIsLoading(false);
  };

  return (
    <div>
      <label>
        Select image:
        <input type="file" onChange={handleImageFileChange} />
      </label>
      <button onClick={handleOCR} disabled={!imageFile || isLoading}>
        {isLoading ? "Loading..." : "Start OCR"}
      </button>
      {ocrResult?.text && <p>{ocrResult.text}</p>}
    </div>
  );
}
