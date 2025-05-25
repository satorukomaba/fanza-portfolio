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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{workTitle}</ModalHeader>
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