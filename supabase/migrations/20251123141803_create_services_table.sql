/*
  # Create services table with category field

  1. New Tables
    - `services`
      - `id` (bigint, primary key, auto-increment)
      - `name` (text, required)
      - `description` (text)
      - `price` (text)
      - `duration` (text)
      - `image` (text)
      - `category` (text, default 'hair') - organizes services by type
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `services` table
    - Add policy for everyone to read services (public access)
    - Add policy for authenticated users to manage services

  3. Notes
    - Category field supports values: 'hair', 'nails', 'cosmetology', 'makeup'
    - Index added on category for optimal filtering performance
*/

CREATE TABLE IF NOT EXISTS services (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text DEFAULT 'New service',
  price text DEFAULT '₹0',
  duration text DEFAULT '30 min',
  image text DEFAULT '',
  category text DEFAULT 'hair',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

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
