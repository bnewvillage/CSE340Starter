--WEEK 2 ACTIVITIES
--1. CREATE new account Tony Stark

INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

--2. UPDATE Tony account type to `Admin`
UPDATE public.account
SET account_type = 'Admin'::account_type
WHERE account_id = 1;

--3. DELETE TONY
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

--4. UPDATE GM Hummer
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE inv_id = 10;

--5. SELECT Sports vehicles by make and model
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification
	ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;

--6. Update all recrods /vehicles
UPDATE public.inventory
SET inv_image = REPLACE(inv_image,'/images/','/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail,'/images/','/images/vehicles/');