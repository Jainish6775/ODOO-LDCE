-- ============================================
-- GlobeTrotter Sample Data (Seed) - PostgreSQL
-- ============================================

-- Clear existing data
TRUNCATE TABLE expenses, transports, accommodations, scheduled_activities, trip_stops, trips, activities, destinations, travel_interests, users RESTART IDENTITY CASCADE;

-- ============================================
-- Destinations
-- ============================================
INSERT INTO destinations (id, name, country, region, description, image_url, cost_level, popularity_score, recommended_days, latitude, longitude) VALUES
(1, 'Paris', 'France', 'Europe', 'The City of Light, famous for its cafe culture, fashion, and iconic landmarks like the Eiffel Tower.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000', 'moderate', 98, 4, 48.8566, 2.3522),
(2, 'Tokyo', 'Japan', 'Asia', 'A bustling metropolis mixing the ultramodern and the traditional, from neon-lit skyscrapers to historic temples.', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1000', 'moderate', 96, 6, 35.6762, 139.6503),
(3, 'Rome', 'Italy', 'Europe', 'The Eternal City, a sprawling metropolis with nearly 3,000 years of globally influential art, architecture and culture.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1000', 'moderate', 95, 4, 41.9028, 12.4964),
(4, 'Bali', 'Indonesia', 'Asia', 'Known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000', 'budget', 94, 7, -8.4095, 115.1889),
(5, 'New York City', 'USA', 'North America', 'The city that never sleeps, known for its iconic skyline, Broadway, and diverse neighborhoods.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1000', 'luxury', 97, 5, 40.7128, -74.0060),
(6, 'Cape Town', 'South Africa', 'Africa', 'A port city on South Africa''s southwest coast, on a peninsula beneath the imposing Table Mountain.', 'https://images.unsplash.com/photo-1580060839134-77621285223c?auto=format&fit=crop&q=80&w=1000', 'moderate', 90, 5, -33.9249, 18.4241),
(7, 'Rio de Janeiro', 'Brazil', 'South America', 'Famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and Sugarloaf Mountain.', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=1000', 'moderate', 91, 5, -22.9068, -43.1729),
(8, 'Sydney', 'Australia', 'Oceania', 'Best known for its harbourfront Sydney Opera House, with a distinctive sail-like design.', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1000', 'luxury', 93, 6, -33.8688, 151.2093),
(9, 'Kyoto', 'Japan', 'Asia', 'Once the capital of Japan, famous for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000', 'moderate', 94, 4, 35.0116, 135.7681),
(10, 'Barcelona', 'Spain', 'Europe', 'The cosmopolitan capital of Spain''s Catalonia region, known for its art and architecture.', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=1000', 'moderate', 95, 4, 41.3851, 2.1734);

-- Reset the sequence to continue after our manually set IDs
SELECT setval('destinations_id_seq', (SELECT MAX(id) FROM destinations));

-- ============================================
-- Activities
-- ============================================
INSERT INTO activities (id, destination_id, name, description, category, duration_hours, estimated_cost, rating, image_url) VALUES
(1, 1, 'Eiffel Tower Summit Tour', 'Skip the line and take the elevator to the summit for breathtaking views of Paris.', 'Sightseeing', 2.5, 35.00, 4.8, 'https://images.unsplash.com/photo-1543305113-2d2c1c1103c6?auto=format&fit=crop&q=80&w=1000'),
(2, 1, 'Louvre Museum Guided Tour', 'Explore the world''s largest art museum with an expert guide.', 'Culture', 3.0, 45.00, 4.7, 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=1000'),
(3, 1, 'Seine River Dinner Cruise', 'Enjoy a romantic dinner on a glass-enclosed boat gliding past illuminated monuments.', 'Food & Drink', 2.5, 95.00, 4.6, 'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?auto=format&fit=crop&q=80&w=1000'),
(4, 2, 'Tsukiji Outer Market Food Tour', 'Taste your way through Tokyo''s famous seafood and street food market.', 'Food & Drink', 3.0, 65.00, 4.9, 'https://images.unsplash.com/photo-1546195643-70f48f9c5b87?auto=format&fit=crop&q=80&w=1000'),
(5, 2, 'Shibuya Crossing & Harajuku Walking Tour', 'Experience the organized chaos of Shibuya and the pop culture of Harajuku.', 'Culture', 3.5, 40.00, 4.7, 'https://images.unsplash.com/photo-1542051812871-75f56cacd34c?auto=format&fit=crop&q=80&w=1000'),
(6, 3, 'Colosseum, Roman Forum & Palatine Hill', 'Step back in time to Ancient Rome with skip-the-line access.', 'History', 3.0, 55.00, 4.8, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1000'),
(7, 3, 'Pasta & Tiramisu Making Class', 'Learn to make authentic Italian pasta and tiramisu from scratch.', 'Food & Drink', 2.5, 75.00, 4.9, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=1000'),
(8, 4, 'Ubud Monkey Forest & Rice Terraces Tour', 'Explore the sacred monkey forest and iconic Tegalalang rice terraces.', 'Nature', 6.0, 45.00, 4.6, 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=1000'),
(9, 4, 'Mount Batur Sunrise Trek', 'Hike up an active volcano to watch a spectacular sunrise over Bali.', 'Adventure', 8.0, 60.00, 4.8, 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=1000'),
(10, 5, 'Statue of Liberty & Ellis Island', 'Take the ferry to visit these iconic symbols of American freedom and immigration.', 'History', 4.0, 30.00, 4.7, 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&q=80&w=1000'),
(11, 5, 'Broadway Show Ticket', 'Experience the magic of live theater in Times Square.', 'Entertainment', 3.0, 150.00, 4.9, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86fee3?auto=format&fit=crop&q=80&w=1000');

-- Reset the sequence to continue after our manually set IDs
SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
