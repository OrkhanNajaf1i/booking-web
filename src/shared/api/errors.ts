/**
 * Xəta mətninin çıxarılması.
 *
 * `apiClient` interceptor-u xətaları `AppError` formasına salır
 * (`{message, code, status}`), lakin token refresh axınında xam axios
 * xətası da keçə bilir. İki formanın hansı gəldiyindən asılı olmayaraq
 * istifadəçi əsl səbəbi görməlidir — əks halda hər xəta "əməliyyat
 * mümkün olmadı" kimi görünür və problemi tapmaq mümkün olmur.
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback;

  const candidate = error as {
    response?: { data?: { message?: unknown } };
    message?: unknown;
  };

  // Xam axios xətası — serverin cavabı içəridədir.
  const fromResponse = candidate.response?.data?.message;
  if (typeof fromResponse === 'string' && fromResponse.trim()) {
    return fromResponse;
  }

  // Normallaşdırılmış AppError.
  const fromMessage = candidate.message;
  if (typeof fromMessage === 'string' && fromMessage.trim()) {
    // Axios-un öz texniki mətnini istifadəçiyə göstərmirik.
    if (/^Request failed with status code/i.test(fromMessage)) return fallback;
    return fromMessage;
  }

  return fallback;
}

/** Xəta kodunu qaytarır (varsa) — şərti davranış üçün. */
export function extractErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;

  const candidate = error as {
    code?: unknown;
    response?: { data?: { code?: unknown } };
  };

  const code = candidate.code ?? candidate.response?.data?.code;
  return typeof code === 'string' ? code : undefined;
}
