import { ReactNode } from 'react';

// @mui
import { SxProps } from '@mui/material/styles';
import Card, { CardProps } from '@mui/material/Card';

interface Props extends CardProps {
  children?: ReactNode;
  sx?: SxProps;
}

const modalCardSX = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  borderRadius: 4,
  overflow: 'hidden'
};

/***************************  MODAL - CARD  ***************************/

function ModalCard({ children, sx, ref, ...rest }: Props) {
  return (
    <Card sx={{ ...modalCardSX, ...sx }} ref={ref} {...rest}>
      {children}
    </Card>
  );
}

export default ModalCard;
