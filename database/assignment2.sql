INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronm@n'); 

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1; 

DELETE FROM public.account WHERE account_id = 1; 

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer'; 

SELECT inv_make AS "Make", inv_model AS "Model", classification_name AS "Vehicle Type"
FROM public.inventory AS a INNER JOIN public.classification AS b 
ON a.classification_id = b.classification_id; 

UPDATE public.inventory 
SET 
	inv_image= REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail= REPLACE(inv_thumbnail, '/images', '/images/vehicles');