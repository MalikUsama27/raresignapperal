import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/lib/catalog.functions";
import { inquirySchema } from "@/lib/catalog.schemas";

type Errors = Partial<Record<string, string>>;

export function InquiryForm({
  productName,
  productId,
  onSuccess,
}: {
  productName?: string | undefined;
  productId?: string | undefined;
  onSuccess?: (() => void) | undefined;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const send = useServerFn(submitInquiry);

  const mutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => send({ data: values as never }),
    onSuccess: () => {
      toast.success("Inquiry received", {
        description: "Our export team replies within one business day.",
      });
      setErrors({});
      onSuccess?.();
    },
    onError: (error: Error) => toast.error("Submission failed", { description: error.message }),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const raw = {
      full_name: String(form.get("full_name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      country: String(form.get("country") ?? ""),
      quantity: String(form.get("quantity") ?? ""),
      message: String(form.get("message") ?? ""),
      product_name: productName ?? String(form.get("product_name") ?? ""),
      product_id: productId ?? null,
    };

    const parsed = inquirySchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <Field label="Full name" name="full_name" error={errors["full_name"]} required />
      <Field label="Company" name="company" error={errors["company"]} />
      <Field label="Email" name="email" type="email" error={errors["email"]} required />
      <Field label="Phone" name="phone" error={errors["phone"]} />
      <Field label="WhatsApp" name="whatsapp" error={errors["whatsapp"]} />
      <Field label="Country" name="country" error={errors["country"]} />
      {productName ? null : <Field label="Product of interest" name="product_name" />}
      <Field label="Quantity" name="quantity" placeholder="e.g. 500 pieces" error={errors["quantity"]} />

      <div className="sm:col-span-2">
        <Label
          htmlFor="message"
          className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground"
        >
          Message *
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          required
          placeholder="Fabric, colours, decoration, delivery destination and target dates."
          className="bg-background"
        />
        {errors["message"] ? <p className="mt-1.5 text-xs text-destructive">{errors["message"]}</p> : null}
      </div>

      {productName ? (
        <p className="sm:col-span-2 rounded-lg border border-border bg-elevated/60 px-3 py-2 text-xs text-muted-foreground">
          Product: <span className="text-foreground">{productName}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.01] disabled:opacity-70"
      >
        {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {mutation.isPending ? "Sending…" : "Submit inquiry"}
      </button>
    </form>
  );
}

export function InquiryDialog({
  trigger,
  productName,
  productId,
}: {
  trigger: ReactNode;
  productName?: string;
  productId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto border-border bg-popover">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Send an inquiry</DialogTitle>
          <DialogDescription>
            {productName
              ? `Tell us about your requirement for ${productName} and we will reply with specs and pricing.`
              : "Share your requirement and our export team will respond with specs and pricing."}
          </DialogDescription>
        </DialogHeader>

        <InquiryForm productName={productName} productId={productId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}


function Field({
  label,
  name,
  type = "text",
  error,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string | undefined;
  required?: boolean;
  placeholder?: string | undefined;
}) {
  return (
    <div>
      <Label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground"
      >
        {label} {required ? "*" : ""}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={200}
        className="bg-background"
      />
      {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
