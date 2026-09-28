"use client";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
interface ModalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
export default function ModalWrapper({
  open,
  onOpenChange,
  children,
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="sm:max-w-md">{children}</DialogContent>
    </Dialog>
  );
}
