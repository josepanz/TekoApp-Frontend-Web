'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBrowseProfessionalsQuery } from '../hooks';

const PAGE_SIZE = 12;

export function BrowseProfessionalsList() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError } = useBrowseProfessionalsQuery({
    page,
    pageSize: PAGE_SIZE,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-muted-foreground">
        No se pudieron cargar los profesionales. Intentá recargar la página.
      </p>
    );
  }

  if (data.data.length === 0) {
    return (
      <p className="text-muted-foreground">
        No hay profesionales disponibles en este momento.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((professional) => (
          <Card key={professional.id}>
            <CardHeader>
              <CardTitle>
                {professional.user.firstName} {professional.user.lastName}
              </CardTitle>
              <CardDescription>{professional.category.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Badge>
                  ⭐ {Number(professional.averageRating).toFixed(1)}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {professional.totalRatings} reseñas
                </span>
              </div>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {professional.description}
              </p>
              <Button
                size="sm"
                render={
                  <Link href={`/profesionales/${professional.referenceId}`}>
                    Ver perfil
                  </Link>
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-muted-foreground text-sm">
            Página {data.pagination.page} de {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
