import { Box, Container, Heading, Text, Image, VStack, Badge, Button } from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { SEO } from './SEO';
import worksData from '../data/works.json';
import type { Work } from '../types/work';
import { getCategory, getCid, SITE_URL } from '../lib/works';

const works = worksData as Work[];

export default function WorkDetail() {
  const { cid } = useParams();
  const work = works.find((w) => getCid(w) === cid);

  if (!work) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack spacing={6}>
          <Heading size="lg" color="gray.700">
            作品が見つかりません
          </Heading>
          <Button as={RouterLink} to="/" variant="pill">
            トップに戻る
          </Button>
        </VStack>
      </Container>
    );
  }

  const linkUrl = work.affiliateUrl || work.fanzaUrl;
  const isAffiliate = !!work.affiliateUrl;
  const category = getCategory(work);
  const pageUrl = `${SITE_URL}/works/${cid}`;
  const description =
    work.description || `${category}作品「${work.title}」。FANZA 同人サークル Korokke の作品ページ。`;

  // 販売者は FANZA 側なので価格前提の Product/Offer は使わず、実態に即した CreativeWork にする
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.title,
    image: work.imageUrl,
    ...(work.description ? { description: work.description } : {}),
    genre: category,
    url: pageUrl,
    creator: { '@type': 'Organization', name: 'Korokke' },
  };

  return (
    <>
      <SEO
        title={`${work.title} | Korokke 同人ポートフォリオ`}
        description={description}
        url={pageUrl}
        image={work.imageUrl}
      />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.md" py={{ base: 8, md: 12 }}>
          <Button as={RouterLink} to="/" variant="ghost" colorScheme="pink" size="sm" mb={6}>
            ← 作品一覧へ
          </Button>

          <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="2xl" boxShadow="xl">
            <Box position="relative" mb={6}>
              <Image
                src={work.imageUrl}
                alt={work.title}
                borderRadius="xl"
                maxH="520px"
                objectFit="contain"
                mx="auto"
                w="100%"
              />
              <Badge
                position="absolute"
                top={3}
                left={3}
                colorScheme="blackAlpha"
                variant="solid"
                borderRadius="full"
                px={3}
              >
                {category}
              </Badge>
            </Box>

            <Heading as="h1" size="lg" color="gray.800" mb={4}>
              {work.title}
            </Heading>

            <Text fontSize="md" color="gray.700" lineHeight="tall" whiteSpace="pre-wrap">
              {description}
            </Text>

            <Button
              as="a"
              href={linkUrl}
              target="_blank"
              rel={isAffiliate ? 'sponsored noopener' : 'noopener noreferrer'}
              colorScheme="pink"
              size="lg"
              w="full"
              mt={8}
              shadow="md"
              _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
            >
              FANZA で見る
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
