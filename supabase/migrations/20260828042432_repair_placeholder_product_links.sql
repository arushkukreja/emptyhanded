update public.products
set amazon_url = case asin
  when 'B0BXYZ1234' then 'https://www.amazon.com/s?k=Artisan%20Olive%20Oil%20Tasting%20Set&tag=emptyhanded-20'
  when 'B0CABC1234' then 'https://www.amazon.com/s?k=Le%20Creuset%20Signature%20Dutch%20Oven&tag=emptyhanded-20'
  when 'B0DEFG5678' then 'https://www.amazon.com/s?k=Diptyque%20Baies%20Candle&tag=emptyhanded-20'
  when 'B0HIJK9012' then 'https://www.amazon.com/s?k=Yeti%20Rambler%2020oz%20with%20Magslider&tag=emptyhanded-20'
  when 'B0LMNO3456' then 'https://www.amazon.com/s?k=Procreate%20Paint%20Set%20on%20iPad%20Companion%20Stylus&tag=emptyhanded-20'
  else amazon_url
end
where asin in ('B0BXYZ1234', 'B0CABC1234', 'B0DEFG5678', 'B0HIJK9012', 'B0LMNO3456');

update public.recommendations
set amazon_url = case asin
  when 'B0BXYZ1234' then 'https://www.amazon.com/s?k=Artisan%20Olive%20Oil%20Tasting%20Set&tag=emptyhanded-20'
  when 'B0CABC1234' then 'https://www.amazon.com/s?k=Le%20Creuset%20Signature%20Dutch%20Oven&tag=emptyhanded-20'
  when 'B0DEFG5678' then 'https://www.amazon.com/s?k=Diptyque%20Baies%20Candle&tag=emptyhanded-20'
  when 'B0HIJK9012' then 'https://www.amazon.com/s?k=Yeti%20Rambler%2020oz%20with%20Magslider&tag=emptyhanded-20'
  when 'B0LMNO3456' then 'https://www.amazon.com/s?k=Procreate%20Paint%20Set%20on%20iPad%20Companion%20Stylus&tag=emptyhanded-20'
  else amazon_url
end
where asin in ('B0BXYZ1234', 'B0CABC1234', 'B0DEFG5678', 'B0HIJK9012', 'B0LMNO3456');
