import { Box, Container, Heading, Text, Image, VStack } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import works from '../data/works.json'

function WorkDetail() {
  const { id } = useParams()
  const workId = id ? parseInt(id, 10) : undefined
  const work = works.find(w => w.id === workId)

  if (!work) {
    return <Text>作品が見つかりません。</Text>
  }

  return (
    <Container maxW="container.lg" py={12}>
      <VStack spacing={8} align="stretch">
        <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
          <Image
            src={work.imageUrl}
            alt={work.title}
            borderRadius="md"
            mb={6}
            maxH="500px"
            objectFit="contain"
            mx="auto"
          />
          <Heading size="xl" mb={4} color="brand.600">{work.title}</Heading>
          <Text fontSize="lg" color="gray.700">
            {work.description}
          </Text>
        </Box>
      </VStack>
    </Container>
  )
}

export default WorkDetail 