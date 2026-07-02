import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import AgeGate from './AgeGate';

const renderGate = (onConfirm = vi.fn(), onDeny = vi.fn()) => {
  render(
    <ChakraProvider theme={theme}>
      <AgeGate onConfirm={onConfirm} onDeny={onDeny} />
    </ChakraProvider>,
  );
  return { onConfirm, onDeny };
};

describe('AgeGate', () => {
  it('「はい」クリックで onConfirm が呼ばれる', async () => {
    const user = userEvent.setup();
    const { onConfirm, onDeny } = renderGate();

    await user.click(screen.getByRole('button', { name: /はい/ }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onDeny).not.toHaveBeenCalled();
  });

  it('「いいえ」クリックで onDeny が呼ばれ、onConfirm は呼ばれない', async () => {
    const user = userEvent.setup();
    const { onConfirm, onDeny } = renderGate();

    await user.click(screen.getByRole('button', { name: /いいえ/ }));

    expect(onDeny).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
