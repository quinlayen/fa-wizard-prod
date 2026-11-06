-- Add full_name and phone columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS phone text;
