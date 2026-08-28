-- Seed sample products. ASINs are plausible placeholders.

insert into public.products (asin, name, category, archetype_tags, budget_tier, image_url, amazon_url) values
  ('B07PXGQC1Q', 'Cozy Weighted Blanket 15lb', 'Home', '{Homebody}', 'mid', null, 'https://www.amazon.com/dp/B07PXGQC1Q?tag=emptyhanded-20'),
  ('B08N5WRWNW', 'Echo Dot (5th Gen) Smart Speaker', 'Tech', '{Tech Person,Homebody}', 'low', null, 'https://www.amazon.com/dp/B08N5WRWNW?tag=emptyhanded-20'),
  ('B0CCZ1L48Q', 'Kindle Paperwhite (16 GB)', 'Reading', '{Reader}', 'mid', null, 'https://www.amazon.com/dp/B0CCZ1L48Q?tag=emptyhanded-20'),
  ('B0BXYZ1234', 'Artisan Olive Oil Tasting Set', 'Food', '{Foodie}', 'mid', null, 'https://www.amazon.com/dp/B0BXYZ1234?tag=emptyhanded-20'),
  ('B09JQMJHXY', 'Stanley Quencher 40oz Tumbler', 'Outdoor', '{Outdoorsy,Fitness Person}', 'low', null, 'https://www.amazon.com/dp/B09JQMJHXY?tag=emptyhanded-20'),
  ('B07VTGM3PQ', 'Hydro Flask 32oz Wide Mouth', 'Outdoor', '{Outdoorsy,Fitness Person}', 'low', null, 'https://www.amazon.com/dp/B07VTGM3PQ?tag=emptyhanded-20'),
  ('B0BSHF7WHW', 'Apple AirTag 4-Pack', 'Tech', '{Tech Person}', 'low', null, 'https://www.amazon.com/dp/B0BSHF7WHW?tag=emptyhanded-20'),
  ('B08PP5MSVB', 'Theragun Mini Massager', 'Fitness', '{Fitness Person}', 'mid', null, 'https://www.amazon.com/dp/B08PP5MSVB?tag=emptyhanded-20'),
  ('B0BQ8MKXJ7', 'Lego Botanical Wildflower Bouquet', 'Creative', '{Creative,Homebody}', 'mid', null, 'https://www.amazon.com/dp/B0BQ8MKXJ7?tag=emptyhanded-20'),
  ('B07YTHLPF8', 'Moleskine Classic Notebook Large', 'Creative', '{Creative,Reader}', 'low', null, 'https://www.amazon.com/dp/B07YTHLPF8?tag=emptyhanded-20'),
  ('B08H75RTZ8', 'Sony WH-1000XM5 Headphones', 'Tech', '{Tech Person,Luxury Seeker}', 'high', null, 'https://www.amazon.com/dp/B08H75RTZ8?tag=emptyhanded-20'),
  ('B0CABC1234', 'Le Creuset Signature Dutch Oven', 'Food', '{Foodie,Luxury Seeker,Homebody}', 'high', null, 'https://www.amazon.com/dp/B0CABC1234?tag=emptyhanded-20'),
  ('B0DEFG5678', 'Diptyque Baies Candle', 'Home', '{Luxury Seeker,Homebody}', 'high', null, 'https://www.amazon.com/dp/B0DEFG5678?tag=emptyhanded-20'),
  ('B0HIJK9012', 'Yeti Rambler 20oz with Magslider', 'Outdoor', '{Outdoorsy}', 'low', null, 'https://www.amazon.com/dp/B0HIJK9012?tag=emptyhanded-20'),
  ('B0LMNO3456', 'Procreate Paint Set on iPad Companion Stylus', 'Creative', '{Creative,Tech Person}', 'mid', null, 'https://www.amazon.com/dp/B0LMNO3456?tag=emptyhanded-20')
on conflict (asin) do nothing;
