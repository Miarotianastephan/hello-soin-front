// src/components/dialogs/ErrorDialog.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ErrorDialog = ({ isOpen, message, onClose }) => (
  <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Erreur</DialogTitle>
        <DialogDescription className="text-red-700">{message}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onClose}>OK</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ErrorDialog;
