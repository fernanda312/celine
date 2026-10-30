// Trusted price list (MT), mirrored from js/catalog.js and the seed.
// The server NEVER trusts a price or a total sent by the browser.
// Unpriced products (p01–p10) are absent here on purpose: they cannot be
// paid online, and any attempt to pay for one is rejected with 400.
export const TRUSTED_PRICES: Record<string, number> = {
  n01: 3500,
  n02: 1200,
  n03: 1450,
  n04: 950,
  n05: 1350,
  n06: 1100,
  n07: 1250,
  n08: 1600,
  n09: 1050,
  n10: 1300,
  n11: 1750,
  n12: 1400,
  n15: 4800,
  n16: 2900,
};

// Display names, so server-written order items keep the real product name
// (the browser-sent name is never trusted for price, but the name itself
// is only used for display in the order and receipt).
export const PRODUCT_NAMES: Record<string, string> = {
  n01: "Conjunto completo",
  n02: "Argolas acrílico",
  n03: "Retangulares verde mármore",
  n04: "Redondos verde com brilho",
  n05: "Folha tartaruga",
  n06: "Gota verde-menta",
  n07: "Semicírculo aqua",
  n08: "Brancos com dourado",
  n09: "Disco transparente",
  n10: "Argolas verde mármore",
  n11: "Disco dourado com turquesa",
  n12: "Pretos com pérola",
  n15: "Conjunto rubi",
  n16: "Conjunto gota dourada",
};

export function recalculateTotal(
  items: Array<{ id?: string; product_id?: string; qty: number }>,
): { total: number; lines: Array<{ product_id: string; qty: number; unit_price_mt: number }> } {
  const lines = items.map((item) => {
    const productId = item.product_id ?? item.id ?? "";
    const price = TRUSTED_PRICES[productId];
    if (price === undefined) {
      throw new Error(
        `Product ${productId} has no online price and cannot be paid online.`,
      );
    }
    const qty = Math.floor(Number(item.qty));
    if (!Number.isFinite(qty) || qty < 1) throw new Error("Invalid quantity.");
    return { product_id: productId, qty, unit_price_mt: price };
  });
  const total = lines.reduce((sum, l) => sum + l.unit_price_mt * l.qty, 0);
  return { total, lines };
}
