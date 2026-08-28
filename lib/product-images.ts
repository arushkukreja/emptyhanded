const PRODUCT_IMAGES = [
  { terms: ["journal", "notebook"], src: "/images/product-journal.jpg" },
  { terms: ["pour-over", "coffee", "ceramic"], src: "/images/product-coffee.jpg" },
  { terms: ["vinyl", "bill evans", "record"], src: "/images/product-vinyl.jpg" },
  { terms: ["serving board", "cutting board", "olive wood"], src: "/images/product-board.jpg" },
  { terms: ["baby blanket", "cashmere blanket", "nursery"], src: "/images/product-blanket.jpg" },
  { terms: ["wine rack", "wine"], src: "/images/product-wine.jpg" },
] as const;

export function getProductImage(productName: string) {
  const normalizedName = productName.toLowerCase();
  return PRODUCT_IMAGES.find(({ terms }) => terms.some(term => normalizedName.includes(term)))?.src ?? null;
}
