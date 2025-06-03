import React from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Link,
  Button,
} from '@chakra-ui/react';
import { SEO } from './components/SEO';
import theme from './theme';
import Hero from './components/Hero';
import works from './data/works.json';

export default function App() {
  const siteUrl = 'https://satorukomaba.github.io/fanza-portfolio/';

  // 固定背景色: ライトピンク
  const bg = 'pink.200';

  // 初期表示件数と追加件数
  const initialCount = 9;
  const perPage = 9;
  const [count, setCount] = React.useState(initialCount);
  const handleShowMore = () => {
    setCount(prev => Math.min(prev + perPage, works.length));
  };
  const displayed = works.slice(0, count);

  return (
    <ChakraProvider theme={theme}>
      {/* SEO メタタグ */}
      <SEO
        title="18+ Doujin Portfolio — Korokke"
        description="FANZA同人作品ポートフォリオ – 18+ Doujin Portfolio — Korokke"
        url={siteUrl}
        image={`${siteUrl}ogp.png`}
      />

      {/* Hero セクション */}
      <Box minH="100vh" display="flex" flexDirection="column" bg={bg}>
        <Hero />

        {/* 作品一覧へのリンク */}
        <Box textAlign="center" mt={8} id="works">
          <Link href="#works" fontWeight="bold">
            同人ポートフォリオ作品一覧へ
          </Link>
        </Box>

        {/* 作品リスト */}
        <Container flex="1" maxW="container.lg" py={12}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {displayed.map(w => (
              <Link key={w.id} href={w.fanzaUrl} isExternal _hover={{ textDecoration: 'none' }}>
                <Box
                  bg="white"
                  borderWidth="1px"
                  rounded="lg"
                  overflow="hidden"
                  shadow="md"
                  transition="transform 0.3s ease, box-shadow 0.3s ease"
                  transformOrigin="center"
                  _hover={{ transform: 'rotate(2deg)', boxShadow: 'xl', outline: '2px solid rgba(237,188,232,0.8)' }}
                >
                  <Image
                    src={w.imageUrl}
                    loading="lazy"
                    objectFit="cover"
                    w="100%"
                    h="auto"
                    transition="transform 0.3s ease"
                    _hover={{ transform: 'rotate(1deg)' }}
                    alt={`${w.title} 同人デジタルノベルゲーム | FANZA ポートフォリオ`}
                  />
                  <Box p={4}>
                    <Heading size="md" color="gray.800">{w.title}</Heading>
                    <Text mt={2} color="gray.600">{w.description}</Text>
                    <Button as="a" href={w.fanzaUrl} target="_blank" mt={4} colorScheme="teal" size="sm">
                      詳細を見る
                    </Button>
                  </Box>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
          {count < works.length && (
            <Box textAlign="center" mt={8}>
              <Button onClick={handleShowMore} colorScheme="pink" size="lg">
                もっと見る
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </ChakraProvider>
  );
}
