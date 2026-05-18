type DemoCredential = { email: string; password: string };

function parseDemoCredentials(): DemoCredential[] {
  const raw = import.meta.env.VITE_DEMO_CREDENTIALS ?? '';
  if (!raw.trim()) return [];

  return raw
    .split(',')
    .map((pair) => {
      const [email, password] = pair.split(':');
      return {
        email: email?.trim() ?? '',
        password: password?.trim() ?? '',
      };
    })
    .filter((c) => c.email && c.password);
}

export function isValidDemoEmailLogin(email: string, password: string): boolean {
  const credentials = parseDemoCredentials();
  if (credentials.length === 0) return false;
  return credentials.some((c) => c.email === email && c.password === password);
}

export function isValidDemoPhone(phone: string): boolean {
  const demoPhone = import.meta.env.VITE_DEMO_PHONE?.trim();
  if (!demoPhone) return false;
  return phone === demoPhone;
}
