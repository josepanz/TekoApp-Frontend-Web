import type { CreatePromotionRequest, Promotion } from '../api';
import type { PromotionFormInput, PromotionFormValues } from '../schemas';

// Fechas: PromotionDetailResponseDTO/CreatePromotionRequestDTO usan ISO 8601 completo
// (2025-01-01T00:00:00Z), pero el form usa <input type="date"> (YYYY-MM-DD) — se convierte en
// los bordes del componente.
function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10);
}

function toIsoDateTime(dateInputValue: string): string {
  return new Date(dateInputValue).toISOString();
}

export function buildDefaultValues(promotion?: Promotion): PromotionFormInput {
  if (!promotion) {
    return {
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      discountValue: 0,
      minimumAmount: undefined,
      maximumDiscount: undefined,
      maxUsage: undefined,
      maxUsagePerUser: undefined,
      validFrom: '',
      validUntil: '',
      isFirstTimeOnly: false,
      isProfessionalOnly: false,
      isClientOnly: false,
    };
  }

  const discountValue =
    promotion.type === 'PERCENTAGE'
      ? (promotion.discountPercentage ?? 0)
      : promotion.type === 'FIXED_AMOUNT'
        ? (promotion.discountAmount ?? 0)
        : 0;

  return {
    code: promotion.code,
    name: promotion.name,
    description: promotion.description ?? '',
    type: promotion.type,
    discountValue,
    minimumAmount: promotion.minimumAmount,
    maximumDiscount: promotion.maximumDiscount,
    maxUsage: promotion.maxUsage === -1 ? undefined : promotion.maxUsage,
    maxUsagePerUser: promotion.maxUsagePerUser,
    validFrom: toDateInputValue(promotion.validFrom),
    validUntil: toDateInputValue(promotion.validUntil),
    // PromotionDetailResponseDTO no devuelve isFirstTimeOnly/isProfessionalOnly/isClientOnly (solo
    // el `allowedUserTypes` derivado) — al editar, estos switches arrancan en `false` y el usuario
    // los vuelve a marcar si corresponde; no hay forma de precargarlos desde la respuesta real.
    isFirstTimeOnly: false,
    isProfessionalOnly: false,
    isClientOnly: false,
  };
}

export function toCreatePromotionRequest(
  values: PromotionFormValues,
): CreatePromotionRequest {
  return {
    code: values.code,
    name: values.name,
    description: values.description || undefined,
    type: values.type,
    discountValue: values.discountValue,
    minimumAmount: values.minimumAmount,
    maximumDiscount: values.maximumDiscount,
    maxUsage: values.maxUsage,
    maxUsagePerUser: values.maxUsagePerUser,
    validFrom: toIsoDateTime(values.validFrom),
    validUntil: toIsoDateTime(values.validUntil),
    isFirstTimeOnly: values.isFirstTimeOnly,
    isProfessionalOnly: values.isProfessionalOnly,
    isClientOnly: values.isClientOnly,
  };
}
