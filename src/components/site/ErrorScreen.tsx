import { Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect } from "react";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/whatsapp";

type ErrorScreenProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  /** Custom retry behaviour; defaults to re-running the failed route loader. */
  onRetry?: () => void;
};

export function ErrorScreen({
  title = "This page didn't load",
  message = "Something went wrong on our end. Try again in a moment, or reach us on WhatsApp and we'll help you directly.",
  retryLabel = "Try again",
  onRetry,
}: ErrorScreenProps) {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }
    router.invalidate();
  };

  return (
    <div className="flex min-h-[70vh] flex-1 items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md text-center">
        <img
          src="/brand/rare-signs-mark.png"
          alt="Rare Signs Apparel"
          className="mx-auto h-14 w-auto"
          loading="eager"
        />
        <p className="eyebrow mt-6">Something went wrong</p>
        <h1 className="display-lg mt-3">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {retryLabel}
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-surface"
          >
            Go home
          </Link>
        </div>
        <a
          href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}

/** Root route error boundary: reports the failure and shows the friendly screen. */
export function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <ErrorScreen
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}
