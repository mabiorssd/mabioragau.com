import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: {
    name: string;
    email: string;
    message: string;
    created_at: string;
  } | null;
}

export const ContactMessageModal = ({ isOpen, onClose, message }: ContactMessageModalProps) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Message from {message.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">From:</p>
            <p>{message.name} ({message.email})</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sent at:</p>
            <p>{new Date(message.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Message:</p>
            <p className="whitespace-pre-wrap">{message.message}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};