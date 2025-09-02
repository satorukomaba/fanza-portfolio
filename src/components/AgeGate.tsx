import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from '@chakra-ui/react';

type AgeGateProps = {
  onConfirm: () => void;
};

export default function AgeGate({ onConfirm }: AgeGateProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" backgroundColor="blackAlpha.300" />
      <ModalContent borderRadius="2xl" boxShadow="2xl" overflow="hidden">
        <ModalHeader bgGradient="linear(to-r, brand.400, accent.400)" color="white">年齢確認</ModalHeader>
        <ModalBody>
          本サイトは18歳未満閲覧禁止です。18歳以上ですか？
          <Button onClick={handleConfirm} mt={4} variant="pill">
            はい
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
