update public.products
set image_url = case asin
  when 'B0GTPY3Q3W' then 'https://m.media-amazon.com/images/I/51y1eVQ9qoL._SL1500_.jpg'
  when 'TIMY-SNAIL-MUCIN-EYE-CREAM' then 'https://thenimetyou.com/cdn/shop/files/00_1_1024x1024.jpg?v=1776173547'
  when 'SEPHORA-2752509' then 'https://cdn.shopify.com/s/files/1/0615/7785/5148/files/OLE_SILO_WITH_SMEAR_SWEET_MACARON_POUT_2000x2000_300DPI.jpg?v=1771314159'
  when 'SEPHORA-2648020' then 'https://www.makeupbymario.com/cdn/shop/products/MBM_Foundation_Brush.jpg?crop=center&height=480&v=1670600570&width=480'
  when 'CEREMONIA-GUAVA-LEAVE-IN' then 'https://ceremonia.com/cdn/shop/files/ceremonia-guava-leave-in-conditioner-deep-hydration-repair-cream-in-an-amber-pum-82tlod.webp?v=1783715395'
  when 'SEPHORA-2496982' then 'https://jvnhair.com/cdn/shop/products/jvn-styler-complete-air-dry-cream-styling-cream-for-curly-wavy-hair-jvn-complete-air-dry-cream-33250744205501.jpg?v=1752154194'
  when 'B0BZPHWN28' then 'https://m.media-amazon.com/images/I/71PkchmIt7L._AC_SL1500_.jpg'
  when 'B09TFQ6Z25' then 'https://m.media-amazon.com/images/I/81XkvSKLsnL._AC_SL1500_.jpg'
  when 'B0DLFDCLCT' then 'https://m.media-amazon.com/images/I/617t8fJT+9L._AC_SL1500_.jpg'
  when 'B08R5D61RF' then 'https://m.media-amazon.com/images/I/71OEwZV6qcL._AC_SL1500_.jpg'
  when 'B09LQJBCT7' then 'https://m.media-amazon.com/images/I/71axiGLkw1L._AC_SL1500_.jpg'
  else image_url
end
where asin in (
  'B0GTPY3Q3W',
  'TIMY-SNAIL-MUCIN-EYE-CREAM',
  'SEPHORA-2752509',
  'SEPHORA-2648020',
  'CEREMONIA-GUAVA-LEAVE-IN',
  'SEPHORA-2496982',
  'B0BZPHWN28',
  'B09TFQ6Z25',
  'B0DLFDCLCT',
  'B08R5D61RF',
  'B09LQJBCT7'
);
