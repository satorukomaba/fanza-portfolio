import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Image,
  Button,
  VStack,
  Heading,
  HStack,
  Badge,
  ModalFooter,
} from '@chakra-ui/react';
import { FaXTwitter } from "react-icons/fa6";

interface Work {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  fanzaUrl: string;
  affiliateUrl?: string;
  category?: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  work: Work | null;
};

export default function FanzaModal({ isOpen, onClose, work }: Props) {
  if (!work) return null;

  const linkUrl = work.affiliateUrl || work.fanzaUrl;
  const isAffiliate = !!work.affiliateUrl;

  const handleShare = () => {
    const text = `【${work.title}】\nFANZA同人ポートフォリオでチェック！\n#FANZA #同人 #Korokke`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(8px)" backgroundColor="blackAlpha.600" />
      <ModalContent borderRadius="2xl" overflow="hidden" mx={4}>
        <ModalCloseButton zIndex={2} bg="whiteAlpha.800" borderRadius="full" />
        
        <ModalBody p={0}>
          <VStack spacing={0} align="stretch">
            {/* メイン画像 */}
            <Box position="relative" bg="gray.100">
              <Image
                src={work.imageUrl}
                alt={work.title}
                w="100%"
                maxH="400px"
                objectFit="contain"
                mx="auto"
              />
              <Badge
                position="absolute"
                bottom={4}
                left={4}
                colorScheme="blackAlpha"
                variant="solid"
                fontSize="xs"
                px={3}
                borderRadius="full"
              >
                {work.category || '作品'}
              </Badge>
            </Box>

            {/* コンテンツ */}
            <VStack p={6} spacing={4} align="start">
              <Heading size="lg" color="gray.800">
                {work.title}
              </Heading>
              
              <Text color="gray.600" fontSize="md" lineHeight="tall">
                {work.description || "この作品の詳細情報はFANZA公式ページでご確認いただけます。高品質な作品をぜひお楽しみください。"}
              </Text>

              {isAffiliate && (
                <Badge colorScheme="blue" variant="subtle" px={2} borderRadius="md">
                  FANZA公式販売ページ
                </Badge>
              )}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" p={4}>
          <HStack spacing={3} w="full">
            <Button
              variant="outline"
              colorScheme="twitter"
              onClick={handleShare}
              leftIcon={<FaXTwitter />}
              fontSize="sm"
              borderRadius="full"
              px={4}
            >
              シェア
            </Button>
            <Box flex={1} />
            <Button variant="ghost" onClick={onClose}>
              閉じる
            </Button>
            <Button
              as="a"
              href={linkUrl}
              target="_blank"
              rel={isAffiliate ? "sponsored" : "noopener noreferrer"}
              colorScheme="pink"
              flex={2}
              shadow="md"
              _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
            >
              作品ページで見る
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
 