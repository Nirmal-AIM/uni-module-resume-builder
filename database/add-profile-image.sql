-- Add profile_image column to user_profiles table
-- This will store the base64 encoded profile photo

ALTER TABLE user_profiles 
ADD COLUMN profile_image LONGTEXT AFTER street_address;

-- Note: LONGTEXT can store up to 4GB, perfect for base64 images
