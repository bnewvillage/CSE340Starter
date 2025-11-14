--4. UPDATE GM Hummer
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE inv_id = 10;

--6. Update all recrods /vehicles
UPDATE public.inventory
SET inv_image = REPLACE(inv_image,'/images/','/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail,'/images/','/images/vehicles/');