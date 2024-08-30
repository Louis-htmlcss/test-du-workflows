export default async function downloadAsBase64 (url: string, headers?: Record<string, string>): Promise<string> {
  const response = await fetch(url, { headers });
  const blob = await response.blob();

  return new Promise<string>(resolve => {
    // Read as base64 URL.
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
  });
};
