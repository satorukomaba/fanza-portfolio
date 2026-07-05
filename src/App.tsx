import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AgeGate from './components/AgeGate';
import Home from './pages/Home';
import WorkDetail from './components/WorkDetail';

const AGE_VERIFIED_KEY = 'age_verified';

export default function App() {
  const [ageVerified, setAgeVerified] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(AGE_VERIFIED_KEY) === 'true';
  });

  const handleAgeConfirm = () => {
    window.localStorage.setItem(AGE_VERIFIED_KEY, 'true');
    setAgeVerified(true);
  };

  const handleAgeDeny = () => {
    // 18歳未満は外部サイトへ退出させる
    window.location.href = 'https://www.google.com/';
  };

  // 年齢確認前はサイト全体（トップも作品ページも）をゲートで塞ぐ
  if (!ageVerified) {
    return <AgeGate onConfirm={handleAgeConfirm} onDeny={handleAgeDeny} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/works/:cid" element={<WorkDetail />} />
    </Routes>
  );
}
