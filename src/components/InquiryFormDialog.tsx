import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X } from "lucide-react";
import InquiryForm from "./InquiryForm";

interface InquiryFormDialogProps {
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
}

const InquiryFormDialog = ({ trigger, defaultOpen = false }: InquiryFormDialogProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <FileText className="w-5 h-5" />
            Anfrage stellen
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">Qualifizierte Anfrage</DialogTitle>
              <DialogDescription className="mt-1">
                Senden Sie uns Ihre verbindliche Anfrage – ein persönlicher Ansprechpartner meldet sich bei Ihnen.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 py-6">
            <InquiryForm onSuccess={() => setOpen(false)} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryFormDialog;
