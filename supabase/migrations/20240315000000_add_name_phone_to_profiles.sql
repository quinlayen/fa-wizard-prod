-- Add full_name and phone columns to profiles table
ALTER TABLE profiles
ADD COLUMN full_name text,
ADD COLUMN phone text; 