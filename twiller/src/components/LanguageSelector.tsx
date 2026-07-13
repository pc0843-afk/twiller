"use client";

import { useState } from "react";

export default function LanguageSelector() {
  const [language, setLanguage] = useState("English");

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);

    if (lang === "French") {
      alert("OTP sent to your registered Email.");
    } else {
      alert("OTP sent to your registered Mobile Number.");
    }
  };

  return (
    <div>
      <select
        value={language}
        onChange={changeLanguage}
        className="text-black rounded px-2 py-1"
      >
        <option>English</option>
        <option>Hindi</option>
        <option>Spanish</option>
        <option>Portuguese</option>
        <option>Chinese</option>
        <option>French</option>
      </select>
    </div>
  );
}