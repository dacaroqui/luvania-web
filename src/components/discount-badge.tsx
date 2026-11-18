export function DiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="discount-badge" aria-label={`${percent} por ciento de descuento sobre el precio anterior`}>
      -{percent}%
    </span>
  );
}
