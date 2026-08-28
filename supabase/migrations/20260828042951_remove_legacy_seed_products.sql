-- Keep the curated catalog added on 2026-08-26 and remove the original
-- generic seed batch. Recommendations retain their own names and URLs.
delete from public.products
where asin in (
  'B0BSHF7WHW',
  'B0BXYZ1234',
  'B07PXGQC1Q',
  'B0DEFG5678',
  'B08N5WRWNW',
  'B07VTGM3PQ',
  'B0CCZ1L48Q',
  'B0CABC1234',
  'B0BQ8MKXJ7',
  'B07YTHLPF8',
  'B0LMNO3456',
  'B08H75RTZ8',
  'B09JQMJHXY',
  'B08PP5MSVB',
  'B0HIJK9012'
);
