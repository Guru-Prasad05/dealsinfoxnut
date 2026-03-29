export async function submitToSheet(formData: Record<string, string>) {
  const webhookUrl = process.env.NEXT_PUBLIC_SHEET_WEBHOOK;
  if (!webhookUrl) throw new Error("Sheet webhook URL not configured");

  const res = await fetch(webhookUrl, {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Submission failed");
  return res.json();
}
