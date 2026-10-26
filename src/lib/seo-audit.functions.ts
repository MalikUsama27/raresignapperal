import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const findingSchema = z.object({
  title: z.string(),
  priority: z.enum(["critical", "high", "medium", "low"]),
  page: z.string().describe("Site path the fix applies to, e.g. /about, or 'sitewide'"),
  why: z.string().describe("Business/SEO impact in one or two sentences"),
  fix: z.string().describe("Concrete, page-specific fix: exact replacement title/meta/copy/markup where relevant"),
  effort: z.enum(["quick", "moderate", "involved"]),
});

const reportSchema = z.object({
  summary: z.string(),
  findings: z.array(findingSchema),
});

export type SeoAuditResult = z.infer<typeof reportSchema>;

const PAGES = [
  "/ (home)", "/products", "/products/$slug", "/category/$slug", "/about", "/manufacturing",
  "/customization", "/export-markets", "/contact", "/blog", "/blog/$slug",
];

export const analyzeSeoAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { report: string }) =>
    z.object({ report: z.string().trim().min(20).max(60000) }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ result: SeoAuditResult | null; error: string | null }> => {
    const { data: role } = await context.supabase
      .from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!role) throw new Error("Forbidden");

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { result: null, error: "AI is not configured." };

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText, Output } = await import("ai");
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    try {
      const result = streamText({
        model: provider.responses("openai/gpt-6-astra"),
        maxRetries: 0,
        output: Output.object({ schema: reportSchema }),
        instructions:
          "You are a senior technical SEO consultant for Rare Signs Apparel, a B2B sportswear manufacturer and exporter (teams, wholesalers, private label). " +
          `The site's pages are: ${PAGES.join(", ")}. ` +
          "Given an SEO audit report, deduplicate the findings, prioritize them by impact on B2B organic leads, map each to the specific page, " +
          "and draft a concrete fix (ready-to-paste titles under 60 chars, meta descriptions under 160 chars, schema snippets, copy). Order findings from highest to lowest priority.",
        messages: [{ role: "user", content: data.report }],
        providerOptions: {
          openai: {
            forceReasoning: true,
            reasoningEffort: "medium",
            reasoningSummary: "auto",
            store: false,
            include: ["reasoning.encrypted_content"],
          },
        },
      });
      const output = await result.output;
      return { result: output, error: null };
    } catch (err: any) {
      const status = err?.statusCode ?? err?.status;
      console.error("SEO audit AI error", status, err?.message);
      if (status === 429) return { result: null, error: "Too many requests — please try again in a minute." };
      if (status === 402) return { result: null, error: "AI credits are exhausted. Top up in Settings → Plans & credits." };
      if (status === 403) return { result: null, error: "AI access is blocked for this workspace." };
      return { result: null, error: "The analysis could not be completed. Please try again." };
    }
  });
