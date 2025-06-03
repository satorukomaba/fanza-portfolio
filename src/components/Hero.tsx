import React from 'react';
import { Heading, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';

type HeroProps = {};

const MotionHeading = motion(Heading);

export default function Hero(_: HeroProps) {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="top"
      className="relative h-screen overflow-hidden pt-16 bg-cover bg-center"
      // import.meta.env.BASE_URL が "/fanza-portfolio/" を指すようになる
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}cg_sylphia_h1_kissDeep.png)`,
      }}
    >
      {/* ヘッダー：右上に固定（リンクのみ） */}
      <header className="fixed top-0 right-0 p-4 z-50">
        <Link
          href="#top"
          onClick={scrollToTop}
          display="inline-flex"
          alignItems="center"
          px={4}
          py={2}
          bg="whiteAlpha.800"
          borderRadius="md"
          _hover={{ bg: 'whiteAlpha.900', boxShadow: 'md', transform: 'scale(1.05)' }}
          transition="all 0.2s ease-in-out"
          color="gray.800"
          fontWeight="bold"
        >
          同人ポートフォリオ｜コロッケ
        </Link>
      </header>

      {/* 中央コンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <MotionHeading
          as="h1"
          size="3xl"
          fontWeight="extrabold"
          color="white"
          dropShadow="lg"
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          textAlign="center"
        >
          18+ 同人ポートフォリオ — Korokke
          <br />
          <small>Digital Doujin Portfolio</small>
        </MotionHeading>
      </div>
    </div>
  );
}
