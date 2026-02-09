import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const slots = [
  ...siteConfig.serviceSlots.morning,
  ...siteConfig.serviceSlots.evening,
];

export function SlotPicker({
  selectedSlot,
  onSlotChange,
  selectedDate,
  onDateChange,
}: {
  selectedSlot: string;
  onSlotChange: (slot: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Preferred Date</Label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDate}
        />
      </div>
      <div className="space-y-2">
        <Label>Preferred Time Slot</Label>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => onSlotChange(slot)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors",
                selectedSlot === slot
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
