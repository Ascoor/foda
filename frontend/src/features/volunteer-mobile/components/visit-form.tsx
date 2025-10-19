import { FormEvent, useMemo, useState } from "react";

import type { VisitSubmission } from "../hooks/use-volunteer-tasks";

interface VisitFormProps {
  taskId: string;
  disabled?: boolean;
  onSubmit: (taskId: string, payload: VisitSubmission) => Promise<void>;
}

interface PendingFile {
  id: string;
  file: File;
  preview: string;
}

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const VisitForm = ({ taskId, onSubmit, disabled }: VisitFormProps) => {
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasAttachments = pendingFiles.length > 0;

  const attachmentSummary = useMemo(
    () =>
      pendingFiles.map((item) => ({
        id: item.id,
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
      })),
    [pendingFiles],
  );

  const handleFileChange = async (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    if (!input.files?.length) return;

    const nextFiles = await Promise.all(
      Array.from(input.files).map(async (file) => ({
        id: crypto.randomUUID(),
        file,
        preview: await readFileAsDataUrl(file),
      })),
    );

    setPendingFiles((previous) => [...previous, ...nextFiles]);
    input.value = "";
  };

  const handleRemove = (id: string) => {
    setPendingFiles((previous) => previous.filter((item) => item.id !== id));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const attachments = await Promise.all(
        pendingFiles.map(async (item) => ({
          id: item.id,
          name: item.file.name,
          type: item.file.type,
          size: item.file.size,
          dataUrl: item.preview,
        })),
      );

      await onSubmit(taskId, {
        notes,
        followUpDate: followUpDate || undefined,
        attachments,
      });

      setNotes("");
      setFollowUpDate("");
      setPendingFiles([]);
      setSuccess(true);
    } catch (submissionError) {
      console.error(submissionError);
      setError("تعذر حفظ الزيارة. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-black/20 p-4 shadow-inner"
    >
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white/80">
          ملاحظات الزيارة
        </label>
        <textarea
          className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white/90 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="سجل انطباعاتك وأهم النقاط من الزيارة"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white/80">
          موعد المتابعة
        </label>
        <input
          type="datetime-local"
          className="w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white/90 outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          value={followUpDate}
          onChange={(event) => setFollowUpDate(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white/80">
          صور أو مرفقات
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-black/20 p-4 text-center text-sm text-white/70 transition hover:border-primary hover:text-white">
          <span>أضف صورًا أو مستندات داعمة</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {hasAttachments && (
          <ul className="grid gap-2 text-xs text-white/80">
            {attachmentSummary.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center justify-between rounded-xl bg-black/30 px-3 py-2"
              >
                <div className="flex flex-col">
                  <span>{attachment.name}</span>
                  <span className="text-white/50">
                    {(attachment.size / 1024).toFixed(1)} كيلوبايت
                  </span>
                </div>
                <button
                  type="button"
                  className="text-rose-300 hover:text-rose-200"
                  onClick={() => handleRemove(attachment.id)}
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-300">
          تم حفظ الزيارة! ستتم المزامنة عند توفر الإنترنت.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full rounded-2xl bg-gradient-to-r from-primary/80 via-secondary/80 to-accent/80 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "جارٍ الحفظ..." : "حفظ الزيارة"}
      </button>
    </form>
  );
};
