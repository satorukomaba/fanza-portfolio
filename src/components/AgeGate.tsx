import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Heading,
  VStack
} from '@chakra-ui/react';

type Props = { children: React.ReactNode };

export default function AgeGate({ children }: Props) {
  const [accepted, setAccepted] = useState<boolean>(() =>
    localStorage.getItem('ageAccepted') === 'true'
  );

  // デバッグのためlocalStorageの参照を一時的に無効化
  // useEffect(() => {
  //   if (accepted) localStorage.setItem('ageAccepted', 'true');
  // }, [accepted]);

  const handleAccept = () => {
    setAccepted(true);
    localStorage.setItem('ageAccepted', 'true'); // 同意したらlocalStorageに保存
  };

  if (accepted) return <>{children}</>;

  return (
    <Modal isOpen={!accepted} onClose={() => {}} isCentered closeOnOverlayClick={false} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalHeader>
          <Heading size="lg" textAlign="center">このサイトは成人向けです</Heading>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} textAlign="center">
            <Text fontSize="md">18歳以上ですか？</Text>
            <Button
              colorScheme="red"
              size="lg"
              onClick={handleAccept}
              width="100%"
            >
              はい、18歳以上です
            </Button>
            <Text fontSize="xs" color="gray.500">
              * 「はい」を選択すると、今後この確認は表示されません。
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 