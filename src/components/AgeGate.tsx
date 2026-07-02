import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  HStack,
} from '@chakra-ui/react';

type AgeGateProps = {
  onConfirm: () => void;
  onDeny: () => void;
};

export default function AgeGate({ onConfirm, onDeny }: AgeGateProps) {
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
        <ModalBody pb={6}>
          本サイトは18歳未満閲覧禁止です。18歳以上ですか？
          <HStack mt={4} spacing={3}>
            <Button onClick={handleConfirm} variant="pill">
              はい（18歳以上）
            </Button>
            <Button onClick={onDeny} variant="ghost" colorScheme="gray">
              いいえ（退出する）
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
