import React, { useRef } from 'react';
import { Box, Heading, Button } from '@chakra-ui/react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';

// Framer Motion 用コンポーネント
const MotionBox = motion(Box);

export default function HeroAdvanced() {
  // スクロール連動パララックス
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, -200]);

  // 3Dホバー傾き
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [0, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [0, 400], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };
  const handleMouseLeave = () => {
    mouseX.set(200);
    mouseY.set(150);
  };

  return (
    <Box id="main" position="relative" height="80vh" overflow="hidden">
      {/* 背景画像レイヤー */}
      <MotionBox
        style={{ y: yBg }}
        position="absolute"
        inset={0}
        backgroundImage="url('/cg_sylphia_h1_kissDeep.png')"
        backgroundSize="cover"
        backgroundPosition="center"
      />

      {/* SVG goo フィルター */}
      <svg width="0" height="0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* デコレーション円形 */}
      <MotionBox
        position="absolute"
        top="20%"
        left="10%"
        width="80px"
        height="80px"
        backgroundColor="rgba(255,255,255,0.6)"
        borderRadius="full"
        filter="url(#goo)"
        animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror' }}
      />

      {/* テキストレイヤー */}
      <Box
        position="relative"
        zIndex={10}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Heading as="h1" size="2xl" color="white" textAlign="center" textShadow="2px 2px #000">
          18+ Doujin Portfolio — Korokke
        </Heading>
      </Box>

      {/* インタラクティブ3Dカード */}
      <MotionBox
        ref={cardRef}
        position="absolute"
        bottom="10%"
        left="50%"
        transform="translateX(-50%)"
        width="240px"
        height="140px"
        backgroundColor="white"
        borderRadius="md"
        boxShadow="2xl"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Box p={4}>
          <Heading size="md" mb={2}>
            Explore Works
          </Heading>
          <Button colorScheme="teal">View Gallery</Button>
        </Box>
      </MotionBox>
    </Box>
  );
}
