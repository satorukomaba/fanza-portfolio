import { Box, Container, Heading, Text, Image, VStack, Badge, Button, HStack } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import works from '../data/works.json'

function WorkDetail() {
  const { id } = useParams()
  const workId = id ? parseInt(id, 10) : undefined
  const work = works.find(w => w.id === workId)

  if (!work) {
    return <Text>作品が見つかりません。</Text>
  }

  // デバッグ用のログ出力
  console.log('work:', work)
  console.log('work.affiliateUrl:', work.affiliateUrl)
  console.log('work.fanzaUrl:', work.fanzaUrl)

  // アフィリエイトURLがある場合はそれを使用、なければ通常のFANZAURLを使用
  const linkUrl = work.affiliateUrl || work.fanzaUrl
  console.log('linkUrl:', linkUrl)

  return (
    <Container maxW="container.lg" py={12}>
      <VStack spacing={8} align="stretch">
        <Box bg="white" p={6} borderRadius="2xl" boxShadow="xl" position="relative" _hover={{ boxShadow: '2xl', transform: 'translateY(-2px)' }} transition="all 0.25s ease">
          <a 
            href={linkUrl} 
            target="_blank" 
            rel={work.affiliateUrl ? "sponsored" : "noopener noreferrer"}
            style={{ textDecoration: 'none' }}
          >
            <Box 
              position="relative" 
              _hover={{ transform: 'scale(1.02) rotate(0.2deg)', transition: 'transform 0.25s ease' }}
            >
              <Image
                src={work.imageUrl}
                alt={work.title}
                borderRadius="xl"
                mb={6}
                maxH="500px"
                objectFit="contain"
                mx="auto"
              />
              {work.affiliateUrl && (
                <Badge position="absolute" top={2} right={2} bgGradient="linear(to-r, brand.400, accent.400)" color="white" px={3} py={1} borderRadius="full" fontSize="xs" boxShadow="glow">FANZA</Badge>
              )}
            </Box>
            <Heading size="xl" mb={4} color="brand.600" _hover={{ color: 'brand.700', textDecoration: 'underline' }} transition="color 0.2s ease-in-out">{work.title}</Heading>
          </a>
          <Text fontSize="lg" color="gray.700" mt={4}>{work.description}</Text>
          <HStack mt={6} spacing={4}>
            <Button as="a" href={linkUrl} target="_blank" variant="pill" size="md">作品ページへ</Button>
            <Button as="a" href={work.fanzaUrl} target="_blank" colorScheme="accent" variant="solid" size="md">FANZAで見る</Button>
          </HStack>
          {/* デバッグ用表示 */}
          <Text fontSize="sm" color="gray.500" mt={2}>
            デバッグ: {work.affiliateUrl ? 'アフィリエイトURL使用' : 'FANZAURL使用'}
          </Text>
          <Text fontSize="xs" color="gray.400" wordBreak="break-all">
            URL: {linkUrl}
          </Text>
        </Box>
      </VStack>
    </Container>
  )
}

export default WorkDetail 