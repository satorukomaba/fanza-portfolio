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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>年齢確認</ModalHeader>
        <ModalBody>
          本サイトは18歳未満閲覧禁止です。18歳以上ですか？
          <Button onClick={handleConfirm} mt={4} colorScheme="teal">
            はい
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
