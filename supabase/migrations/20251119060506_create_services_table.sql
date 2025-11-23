/*
  # Create services table

  1. New Tables
    - `services`
      - `id` (bigint, primary key, auto-increment)
      - `name` (text, required)
      - `description` (text)
      - `price` (text)
      - `duration` (text)
      - `image` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `services` table
    - Add policy for unauthenticated users to read services
    - Add policy for authenticated users to manage services
*/

CREATE TABLE IF NOT EXISTS services (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text,
  price text,
  duration text,
  image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are readable by everyone"
  ON services FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);
