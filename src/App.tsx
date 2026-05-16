import React from 'react';
import {
  ChakraProvider,
  Box,
  Container,
  SimpleGrid,
  Image,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Icon,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon } from '@chakra-ui/icons';
import { SEO } from './components/SEO';
import theme from './theme';
import Hero from './components/Hero';
import worksData from './data/works.json';
import FanzaModal from './components/FanzaModal';

// Work型をこのファイル内で定義してインポートエラーを回避
interface Work {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  fanzaUrl: string;
  affiliateUrl?: string;
  category?: string;
}

// モーションコンポーネント
const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

const getCategory = (w: any) => {
  if (w.category) return w.category;
  if (w.imageUrl.includes('/game/')) return 'ゲーム';
  if (w.imageUrl.includes('/cg/')) return 'CG集';
  if (w.imageUrl.includes('/comic/')) return 'コミック';
  return 'その他';
};

// 画像カードコンポーネント（スケルトン対応）
const WorkCard = ({ work, onClick }: { work: Work; onClick: () => void }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const category = getCategory(work);
  const isAffiliate = !!work.affiliateUrl;

  return (
    <Box
      bg="white"
      borderWidth="1px"
      rounded="xl"
      overflow="hidden"
      shadow="md"
      transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      _hover={{ 
        transform: 'translateY(-8px) scale(1.02)', 
        shadow: '2xl', 
        outline: '3px solid rgba(237,188,232,0.6)' 
      }}
      position="relative"
      onClick={onClick}
      cursor="pointer"
      role="group"
    >
      <Box position="relative" minH="200px">
        <Skeleton isLoaded={isLoaded} height="100%" width="100%" position="absolute" top={0} left={0} />
        <Image
          src={work.imageUrl}
          loading="lazy"
          objectFit="cover"
          w="100%"
          h="auto"
          alt={work.title}
          onLoad={() => setIsLoaded(true)}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 0.5s ease-in"
        />
        
        <Box
          position="absolute"
          top={2}
          left={2}
          bg="blackAlpha.700"
          color="white"
          px={2}
          py={0.5}
          borderRadius="md"
          fontSize="2xs"
          fontWeight="bold"
          backdropFilter="blur(4px)"
        >
          {category}
        </Box>

        {isAffiliate && (
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="blue.500"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            fontSize="xs"
            fontWeight="bold"
            boxShadow="0 2px 4px rgba(0,0,0,0.2)"
          >
            FANZA
          </Box>
        )}
      </Box>

      <Box p={4}>
        <Heading size="md" color="gray.800" noOfLines={2} minH="3.6em" lineHeight="shorter">
          {work.title}
        </Heading>
        <Text mt={2} color="gray.500" fontSize="xs" fontWeight="medium">
          {work.description || `${category}作品`}
        </Text>
        <Button 
          mt={4} 
          colorScheme={isAffiliate ? "blue" : "teal"} 
          size="sm"
          w="full"
          variant="ghost"
          borderWidth="1px"
          _groupHover={{ bg: isAffiliate ? "blue.50" : "teal.50" }}
        >
          詳細を見る
        </Button>
      </Box>
    </Box>
  );
};

export default function App() {
  const siteUrl = 'https://koroke-works.pages.dev/';
  const works = worksData as Work[];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWork, setSelectedWork] = React.useState<Work | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('すべて');
  const [count, setCount] = React.useState(12);

  const initialCount = 12;
  const perPage = 12;

  // カテゴリ一覧
  const categories = React.useMemo(() => {
    const cats = new Set(works.map(getCategory));
    return ['すべて', ...Array.from(cats)];
  }, [works]);

  // フィルタリング
  const filteredWorks = React.useMemo(() => {
    let result = [...works].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    
    if (selectedCategory !== 'すべて') {
      result = result.filter(w => getCategory(w) === selectedCategory);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(w => 
        w.title.toLowerCase().includes(q) || 
        w.description.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [selectedCategory, searchQuery, works]);

  // 検索やカテゴリ変更時に表示数をリセット
  React.useEffect(() => {
    setCount(initialCount);
  }, [selectedCategory, searchQuery]);

  const displayed = filteredWorks.slice(0, count);

  // SEOタイトルの動的生成
  const seoTitle = React.useMemo(() => {
    if (searchQuery) return `「${searchQuery}」の検索結果 | Korokke Portfolio`;
    if (selectedCategory !== 'すべて') return `${selectedCategory}作品一覧 | Korokke Portfolio`;
    return "18+ Doujin Portfolio — Korokke";
  }, [selectedCategory, searchQuery]);

  // 構造化データ (JSON-LD) の生成
  const structuredData = React.useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": displayed.map((w, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "CreativeWork",
          "name": w.title,
          "image": w.imageUrl,
          "genre": getCategory(w),
          "url": w.affiliateUrl || w.fanzaUrl
        }
      }))
    };
  }, [displayed]);

  return (
    <ChakraProvider theme={theme}>
      <SEO
        title={seoTitle}
        description={
          selectedCategory === 'すべて' 
            ? "FANZA同人の最新ポートフォリオ。ゲーム、CG集、コミックなど、ハイクオリティな成人向け同人作品を多数掲載しています。"
            : `${selectedCategory}ジャンルの厳選作品をチェック。Korokkeサークルが手がける最高級の体験を今すぐ。`
        }
        url={siteUrl}
        image={`${siteUrl}ogp.png`}
      />
      
      {/* 構造化データの埋め込み */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
        <Hero />

        {/* コントロールセクション */}
        <Container maxW="container.lg" mt={-10} position="relative" zIndex={2}>
          <VStack 
            bg="white" 
            p={6} 
            rounded="2xl" 
            shadow="xl" 
            spacing={6}
            borderWidth="1px"
          >
            {/* 検索バー */}
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={SearchIcon} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="作品名やキーワードで検索..."
                borderRadius="full"
                bg="gray.50"
                border="none"
                _focus={{ bg: 'white', boxShadow: 'outline' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            {/* カテゴリフィルター */}
            <HStack spacing={2} justify="center" wrap="wrap" w="full">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? 'solid' : 'ghost'}
                  colorScheme="pink"
                  onClick={() => setSelectedCategory(cat)}
                  borderRadius="full"
                  px={6}
                >
                  {cat}
                </Button>
              ))}
            </HStack>
          </VStack>
        </Container>

        {/* 作品リスト */}
        <Container flex="1" maxW="container.lg" py={12}>
          <AnimatePresence mode="wait">
            <MotionSimpleGrid
              key={`${selectedCategory}-${searchQuery}`}
              columns={{ base: 1, sm: 2, md: 3 }}
              spacing={8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {displayed.map((w, index) => (
                <MotionBox
                  layout
                  key={w.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index % 12) * 0.05 }}
                >
                  <WorkCard 
                    work={w} 
                    onClick={() => {
                      setSelectedWork(w);
                      onOpen();
                    }} 
                  />
                </MotionBox>
              ))}
            </MotionSimpleGrid>
          </AnimatePresence>
          
          {/* 検索結果なし */}
          {displayed.length === 0 && (
            <VStack py={20} spacing={4}>
              <Text fontSize="xl" color="gray.400" fontWeight="bold">
                お探しの作品は見つかりませんでした
              </Text>
              <Button variant="link" colorScheme="pink" onClick={() => {setSearchQuery(''); setSelectedCategory('すべて');}}>
                すべての作品を表示する
              </Button>
            </VStack>
          )}

          {count < filteredWorks.length && (
            <Box textAlign="center" mt={16}>
              <Button 
                onClick={() => setCount(prev => prev + perPage)} 
                colorScheme="pink" 
                size="lg" 
                px={10} 
                borderRadius="full" 
                shadow="md"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              >
                さらに表示 ({filteredWorks.length - count}件)
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <FanzaModal isOpen={isOpen} onClose={onClose} work={selectedWork} />
    </ChakraProvider>
  );
}
