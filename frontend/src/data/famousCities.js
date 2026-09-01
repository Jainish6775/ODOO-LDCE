export const famousCitiesData = [
    {
      id: 1,
      name: 'Kyoto',
      country: 'Japan',
      region: 'Asia',
      popularity_score: 98,
      cost_level: 'Moderate',
      recommended_days: 5,
      image_url: '/images/region_asia_1787378514027.jpg',
      description: 'The cultural capital of Japan, famous for classical Buddhist temples, serene Zen gardens, imperial palaces, traditional wooden houses, and magical cherry blossom season in spring.',
      activities: [
        { id: 101, name: 'Fushimi Inari Shrine Hike', category: 'Cultural', rating: 4.9, duration_hours: 3, estimated_cost: 0 },
        { id: 102, name: 'Arashiyama Bamboo Grove Walk', category: 'Nature', rating: 4.8, duration_hours: 2, estimated_cost: 0 },
        { id: 103, name: 'Gion Geisha District Evening Tour', category: 'Historic', rating: 4.7, duration_hours: 3, estimated_cost: 45 },
        { id: 104, name: 'Kinkaku-ji Golden Pavilion Tour', category: 'Cultural', rating: 4.9, duration_hours: 2, estimated_cost: 10 }
      ]
    },
    {
      id: 2,
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      popularity_score: 99,
      cost_level: 'Luxury',
      recommended_days: 5,
      image_url: '/images/trip_paris_1787378563287.jpg',
      description: 'The City of Light, world-famous for art, fashion, gastronomy, the iconic Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and romance along the River Seine.',
      activities: [
        { id: 105, name: 'Eiffel Tower Summit Access', category: 'Sightseeing', rating: 4.9, duration_hours: 3, estimated_cost: 35 },
        { id: 106, name: 'Louvre Museum Guided Art Tour', category: 'Art & Culture', rating: 4.8, duration_hours: 4, estimated_cost: 65 },
        { id: 107, name: 'Seine River Sunset Dinner Cruise', category: 'Dining', rating: 4.9, duration_hours: 2.5, estimated_cost: 90 },
        { id: 108, name: 'Montmartre Sacré-Cœur Walking Tour', category: 'Historic', rating: 4.7, duration_hours: 3, estimated_cost: 25 }
      ]
    },
    {
      id: 3,
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      popularity_score: 99,
      cost_level: 'High',
      recommended_days: 7,
      image_url: '/images/trip_tokyo_1787378579161.jpg',
      description: 'Ultra-modern metropolis blending neon-lit skyscrapers, historic Shinto shrines, world-class Michelin dining, vibrant anime culture in Akihabara, and Mount Fuji day trips.',
      activities: [
        { id: 109, name: 'Shibuya Crossing & Harajuku Tour', category: 'City Walk', rating: 4.8, duration_hours: 3, estimated_cost: 20 },
        { id: 110, name: 'Mount Fuji & Lake Kawaguchiko Day Trip', category: 'Adventure', rating: 4.9, duration_hours: 9, estimated_cost: 110 },
        { id: 111, name: 'TeamLab Planets Immersive Art', category: 'Art', rating: 4.9, duration_hours: 3, estimated_cost: 38 },
        { id: 112, name: 'Tsukiji Outer Market Food Tasting', category: 'Culinary', rating: 4.8, duration_hours: 2.5, estimated_cost: 55 }
      ]
    },
    {
      id: 4,
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      popularity_score: 97,
      cost_level: 'Moderate',
      recommended_days: 4,
      image_url: '/images/dashboard_banner_1787378478140.jpg',
      description: 'The Eternal City, home to nearly 3,000 years of globally influential art, architecture, ancient Colosseum, Roman Forum, St. Peter Basilica, and Vatican Museums.',
      activities: [
        { id: 113, name: 'Colosseum Underground & Forum Tour', category: 'Historic', rating: 4.9, duration_hours: 3.5, estimated_cost: 65 },
        { id: 114, name: 'Vatican Museums & Sistine Chapel', category: 'Art & Culture', rating: 4.8, duration_hours: 4, estimated_cost: 75 },
        { id: 115, name: 'Trevi Fountain & Trastevere Food Tour', category: 'Culinary', rating: 4.8, duration_hours: 3, estimated_cost: 50 },
        { id: 116, name: 'Fresh Pasta & Gelato Cooking Class', category: 'Workshop', rating: 4.9, duration_hours: 3, estimated_cost: 70 }
      ]
    },
    {
      id: 5,
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      popularity_score: 96,
      cost_level: 'Budget',
      recommended_days: 7,
      image_url: '/images/trip_bali_1787378598373.jpg',
      description: 'Tropical paradise featuring lush rice terraces, sacred sea temples, volcanic mountains, serene wellness retreats, world-class surf breaks, and vibrant beach clubs.',
      activities: [
        { id: 117, name: 'Tegallalang Rice Terraces & Swing', category: 'Nature', rating: 4.8, duration_hours: 3, estimated_cost: 15 },
        { id: 118, name: 'Mount Batur Sunrise Volcano Trekking', category: 'Hiking', rating: 4.9, duration_hours: 6, estimated_cost: 45 },
        { id: 119, name: 'Tanah Lot Sea Temple Sunset', category: 'Cultural', rating: 4.7, duration_hours: 2, estimated_cost: 10 },
        { id: 120, name: 'Nusa Penida Island Speedboat Day Trip', category: 'Island Tour', rating: 4.8, duration_hours: 8, estimated_cost: 75 }
      ]
    },
    {
      id: 6,
      name: 'Santorini',
      country: 'Greece',
      region: 'Europe',
      popularity_score: 96,
      cost_level: 'Luxury',
      recommended_days: 4,
      image_url: '/images/region_europe_1787378498140.jpg',
      description: 'Iconic Cycladic island known for whitewashed houses with blue dome roofs perched high above the Aegean caldera, romantic sunsets in Oia, and volcanic red sand beaches.',
      activities: [
        { id: 121, name: 'Oia Sunset Catamaran Sailing Cruise', category: 'Sailing', rating: 4.9, duration_hours: 5, estimated_cost: 120 },
        { id: 122, name: 'Volcanic Winery Tasting Tour', category: 'Wine & Food', rating: 4.8, duration_hours: 3.5, estimated_cost: 85 },
        { id: 123, name: 'Red Beach & Akrotiri Ruins Exploration', category: 'Historic', rating: 4.7, duration_hours: 4, estimated_cost: 40 },
        { id: 124, name: 'Fira to Oia Cliffside Hike', category: 'Trekking', rating: 4.8, duration_hours: 3.5, estimated_cost: 0 }
      ]
    },
    {
      id: 7,
      name: 'Zermatt (Swiss Alps)',
      country: 'Switzerland',
      region: 'Europe',
      popularity_score: 98,
      cost_level: 'Luxury',
      recommended_days: 6,
      image_url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
      description: 'Breathtaking Alpine paradise dominated by the iconic pyramid-shaped Matterhorn peak, offering world-class skiing, scenic Glacier Express trains, and pristine mountain lakes.',
      activities: [
        { id: 125, name: 'Gornergrat Panoramic Railway Ride', category: 'Scenic Train', rating: 4.9, duration_hours: 4, estimated_cost: 95 },
        { id: 126, name: 'Matterhorn Skiing Pass', category: 'Skiing', rating: 4.9, duration_hours: 8, estimated_cost: 115 },
        { id: 127, name: 'Glacier Express Panoramic Train', category: 'Scenic', rating: 4.8, duration_hours: 6, estimated_cost: 160 },
        { id: 128, name: 'Lake Riffelsee Reflection Hike', category: 'Hiking', rating: 4.9, duration_hours: 3, estimated_cost: 0 }
      ]
    },
    {
      id: 8,
      name: 'Goa',
      country: 'India',
      region: 'Asia',
      popularity_score: 94,
      cost_level: 'Budget',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
      description: "India's coastal sun & sand capital, famous for golden palm-fringed beaches, Portuguese colonial heritage churches, vibrant night markets, spice plantations, and seafood.",
      activities: [
        { id: 129, name: 'Scuba Diving & Water Sports at Baga', category: 'Water Sports', rating: 4.8, duration_hours: 4, estimated_cost: 65 },
        { id: 130, name: 'Dudhsagar Waterfalls Jeep Safari', category: 'Adventure', rating: 4.9, duration_hours: 6, estimated_cost: 40 },
        { id: 131, name: 'Fontainhas Latin Quarter Heritage Walk', category: 'Heritage', rating: 4.7, duration_hours: 2.5, estimated_cost: 15 },
        { id: 132, name: 'Mandovi River Sunset Cruise', category: 'Cruise', rating: 4.7, duration_hours: 2, estimated_cost: 30 }
      ]
    },
    {
      id: 9,
      name: 'New York City',
      country: 'United States',
      region: 'North America',
      popularity_score: 98,
      cost_level: 'High',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      description: 'The Big Apple, an energetic global capital featuring Broadway theaters, Central Park, Times Square, Statue of Liberty, world-renowned museums, and skyline views.',
      activities: [
        { id: 133, name: 'Summit One Vanderbilt Deck', category: 'Sightseeing', rating: 4.9, duration_hours: 2, estimated_cost: 48 },
        { id: 134, name: 'Broadway Show Ticket', category: 'Entertainment', rating: 4.9, duration_hours: 3, estimated_cost: 120 },
        { id: 135, name: 'Central Park Bike Rental & Picnic', category: 'Parks', rating: 4.7, duration_hours: 3, estimated_cost: 30 },
        { id: 136, name: 'Metropolitan Museum of Art Tour', category: 'Art & Culture', rating: 4.8, duration_hours: 3, estimated_cost: 55 }
      ]
    },
    {
      id: 10,
      name: 'London',
      country: 'United Kingdom',
      region: 'Europe',
      popularity_score: 97,
      cost_level: 'High',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      description: 'Historic capital on the River Thames, combining Royal landmarks like Buckingham Palace and Tower Bridge with world-class museums, West End theaters, and rich culture.',
      activities: [
        { id: 137, name: 'Tower of London & Crown Jewels', category: 'Historic', rating: 4.8, duration_hours: 3, estimated_cost: 40 },
        { id: 138, name: 'London Eye Capsule Experience', category: 'Sightseeing', rating: 4.7, duration_hours: 1, estimated_cost: 38 },
        { id: 139, name: 'Westminster Abbey & Big Ben Walk', category: 'City Walk', rating: 4.8, duration_hours: 2.5, estimated_cost: 32 },
        { id: 140, name: 'Harry Potter Warner Bros Studio Tour', category: 'Entertainment', rating: 4.9, duration_hours: 5, estimated_cost: 95 }
      ]
    },
    {
      id: 11,
      name: 'Barcelona',
      country: 'Spain',
      region: 'Europe',
      popularity_score: 96,
      cost_level: 'Moderate',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80',
      description: "Vibrant Mediterranean seaside city famed for Antoni Gaudí's whimsical architecture like Sagrada Família and Park Güell, gothic quarters, tapas bars, and lively beaches.",
      activities: [
        { id: 141, name: 'Sagrada Família Fast-Track Tour', category: 'Architecture', rating: 4.9, duration_hours: 2, estimated_cost: 45 },
        { id: 142, name: 'Park Güell Skip-the-Line Entry', category: 'Art & Park', rating: 4.8, duration_hours: 2, estimated_cost: 22 },
        { id: 143, name: 'Tapas & Wine Tasting in Gothic Quarter', category: 'Culinary', rating: 4.8, duration_hours: 3, estimated_cost: 65 },
        { id: 144, name: 'Barceloneta Beach Sunset Walk', category: 'Beach', rating: 4.7, duration_hours: 2, estimated_cost: 0 }
      ]
    },
    {
      id: 12,
      name: 'Dubai',
      country: 'United Arab Emirates',
      region: 'Middle East',
      popularity_score: 97,
      cost_level: 'Luxury',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      description: "Futuristic desert oasis renowned for ultra-modern architecture, the world's tallest tower (Burj Khalifa), luxury shopping malls, artificial palm islands, and desert safaris.",
      activities: [
        { id: 145, name: 'Burj Khalifa 124th Floor View', category: 'Sightseeing', rating: 4.9, duration_hours: 2, estimated_cost: 52 },
        { id: 146, name: 'Red Dune Desert Safari & BBQ Dinner', category: 'Adventure', rating: 4.9, duration_hours: 6, estimated_cost: 75 },
        { id: 147, name: 'Dubai Marina Luxury Yacht Cruise', category: 'Cruise', rating: 4.8, duration_hours: 2, estimated_cost: 85 },
        { id: 148, name: 'Atlantis Aquaventure Waterpark', category: 'Theme Park', rating: 4.8, duration_hours: 5, estimated_cost: 90 }
      ]
    },
    {
      id: 13,
      name: 'Sydney',
      country: 'Australia',
      region: 'Oceania',
      popularity_score: 95,
      cost_level: 'High',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
      description: "Australia's harbor city, famous for the iconic Sydney Opera House, Sydney Harbour Bridge, pristine Bondi Beach surf, coastal cliffside walks, and royal botanic gardens.",
      activities: [
        { id: 149, name: 'Sydney Opera House Tour', category: 'Culture', rating: 4.9, duration_hours: 1.5, estimated_cost: 35 },
        { id: 150, name: 'Sydney Harbour BridgeClimb', category: 'Adventure', rating: 4.9, duration_hours: 3.5, estimated_cost: 240 },
        { id: 151, name: 'Bondi to Coogee Coastal Walk', category: 'Nature Walk', rating: 4.8, duration_hours: 3, estimated_cost: 0 },
        { id: 152, name: 'Taronga Zoo Harbour Pass', category: 'Wildlife', rating: 4.7, duration_hours: 4, estimated_cost: 42 }
      ]
    },
    {
      id: 14,
      name: 'Bangkok',
      country: 'Thailand',
      region: 'Asia',
      popularity_score: 96,
      cost_level: 'Budget',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
      description: 'Energetic capital city known for ornate golden shrines like Wat Phra Kaew, bustling street food night markets, tuk-tuk rides, floating markets, and vibrant nightlife.',
      activities: [
        { id: 153, name: 'Grand Palace & Emerald Buddha', category: 'Historic', rating: 4.8, duration_hours: 3, estimated_cost: 25 },
        { id: 154, name: 'Damnoen Saduak Floating Market', category: 'Culture', rating: 4.7, duration_hours: 5, estimated_cost: 35 },
        { id: 155, name: 'Chao Phraya River Dinner Cruise', category: 'Dining Cruise', rating: 4.8, duration_hours: 2.5, estimated_cost: 40 },
        { id: 156, name: 'Chinatown Street Food Tasting', category: 'Food Tour', rating: 4.9, duration_hours: 3, estimated_cost: 30 }
      ]
    },
    {
      id: 15,
      name: 'Cairo',
      country: 'Egypt',
      region: 'Africa',
      popularity_score: 94,
      cost_level: 'Budget',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800&q=80',
      description: 'Ancient cradle of civilization featuring the Great Pyramids of Giza, the Great Sphinx, King Tutankhamun treasures at the Egyptian Museum, and Nile river cruises.',
      activities: [
        { id: 157, name: 'Giza Pyramids & Sphinx Camel Trek', category: 'Ancient World', rating: 4.9, duration_hours: 4, estimated_cost: 45 },
        { id: 158, name: 'Grand Egyptian Museum Tour', category: 'Museum', rating: 4.8, duration_hours: 3.5, estimated_cost: 35 },
        { id: 159, name: 'Felucca Sailboat on the Nile', category: 'Sailing', rating: 4.7, duration_hours: 2, estimated_cost: 25 },
        { id: 160, name: 'Khan el-Khalili Bazaar Tour', category: 'Shopping', rating: 4.7, duration_hours: 3, estimated_cost: 20 }
      ]
    },
    {
      id: 16,
      name: 'Venice',
      country: 'Italy',
      region: 'Europe',
      popularity_score: 95,
      cost_level: 'High',
      recommended_days: 3,
      image_url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&q=80',
      description: 'Romantic floating city built on 118 small islands connected by scenic canals and bridges, famous for gondola rides, St. Marks Square, and Murano glassmaking.',
      activities: [
        { id: 161, name: 'Grand Canal Gondola Ride', category: 'Romantic', rating: 4.8, duration_hours: 1, estimated_cost: 45 },
        { id: 162, name: "Doge's Palace & St. Mark Basilica", category: 'Historic', rating: 4.9, duration_hours: 3, estimated_cost: 60 },
        { id: 163, name: 'Murano & Burano Islands Cruise', category: 'Islands', rating: 4.8, duration_hours: 5, estimated_cost: 38 },
        { id: 164, name: 'Rialto Market Culinary Tour', category: 'Food', rating: 4.7, duration_hours: 2.5, estimated_cost: 50 }
      ]
    },
    {
      id: 17,
      name: 'Cape Town',
      country: 'South Africa',
      region: 'Africa',
      popularity_score: 93,
      cost_level: 'Moderate',
      recommended_days: 5,
      image_url: '/images/destination_capetown.jpg',
      description: 'Stunning coastal city nestled beneath the dramatic flat-topped Table Mountain, featuring Boulders Beach penguin colonies, Cape Point, and Stellenbosch vineyards.',
      activities: [
        { id: 165, name: 'Table Mountain Cableway Ride', category: 'Sightseeing', rating: 4.9, duration_hours: 3, estimated_cost: 28 },
        { id: 166, name: 'Boulders Beach Penguin Tour', category: 'Wildlife', rating: 4.9, duration_hours: 7, estimated_cost: 70 },
        { id: 167, name: 'Robben Island Historic Museum', category: 'Historic', rating: 4.7, duration_hours: 4, estimated_cost: 40 },
        { id: 168, name: 'Stellenbosch Winery Day Trip', category: 'Wine Tour', rating: 4.8, duration_hours: 6, estimated_cost: 85 }
      ]
    },
    {
      id: 18,
      name: 'Prague',
      country: 'Czech Republic',
      region: 'Europe',
      popularity_score: 94,
      cost_level: 'Budget',
      recommended_days: 3,
      image_url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80',
      description: 'Fairy-tale "City of a Hundred Spires", famous for its medieval Old Town Square, gothic Charles Bridge, Prague Castle, vibrant Bohemian culture, and world-class local beers.',
      activities: [
        { id: 169, name: 'Prague Castle Circuit Tour', category: 'Historic', rating: 4.8, duration_hours: 3.5, estimated_cost: 32 },
        { id: 170, name: 'Charles Bridge & Astronomical Clock', category: 'City Walk', rating: 4.8, duration_hours: 2.5, estimated_cost: 20 },
        { id: 171, name: 'Vltava River Evening Jazz Cruise', category: 'Cruise', rating: 4.7, duration_hours: 2.5, estimated_cost: 45 },
        { id: 172, name: 'Medieval Tavern Dinner & Show', category: 'Dining', rating: 4.8, duration_hours: 3, estimated_cost: 55 }
      ]
    },
    {
      id: 19,
      name: 'Amsterdam',
      country: 'Netherlands',
      region: 'Europe',
      popularity_score: 96,
      cost_level: 'High',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&q=80',
      description: 'Charming Dutch capital famous for its UNESCO-listed canal ring, bike culture, Van Gogh Museum, Rijksmuseum art, and vibrant flower markets.',
      activities: [
        { id: 173, name: 'Open-Boat Canal Cruise with Drinks', category: 'Canal Cruise', rating: 4.9, duration_hours: 1.5, estimated_cost: 28 },
        { id: 174, name: 'Van Gogh Museum Entry Ticket', category: 'Art Museum', rating: 4.9, duration_hours: 2.5, estimated_cost: 24 },
        { id: 175, name: 'Rijksmuseum Masterpieces Tour', category: 'Art & Culture', rating: 4.8, duration_hours: 3, estimated_cost: 42 },
        { id: 176, name: 'Zaanse Schans Windmill Day Trip', category: 'Heritage', rating: 4.7, duration_hours: 4, estimated_cost: 38 }
      ]
    },
    {
      id: 20,
      name: 'Rio de Janeiro',
      country: 'Brazil',
      region: 'South America',
      popularity_score: 93,
      cost_level: 'Moderate',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
      description: 'Vibrant seaside city famous for Christ the Redeemer atop Corcovado mountain, Sugarloaf Mountain cable car, Copacabana and Ipanema beaches, and Carnival culture.',
      activities: [
        { id: 177, name: 'Christ the Redeemer & Sugarloaf Tour', category: 'Sightseeing', rating: 4.9, duration_hours: 6, estimated_cost: 85 },
        { id: 178, name: 'Copacabana & Ipanema Beach Lounge', category: 'Beach', rating: 4.8, duration_hours: 4, estimated_cost: 0 },
        { id: 179, name: 'Selarón Steps & Lapa District Tour', category: 'Culture', rating: 4.7, duration_hours: 3, estimated_cost: 25 },
        { id: 180, name: 'Tijuca Rainforest Jeep Safari', category: 'Adventure', rating: 4.8, duration_hours: 4, estimated_cost: 55 }
      ]
    },
    {
      id: 21,
      name: 'Singapore',
      country: 'Singapore',
      region: 'Asia',
      popularity_score: 98,
      cost_level: 'Luxury',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
      description: 'Futuristic island city-state famous for Gardens by the Bay, Marina Bay Sands skypool, UNESCO Botanic Gardens, and vibrant hawker food stalls.',
      activities: [
        { id: 181, name: 'Gardens by the Bay Light Show', category: 'Nature & Art', rating: 4.9, duration_hours: 2, estimated_cost: 24 },
        { id: 182, name: 'Marina Bay Sands Observation Deck', category: 'Sightseeing', rating: 4.8, duration_hours: 2, estimated_cost: 32 },
        { id: 183, name: 'Singapore Night Safari Pass', category: 'Wildlife', rating: 4.8, duration_hours: 3, estimated_cost: 48 },
        { id: 184, name: 'Lau Pa Sat Hawker Food Tour', category: 'Culinary', rating: 4.7, duration_hours: 2, estimated_cost: 20 }
      ]
    },
    {
      id: 22,
      name: 'Istanbul',
      country: 'Turkey',
      region: 'Europe / Asia',
      popularity_score: 96,
      cost_level: 'Moderate',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
      description: 'Transcontinental metropolis straddling Europe and Asia across the Bosphorus strait, famed for Hagia Sophia, Blue Mosque, Grand Bazaar, and Turkish hammams.',
      activities: [
        { id: 185, name: 'Hagia Sophia & Blue Mosque Tour', category: 'Historic', rating: 4.9, duration_hours: 3, estimated_cost: 35 },
        { id: 186, name: 'Bosphorus Sunset Yacht Cruise', category: 'Cruise', rating: 4.8, duration_hours: 2, estimated_cost: 45 },
        { id: 187, name: 'Grand Bazaar & Spice Market Walk', category: 'Shopping', rating: 4.7, duration_hours: 3, estimated_cost: 20 },
        { id: 188, name: 'Authentic Turkish Hammam Bath', category: 'Wellness', rating: 4.8, duration_hours: 2, estimated_cost: 60 }
      ]
    },
    {
      id: 23,
      name: 'Seoul',
      country: 'South Korea',
      region: 'Asia',
      popularity_score: 97,
      cost_level: 'Moderate',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80',
      description: 'Dynamic capital city seamlessly blending ancient Gyeongbokgung Palace with futuristic K-pop culture, Myeongdong shopping, and Korean BBQ gastronomy.',
      activities: [
        { id: 189, name: 'Gyeongbokgung Palace Hanbok Experience', category: 'Culture', rating: 4.9, duration_hours: 3, estimated_cost: 25 },
        { id: 190, name: 'N Seoul Tower & Cable Car', category: 'Sightseeing', rating: 4.8, duration_hours: 2, estimated_cost: 18 },
        { id: 191, name: 'DMZ Peace Border Tour', category: 'Historic', rating: 4.8, duration_hours: 6, estimated_cost: 65 },
        { id: 192, name: 'Myeongdong Street Food Crawl', category: 'Food Tour', rating: 4.9, duration_hours: 3, estimated_cost: 30 }
      ]
    },
    {
      id: 24,
      name: 'Vienna',
      country: 'Austria',
      region: 'Europe',
      popularity_score: 95,
      cost_level: 'High',
      recommended_days: 3,
      image_url: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80',
      description: 'Imperial capital of classical music, famous for Schönbrunn Palace, St. Stephens Cathedral, grand coffeehouses, and Mozart concert performances.',
      activities: [
        { id: 193, name: 'Schönbrunn Palace & Gardens Tour', category: 'Palace', rating: 4.9, duration_hours: 3, estimated_cost: 38 },
        { id: 194, name: 'Vienna State Opera Concert Ticket', category: 'Music', rating: 4.9, duration_hours: 2.5, estimated_cost: 75 },
        { id: 195, name: "St. Stephen's Cathedral Tower Climb", category: 'Historic', rating: 4.7, duration_hours: 1.5, estimated_cost: 12 },
        { id: 196, name: 'Historic Coffeehouse & Sachertorte', category: 'Culinary', rating: 4.8, duration_hours: 2, estimated_cost: 25 }
      ]
    },
    {
      id: 25,
      name: 'Reykjavik (Iceland)',
      country: 'Iceland',
      region: 'Europe',
      popularity_score: 96,
      cost_level: 'Luxury',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
      description: 'Land of Fire & Ice, famous for the magical Northern Lights (Aurora Borealis), Blue Lagoon geothermal spa, erupting geysers, and roaring waterfalls.',
      activities: [
        { id: 197, name: 'Blue Lagoon Geothermal Spa Ticket', category: 'Wellness', rating: 4.9, duration_hours: 3, estimated_cost: 85 },
        { id: 198, name: 'Northern Lights Aurora Hunting Tour', category: 'Adventure', rating: 4.8, duration_hours: 4, estimated_cost: 70 },
        { id: 199, name: 'Golden Circle & Gullfoss Waterfall', category: 'Nature', rating: 4.9, duration_hours: 7, estimated_cost: 95 },
        { id: 200, name: 'Glacier Hiking & Ice Cave Exploration', category: 'Hiking', rating: 4.9, duration_hours: 6, estimated_cost: 140 }
      ]
    },
    {
      id: 26,
      name: 'Florence',
      country: 'Italy',
      region: 'Europe',
      popularity_score: 96,
      cost_level: 'Moderate',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=800&q=80',
      description: "Cradle of the Renaissance, home to Michelangelo's David, Uffizi Gallery masterpieces, the majestic Duomo cathedral, and Tuscan wine tasting.",
      activities: [
        { id: 201, name: 'Uffizi Gallery Skip-the-Line Tour', category: 'Art', rating: 4.9, duration_hours: 3, estimated_cost: 55 },
        { id: 202, name: 'Accademia Gallery David Ticket', category: 'Art & Culture', rating: 4.9, duration_hours: 2, estimated_cost: 40 },
        { id: 203, name: 'Florence Duomo Dome Climb', category: 'Architecture', rating: 4.8, duration_hours: 2, estimated_cost: 30 },
        { id: 204, name: 'Chianti Wine & Tuscan Hillside Tour', category: 'Wine', rating: 4.8, duration_hours: 6, estimated_cost: 90 }
      ]
    },
    {
      id: 27,
      name: 'Toronto',
      country: 'Canada',
      region: 'North America',
      popularity_score: 94,
      cost_level: 'High',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80',
      description: "Canada's largest city, featuring the iconic CN Tower, vibrant multicultural neighborhoods, Toronto Islands, and Niagara Falls day trips.",
      activities: [
        { id: 205, name: 'CN Tower EdgeWalk & Lookout', category: 'Sightseeing', rating: 4.8, duration_hours: 2, estimated_cost: 42 },
        { id: 206, name: 'Niagara Falls Speedboat & Tour', category: 'Day Trip', rating: 4.9, duration_hours: 8, estimated_cost: 110 },
        { id: 207, name: 'Toronto Island Ferry & Bike Ride', category: 'Parks', rating: 4.7, duration_hours: 3, estimated_cost: 25 },
        { id: 208, name: 'Distillery District History Tour', category: 'Historic', rating: 4.7, duration_hours: 2, estimated_cost: 20 }
      ]
    },
    {
      id: 28,
      name: 'Machu Picchu (Cusco)',
      country: 'Peru',
      region: 'South America',
      popularity_score: 97,
      cost_level: 'Moderate',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
      description: 'Mysterious Incan citadel perched high in the Andes mountains, surrounded by cloud forests, Sacred Valley ruins, and rich Andean culture.',
      activities: [
        { id: 209, name: 'Machu Picchu Guided Citadel Tour', category: 'Ancient Ruins', rating: 4.9, duration_hours: 4, estimated_cost: 90 },
        { id: 210, name: 'Inca Trail 1-Day Trekking Hike', category: 'Trekking', rating: 4.9, duration_hours: 8, estimated_cost: 180 },
        { id: 211, name: 'Sacred Valley & Ollantaytambo Tour', category: 'Historic', rating: 4.8, duration_hours: 7, estimated_cost: 65 },
        { id: 212, name: 'Cusco Historic Center Walk', category: 'Culture', rating: 4.7, duration_hours: 3, estimated_cost: 20 }
      ]
    },
    {
      id: 29,
      name: 'Marrakech',
      country: 'Morocco',
      region: 'Africa',
      popularity_score: 94,
      cost_level: 'Budget',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80',
      description: 'The Red City of Morocco, famous for its labyrinthine medina bazaars, snake charmers in Jemaa el-Fnaa, Jardin Majorelle, and desert camel safaris.',
      activities: [
        { id: 213, name: 'Jardin Majorelle & YSL Museum', category: 'Gardens', rating: 4.8, duration_hours: 2.5, estimated_cost: 22 },
        { id: 214, name: 'Jemaa el-Fnaa Night Market & Souks', category: 'Market', rating: 4.7, duration_hours: 3, estimated_cost: 18 },
        { id: 215, name: 'Agafay Desert Sunset Camel Ride', category: 'Desert Safari', rating: 4.8, duration_hours: 5, estimated_cost: 55 },
        { id: 216, name: 'Traditional Moroccan Hammam Spa', category: 'Wellness', rating: 4.8, duration_hours: 2, estimated_cost: 40 }
      ]
    },
    {
      id: 30,
      name: 'Athens',
      country: 'Greece',
      region: 'Europe',
      popularity_score: 95,
      cost_level: 'Budget',
      recommended_days: 3,
      image_url: 'https://images.unsplash.com/photo-1555993539-1732b0330128?w=800&q=80',
      description: 'Cradle of Western civilization, dominated by the majestic 5th-century BC Acropolis and Parthenon temple overlooking vibrant Plaka tavernas.',
      activities: [
        { id: 217, name: 'Acropolis & Parthenon Tour', category: 'Ancient World', rating: 4.9, duration_hours: 3, estimated_cost: 42 },
        { id: 218, name: 'Acropolis Museum Entry Pass', category: 'Museum', rating: 4.8, duration_hours: 2, estimated_cost: 20 },
        { id: 219, name: 'Plaka District Greek Food Walk', category: 'Food Tour', rating: 4.8, duration_hours: 3, estimated_cost: 45 },
        { id: 220, name: 'Temple of Poseidon Cape Sounion Sunset', category: 'Day Trip', rating: 4.7, duration_hours: 4, estimated_cost: 38 }
      ]
    },
    {
      id: 31,
      name: 'Lisbon',
      country: 'Portugal',
      region: 'Europe',
      popularity_score: 96,
      cost_level: 'Budget',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1509839862600-1df9617cd254?w=800&q=80',
      description: 'Sun-drenched capital built on seven hills along the Tagus river, famous for vintage yellow Tram 28, Belém pastéis de nata tarts, and Fado music.',
      activities: [
        { id: 221, name: 'Tram 28 Historic Alfama Tour', category: 'City Walk', rating: 4.8, duration_hours: 2, estimated_cost: 15 },
        { id: 222, name: 'Belém Tower & Jerónimos Monastery', category: 'Historic', rating: 4.8, duration_hours: 3, estimated_cost: 25 },
        { id: 223, name: 'Sintra Fairy-tale Palaces Day Trip', category: 'Day Trip', rating: 4.9, duration_hours: 6, estimated_cost: 60 },
        { id: 224, name: 'Fado Live Music & Dinner Show', category: 'Music & Food', rating: 4.8, duration_hours: 3, estimated_cost: 50 }
      ]
    },
    {
      id: 32,
      name: 'Budapest',
      country: 'Hungary',
      region: 'Europe',
      popularity_score: 95,
      cost_level: 'Budget',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&q=80',
      description: '"Pearl of the Danube", famous for its magnificent Parliament building, thermal Széchenyi baths, Fishermans Bastion views, and ruin bar nightlife.',
      activities: [
        { id: 225, name: 'Széchenyi Thermal Bath Day Pass', category: 'Wellness', rating: 4.9, duration_hours: 4, estimated_cost: 35 },
        { id: 226, name: 'Danube River Evening Sightseeing Cruise', category: 'Cruise', rating: 4.8, duration_hours: 1.5, estimated_cost: 24 },
        { id: 227, name: 'Hungarian Parliament Tour', category: 'Historic', rating: 4.8, duration_hours: 2, estimated_cost: 28 },
        { id: 228, name: "Fisherman's Bastion & Buda Castle", category: 'Sightseeing', rating: 4.8, duration_hours: 2.5, estimated_cost: 15 }
      ]
    },
    {
      id: 33,
      name: 'Los Angeles',
      country: 'United States',
      region: 'North America',
      popularity_score: 96,
      cost_level: 'High',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&q=80',
      description: 'Entertainment capital of the world, home to Hollywood film studios, Beverly Hills celebrity mansions, Santa Monica Pier, and Venice Beach boardwalk.',
      activities: [
        { id: 229, name: 'Universal Studios Hollywood Pass', category: 'Theme Park', rating: 4.9, duration_hours: 8, estimated_cost: 110 },
        { id: 230, name: 'Hollywood Sign Hiking Tour', category: 'Hiking', rating: 4.7, duration_hours: 2.5, estimated_cost: 25 },
        { id: 231, name: 'Santa Monica Pier & Venice Bike Ride', category: 'Beach', rating: 4.8, duration_hours: 3, estimated_cost: 30 },
        { id: 232, name: 'Griffith Observatory Sunset View', category: 'Sightseeing', rating: 4.9, duration_hours: 2, estimated_cost: 0 }
      ]
    },
    {
      id: 34,
      name: 'Queenstown',
      country: 'New Zealand',
      region: 'Oceania',
      popularity_score: 95,
      cost_level: 'High',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1507699622108-4be3afd695ad?w=800&q=80',
      description: 'Adventure capital of the world, nestled beside Lake Wakatipu surrounded by Remarkables mountains, offering bungy jumping, jet boating, and Milford Sound trips.',
      activities: [
        { id: 233, name: 'Milford Sound Cruise & Flight', category: 'Scenic Cruise', rating: 4.9, duration_hours: 7, estimated_cost: 195 },
        { id: 234, name: 'Shotover Jet Boat Experience', category: 'Extreme Sport', rating: 4.9, duration_hours: 1, estimated_cost: 95 },
        { id: 235, name: 'AJ Hackett Kawarau Bungy Jump', category: 'Extreme Sport', rating: 4.8, duration_hours: 2, estimated_cost: 145 },
        { id: 236, name: 'Skyline Gondola & Luge Ride', category: 'Adventure', rating: 4.8, duration_hours: 2, estimated_cost: 40 }
      ]
    },
    {
      id: 35,
      name: 'Kuala Lumpur',
      country: 'Malaysia',
      region: 'Asia',
      popularity_score: 94,
      cost_level: 'Budget',
      recommended_days: 3,
      image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
      description: 'Vibrant Malaysian capital dominated by the iconic 88-story Petronas Twin Towers, Batu Caves rainbow steps, and rich Malay, Chinese, and Indian cuisine.',
      activities: [
        { id: 237, name: 'Petronas Twin Towers Skybridge', category: 'Architecture', rating: 4.8, duration_hours: 2, estimated_cost: 25 },
        { id: 238, name: 'Batu Caves Rainbow Steps Tour', category: 'Culture', rating: 4.7, duration_hours: 3, estimated_cost: 15 },
        { id: 239, name: 'Jalan Alor Street Food Crawl', category: 'Food Tour', rating: 4.8, duration_hours: 2.5, estimated_cost: 20 },
        { id: 240, name: 'Sunway Lagoon Theme Park Pass', category: 'Theme Park', rating: 4.7, duration_hours: 5, estimated_cost: 45 }
      ]
    },
    {
      id: 36,
      name: 'Edinburgh',
      country: 'United Kingdom',
      region: 'Europe',
      popularity_score: 95,
      cost_level: 'Moderate',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
      description: 'Majestic Scottish capital featuring medieval Edinburgh Castle atop an extinct volcano, cobblestone Royal Mile, Arthurs Seat hike, and Scotch whisky tasting.',
      activities: [
        { id: 241, name: 'Edinburgh Castle Guided Tour', category: 'Castle', rating: 4.9, duration_hours: 3, estimated_cost: 35 },
        { id: 242, name: "Arthur's Seat Extinct Volcano Hike", category: 'Hiking', rating: 4.8, duration_hours: 2.5, estimated_cost: 0 },
        { id: 243, name: 'Royal Mile Ghost & Vaults Tour', category: 'Historic', rating: 4.7, duration_hours: 2, estimated_cost: 22 },
        { id: 244, name: 'The Scotch Whisky Experience', category: 'Tasting', rating: 4.8, duration_hours: 2, estimated_cost: 40 }
      ]
    },
    {
      id: 37,
      name: 'Vancouver',
      country: 'Canada',
      region: 'North America',
      popularity_score: 95,
      cost_level: 'High',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1559511260-96a654ecdf96?w=800&q=80',
      description: 'Spectacular Pacific Northwest coastal city surrounded by snow-capped mountains, featuring Stanley Park seawall, Capilano Suspension Bridge, and Granville Island.',
      activities: [
        { id: 245, name: 'Capilano Suspension Bridge Pass', category: 'Nature', rating: 4.8, duration_hours: 3, estimated_cost: 48 },
        { id: 246, name: 'Stanley Park Bike Rental & Seawall', category: 'Parks', rating: 4.8, duration_hours: 3, estimated_cost: 25 },
        { id: 247, name: 'Whistler Mountain Day Trip', category: 'Day Trip', rating: 4.9, duration_hours: 8, estimated_cost: 95 },
        { id: 248, name: 'Whale Watching Speedboat Cruise', category: 'Wildlife', rating: 4.8, duration_hours: 4, estimated_cost: 130 }
      ]
    },
    {
      id: 38,
      name: 'Hanoi & Ha Long Bay',
      country: 'Vietnam',
      region: 'Asia',
      popularity_score: 95,
      cost_level: 'Budget',
      recommended_days: 5,
      image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
      description: "Vietnams thousand-year-old capital known for French colonial architecture, ancient Old Quarter train street, egg coffee, and UNESCO Ha Long Bay limestone karsts.",
      activities: [
        { id: 249, name: 'Ha Long Bay Overnight Cruise', category: 'Cruises', rating: 4.9, duration_hours: 24, estimated_cost: 160 },
        { id: 250, name: 'Hanoi Street Food & Egg Coffee', category: 'Culinary', rating: 4.9, duration_hours: 3, estimated_cost: 25 },
        { id: 251, name: 'Train Street Photo & Cafe Walk', category: 'Culture', rating: 4.7, duration_hours: 1.5, estimated_cost: 10 },
        { id: 252, name: 'Ninh Binh Tam Coc Boat Cave Tour', category: 'Nature', rating: 4.8, duration_hours: 8, estimated_cost: 45 }
      ]
    },
    {
      id: 39,
      name: 'Buenos Aires',
      country: 'Argentina',
      region: 'South America',
      popularity_score: 93,
      cost_level: 'Budget',
      recommended_days: 4,
      image_url: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80',
      description: '"Paris of South America", famed for passionate Tango dancing in La Boca colorful streets, San Telmo antique markets, world-class Argentine steak, and Malbec wines.',
      activities: [
        { id: 253, name: 'Authentic Tango Show & Steak Dinner', category: 'Music & Food', rating: 4.9, duration_hours: 3.5, estimated_cost: 75 },
        { id: 254, name: 'La Boca Caminito Walking Tour', category: 'Culture', rating: 4.7, duration_hours: 2, estimated_cost: 15 },
        { id: 255, name: 'Recoleta Cemetery & Malba Pass', category: 'Historic', rating: 4.7, duration_hours: 3, estimated_cost: 20 },
        { id: 256, name: 'Argentine Empanada Cooking Class', category: 'Workshop', rating: 4.8, duration_hours: 3, estimated_cost: 50 }
      ]
    },
    {
      id: 40,
      name: 'Maldives Islands',
      country: 'Maldives',
      region: 'Asia',
      popularity_score: 99,
      cost_level: 'Luxury',
      recommended_days: 6,
      image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      description: 'Tropical island paradise of crystal turquoise lagoons, overwater luxury bungalows, pristine white sand beaches, manta ray diving, and coral reef snorkeling.',
      activities: [
        { id: 257, name: 'Overwater Villa Stay Experience', category: 'Resort Stay', rating: 4.9, duration_hours: 24, estimated_cost: 350 },
        { id: 258, name: 'Manta Ray & Whale Shark Diving', category: 'Diving', rating: 4.9, duration_hours: 4, estimated_cost: 110 },
        { id: 259, name: 'Sunset Dolphin Champagne Cruise', category: 'Cruise', rating: 4.8, duration_hours: 2, estimated_cost: 85 },
        { id: 260, name: 'Underwater Restaurant Fine Dining', category: 'Dining', rating: 4.9, duration_hours: 2.5, estimated_cost: 220 }
      ]
    }
  ];

export default famousCitiesData;
