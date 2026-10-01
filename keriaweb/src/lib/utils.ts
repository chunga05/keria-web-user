import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  
  const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!r2Url) return path;

  // Chuyển đổi Supabase Storage URL thành R2 URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && path.startsWith(supabaseUrl)) {
    // Supabase URL có dạng: https://.../storage/v1/object/public/bucket_name/path/to/file
    // Chúng ta sẽ lấy phần "/path/to/file" sau tên bucket (ví dụ bucket_name="dkvn")
    const bucketName = process.env.R2_BUCKET_NAME || "dkvn";
    const publicPathStr = `/storage/v1/object/public/${bucketName}/`;
    
    const index = path.indexOf(publicPathStr);
    if (index !== -1) {
      const relativePath = path.substring(index + publicPathStr.length);
      return `${r2Url.replace(/\/$/, '')}/${relativePath}`;
    }
  }

  // Return the original path for local files or other domains
  return path;
}
