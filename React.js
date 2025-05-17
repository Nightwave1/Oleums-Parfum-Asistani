// Kokunu Bul - Kişiye Özel Parfüm Testi (Tam Sistem)

// 1. React + Tailwind CSS ile temel yapı
// 2. Soru akışı + veri toplama
// 3. Flask backend ile sonuç hesaplama
// 4. JSON parfüm veritabanı
// 5. Sonuç ekranı

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "Yaş aralığını seç",
    options: ["18-24", "25-34", "35-44", "45+"],
    key: "yas"
  },
  {
    question: "Cinsiyetin nedir?",
    options: ["Kadın", "Erkek", "Diğer"],
    key: "cinsiyet"
  },
  {
    question: "Hafta sonu seni en çok nerede buluruz?",
    options: ["Doğada", "Partide", "Evde", "Kafede"],
    key: "yasam"
  },
  {
    question: "Bir koku seç",
    options: ["Çiçeksi", "Odunsu", "Baharatlı", "Ferah"],
    key: "koku"
  },
  {
    question: "Parfümü hangi mevsimde kullanırsın?",
    options: ["Yaz", "Kış", "İlkbahar", "Sonbahar"],
    key: "mevsim"
  },
  {
    question: "Stilin hangisine daha yakın?",
    options: ["Spor", "Klasik", "Bohem", "Lüks"],
    key: "stil"
  }
];

export default function KokunuBul() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (answer) => {
    const key = questions[current].key;
    const updated = { ...answers, [key]: answer };
    setAnswers(updated);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      calculateResult(updated);
    }
  };

  const calculateResult = async (data) => {
    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setResult(result);
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {!result ? (
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">{questions[current].question}</h2>
            <div className="grid grid-cols-2 gap-2">
              {questions[current].options.map((opt, idx) => (
                <Button key={idx} onClick={() => handleAnswer(opt)}>{opt}</Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-2xl font-bold">Senin kokun: {result.name}</h2>
            <p><strong>Tarz:</strong> {result.notalar?.join(", ")}</p>
            <p><strong>Stil:</strong> {result.stil?.join(", ")}</p>
            <p><strong>Mevsim:</strong> {result.mevsim?.join(", ")}</p>
            <Button onClick={() => { setResult(null); setCurrent(0); setAnswers({}); }}>Tekrar Dene</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
