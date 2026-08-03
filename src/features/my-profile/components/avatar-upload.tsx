'use client';

import { Camera, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUploadAvatarMutation } from '../hooks';

interface AvatarUploadProps {
  name: string;
  currentAvatarUrl?: string | null;
  onUploaded: (avatarKey: string) => void;
}

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  );
}

export function AvatarUpload({
  name,
  currentAvatarUrl,
  onUploaded,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadAvatarMutation();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (result) => onUploaded(result.key),
    });
  }

  return (
    <div className="relative inline-block">
      <Avatar size="lg" className="size-20">
        {currentAvatarUrl && <AvatarImage src={currentAvatarUrl} alt="" />}
        <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <button
        type="button"
        aria-label="Cambiar foto de perfil"
        disabled={uploadMutation.isPending}
        onClick={() => inputRef.current?.click()}
        className="bg-primary text-primary-foreground hover:bg-primary/80 absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full ring-2 ring-background disabled:opacity-50"
      >
        {uploadMutation.isPending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Camera className="size-3.5" aria-hidden="true" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        aria-label="Subir foto de perfil"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
}
