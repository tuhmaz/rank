import { NextResponse } from 'next/server';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const base = API_CONFIG.BASE_URL;
    const hasApi = /\/api\/?$/.test(base);
    const primaryBase = hasApi ? base.replace(/\/api\/?$/, '') : base;
    const altBase = hasApi ? base : `${base}/api`;

    const url1 = `${primaryBase}${API_ENDPOINTS.UPLOAD.IMAGE}`;
    let r = await fetch(url1, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    let data: any = null;
    try {
      data = await r.json();
    } catch {}

    if (!r.ok) {
      const url2 = `${altBase}${API_ENDPOINTS.UPLOAD.IMAGE}`;
      r = await fetch(url2, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      try {
        data = await r.json();
      } catch {}
      if (!r.ok) {
        return NextResponse.json(
          { message: (data && data.message) || 'حدث خطأ ما', errors: data ? data.errors : null },
          { status: r.status }
        );
      }
    }

    return NextResponse.json(data ?? { success: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: 'خطأ في الاتصال بالخادم' }, { status: 500 });
  }
}
