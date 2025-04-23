-- Add first_name and last_name columns
ALTER TABLE profiles
ADD COLUMN first_name text,
ADD COLUMN last_name text;

-- Split existing full_name data into first_name and last_name
UPDATE profiles
SET
  first_name = SPLIT_PART(full_name, ' ', 1),
  last_name = SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
WHERE full_name IS NOT NULL;

-- Make first_name and last_name not null for future entries
ALTER TABLE profiles
ALTER COLUMN first_name SET DEFAULT '',
ALTER COLUMN last_name SET DEFAULT '';

-- We'll keep full_name temporarily for backward compatibility
-- After confirming everything works, you can run:
-- ALTER TABLE profiles DROP COLUMN full_name; 