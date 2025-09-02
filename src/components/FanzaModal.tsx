import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Box
} from '@chakra-ui/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  fanzaUrl: string;
  workTitle: string;
};

export default function FanzaModal({ isOpen, onClose, fanzaUrl, workTitle }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" backgroundColor="blackAlpha.300" />
      <ModalContent borderRadius="2xl" boxShadow="2xl">
        <ModalHeader bgGradient="linear(to-r, brand.400, accent.400)" color="white" borderTopRadius="2xl">{workTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          {fanzaUrl ? (
            <Box as="iframe" src={fanzaUrl} width="100%" height="500px" sx={{ border: 'none' }} />
          ) : (
            <Text>URLが指定されていません。</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 