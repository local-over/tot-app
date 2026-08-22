export const runtime = 'edge';

export async function hashId(userId, todayDate) {
  const data = userId + todayDate;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 36);
  } else {
    // fallback
    return 'fallback';
  }
}

hashId('heromoheromo1998@gmail.com', '2026-08-22').then(console.log);
