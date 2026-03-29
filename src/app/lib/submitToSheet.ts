export async function submitToSheet(formData: Record<string, string>) {
  const webhookUrl = process.env.NEXT_PUBLIC_SHEET_WEBHOOK;

  // If no webhook configured or still placeholder, use mailto fallback
  if (!webhookUrl || webhookUrl.includes("YOUR_SCRIPT_ID")) {
    const body = Object.entries(formData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("%0A");
    window.location.href = `mailto:sales.dealsinfoxnut@gmail.com?subject=Enquiry%20from%20${encodeURIComponent(formData.name || "Website")}&body=${body}`;
    return { ok: true, fallback: true };
  }

  // Google Apps Script requires no-cors (response is opaque but request goes through)
  await fetch(webhookUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  // With no-cors the response is opaque — treat any non-throw as success
  return { ok: true };
}
