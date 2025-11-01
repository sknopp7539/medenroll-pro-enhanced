import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payerId: string | number;
  payerName: string;
};

export function BulkEnrollDialog({ open, onOpenChange, payerId, payerName }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Enroll — {payerName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div>Payer ID: {String(payerId)}</div>
          <div>This is a placeholder dialog. Replace with your real bulk-enroll flow later.</div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BulkEnrollDialog;
