'use client';

import { ReactNode, MouseEvent } from 'react';

// @mui
import { SxProps } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

// @third-party
import { AnimatePresence, motion } from 'framer-motion';

type AnimatedModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  sx?: SxProps;
  modalSize?: SxProps;
};

/***************************  MODAL - ANIMATED  ***************************/

export default function AnimatedModal({ open, onClose, children, sx, modalSize }: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <Modal
          open
          onClose={onClose}
          aria-labelledby="modal"
          aria-describedby="modal-content"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}
        >
          <Box
            sx={modalSize || { width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' }, height: 'auto' }}
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0.75 }}
              transition={{ type: 'tween' }}
            >
              {children}
            </motion.div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
}
