import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  adminDelete,
  adminList,
  adminReorder,
  adminSave,
  adminUploadImage,
  type AdminTable,
} from "@/lib/admin.functions";
import { slugify, type FieldDef, type ResourceDef } from "@/lib/admin.fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Row = Record<string, any>;

export function useAdminRows(table: AdminTable) {
  const list = useServerFn(adminList);
  return useQuery({
    queryKey: ["admin", table],
    queryFn: () => list({ data: { table } }),
  });
}

function refTableFor(refKey: NonNullable<FieldDef["refKey"]>): AdminTable {
  return refKey;
}

export function ResourceManager({ resource }: { resource: ResourceDef }) {
  const queryClient = useQueryClient();
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);
  const reorder = useServerFn(adminReorder);

  const rowsQuery = useAdminRows(resource.table);
  const refKeys = useMemo(
    () => Array.from(new Set(resource.fields.filter((f) => f.refKey).map((f) => f.refKey!))),
    [resource],
  );
  const categories = useAdminRows("categories");
  const subcategories = useAdminRows("subcategories");
  const blogCategories = useAdminRows("blog_categories");
  const refData: Record<string, Row[]> = {
    categories: refKeys.includes("categories") ? (categories.data ?? []) : [],
    subcategories: refKeys.includes("subcategories") ? (subcategories.data ?? []) : [],
    blog_categories: refKeys.includes("blog_categories") ? (blogCategories.data ?? []) : [],
  };

  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>({});
  const [search, setSearch] = useState("");

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", resource.table] });
    void queryClient.invalidateQueries({ queryKey: ["navigation"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const values = serialize(form, resource.fields);
      return save({ data: { table: resource.table, id: editing?.["id"], values } });
    },
    onSuccess: () => {
      toast.success(`${resource.title.replace(/s$/, "")} saved`);
      setEditing(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Could not save"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => remove({ data: { table: resource.table, id } }),
    onSuccess: () => {
      toast.success("Deleted");
      setDeleting(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Could not delete"),
  });

  const rows = (rowsQuery.data ?? []).filter((row) => {
    if (!search.trim()) return true;
    return JSON.stringify(row).toLowerCase().includes(search.trim().toLowerCase());
  });

  function openCreate() {
    const base: Row = { ...(resource.defaults ?? {}) };
    for (const field of resource.fields) if (!(field.name in base)) base[field.name] = field.type === "boolean" ? false : "";
    setForm(base);
    setEditing({});
  }

  function openEdit(row: Row) {
    const base: Row = {};
    for (const field of resource.fields) base[field.name] = deserialize(row[field.name], field);
    setForm(base);
    setEditing(row);
  }

  async function move(row: Row, direction: -1 | 1) {
    const ordered = [...(rowsQuery.data ?? [])];
    const index = ordered.findIndex((item) => item["id"] === row["id"]);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) return;
    const swapped = ordered[target]!;
    await reorder({
      data: {
        table: resource.table,
        items: [
          { id: String(row["id"]), sort_order: Number(swapped["sort_order"] ?? target) },
          { id: String(swapped["id"]), sort_order: Number(row["sort_order"] ?? index) },
        ],
      },
    });
    invalidate();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{resource.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{resource.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search…"
            className="h-9 w-44"
          />
          <Button onClick={openCreate} size="sm">
            <Plus className="size-4" /> New
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-elevated/60 text-left">
              <tr>
                {resource.columns.map((column) => (
                  <th key={column.name} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rowsQuery.isLoading ? (
                <tr>
                  <td colSpan={resource.columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={resource.columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                    Nothing here yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={String(row["id"])} className="border-b border-border/60 last:border-0 hover:bg-elevated/40">
                    {resource.columns.map((column) => (
                      <td key={column.name} className="max-w-[22rem] truncate px-4 py-3">
                        {renderCell(row[column.name], column.name, refData)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {resource.sortable ? (
                          <>
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => void move(row, -1)} aria-label="Move up">
                              <ArrowUp className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => void move(row, 1)} aria-label="Move down">
                              <ArrowDown className="size-4" />
                            </Button>
                          </>
                        ) : null}
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(row)} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setDeleting(row)} aria-label="Delete">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.["id"] ? "Edit" : "New"} {resource.title.replace(/s$/, "").toLowerCase()}
            </DialogTitle>
            <DialogDescription>{resource.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {resource.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={form[field.name]}
                form={form}
                refData={refData}
                onChange={(value) => setForm((current) => ({ ...current, [field.name]: value }))}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes it from the website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && deleteMutation.mutate(String(deleting["id"]))}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function renderCell(value: unknown, name: string, refData: Record<string, Row[]>) {
  if (name.endsWith("_id")) {
    const pool = [...(refData["categories"] ?? []), ...(refData["subcategories"] ?? []), ...(refData["blog_categories"] ?? [])];
    const match = pool.find((row) => row["id"] === value);
    return match ? String(match["name"]) : "—";
  }
  if (typeof value === "boolean") {
    return <Badge variant={value ? "default" : "outline"}>{value ? "Yes" : "No"}</Badge>;
  }
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return value.slice(0, 10);
  return String(value);
}

function FieldInput({
  field,
  value,
  form,
  refData,
  onChange,
}: {
  field: FieldDef;
  value: any;
  form: Row;
  refData: Record<string, Row[]>;
  onChange: (value: any) => void;
}) {
  const upload = useServerFn(adminUploadImage);
  const [uploading, setUploading] = useState(false);
  const wrapperClass = field.full || field.type === "markdown" ? "sm:col-span-2" : "";

  const label = (
    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{field.label}</Label>
  );

  if (field.type === "boolean") {
    return (
      <div className={`flex items-center justify-between rounded-lg border border-border bg-elevated/40 px-4 py-3 ${wrapperClass}`}>
        {label}
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }

  if (field.type === "ref") {
    const options = (refData[refTableFor(field.refKey!)] ?? []).filter((row) => {
      if (field.refKey !== "subcategories") return true;
      if (!form["category_id"]) return true;
      return row["category_id"] === form["category_id"];
    });
    return (
      <div className={`space-y-1.5 ${wrapperClass}`}>
        {label}
        <select
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value || null)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">— none —</option>
          {options.map((option) => (
            <option key={String(option["id"])} value={String(option["id"])}>
              {String(option["name"])}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea" || field.type === "markdown" || field.type === "json") {
    return (
      <div className={`space-y-1.5 ${wrapperClass}`}>
        {label}
        <Textarea
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          rows={field.type === "markdown" ? 14 : 3}
          className="font-normal"
        />
        {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
      </div>
    );
  }

  if (field.type === "image") {
    async function onFile(file: File) {
      setUploading(true);
      try {
        const buffer = await file.arrayBuffer();
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
        const result = await upload({
          data: { fileName: file.name, contentType: file.type, base64: btoa(binary) },
        });
        onChange(result.url);
        toast.success("Image uploaded");
      } catch (error) {
        toast.error((error as Error).message || "Upload failed");
      } finally {
        setUploading(false);
      }
    }

    return (
      <div className={`space-y-2 ${wrapperClass}`}>
        {label}
        <div className="flex flex-wrap items-center gap-3">
          {value ? (
            <img src={String(value)} alt="" className="size-16 rounded-md border border-border object-cover" />
          ) : null}
          <Input value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder="/images/... or https://..." className="flex-1 min-w-[14rem]" />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:border-primary/50">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onFile(file);
              }}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-1.5 ${wrapperClass}`}>
      {label}
      <Input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          if (field.type === "slug" && !value) {
            const source = form["name"] ?? form["title"] ?? form["question"] ?? "";
            if (source) onChange(slugify(String(source)));
          }
        }}
      />
      {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
    </div>
  );
}

function serialize(form: Row, fields: FieldDef[]) {
  const values: Row = {};
  for (const field of fields) {
    const raw = form[field.name];
    switch (field.type) {
      case "number":
        values[field.name] = raw === "" || raw === null ? 0 : Number(raw);
        break;
      case "boolean":
        values[field.name] = Boolean(raw);
        break;
      case "csv":
        values[field.name] = String(raw ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        break;
      case "json":
        try {
          values[field.name] = raw ? JSON.parse(String(raw)) : {};
        } catch {
          throw new Error(`${field.label} must be valid JSON`);
        }
        break;
      case "date":
        values[field.name] = raw ? new Date(String(raw)).toISOString() : null;
        break;
      case "slug":
        values[field.name] = slugify(String(raw ?? ""));
        break;
      default:
        values[field.name] = raw === "" ? (field.optional ? null : "") : (raw ?? null);
    }
  }
  return values;
}

function deserialize(value: any, field: FieldDef) {
  if (field.type === "csv") return Array.isArray(value) ? value.join(", ") : (value ?? "");
  if (field.type === "json") return value ? JSON.stringify(value, null, 2) : "";
  if (field.type === "date") return value ? String(value).slice(0, 10) : "";
  if (field.type === "boolean") return Boolean(value);
  return value ?? "";
}
