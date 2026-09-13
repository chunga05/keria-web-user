import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Không tìm thấy file tải lên!' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Chỉ chấp nhận file hình ảnh!' },
        { status: 400 }
      );
    }

    // Chuyển file thành Buffer để S3 SDK đẩy lên R2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split('.').pop() || 'jpg';
    const key = `proofs/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ success: true, publicUrl });
  } catch (err: any) {
    console.error('Lỗi upload R2 server-side:', err);
    return NextResponse.json(
      { error: err?.message || 'Lỗi xử lý tải ảnh trên máy chủ' },
      { status: 500 }
    );
  }
}