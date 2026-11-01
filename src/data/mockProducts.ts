import type { Product, Review, Coupon } from '../types/index.ts';

export const CATEGORIES = [
  'All Decor',
  'Vases & Planters',
  'Lighting & Lamps',
  'Wall Art & Mirrors',
  'Rugs & Cushions',
  'Sculptures & Accents',
  'Kitchen & Dining',
  'Furniture Accents',
] as const;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Nordic Fluted Matte Ceramic Floor Vase',
    subtitle: 'Artisanal hand-thrown ceramic vase with ribbed tactile finish',
    category: 'Vases & Planters',
    price: 89,
    originalPrice: 159,
    discountPercent: 44,
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    stockQuantity: 18,
    badge: 'Aura Assured',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Elevate your living space with this architectural Nordic floor vase. Handcrafted from premium terracotta with an ultra-matte off-white glaze and delicate fluting, it commands attention whether styled with dried pampas grass or left as a sculptural centerpiece.',
    highlights: [
      '100% Hand-thrown artisan ceramic terracotta',
      'Water-sealed internal chamber suitable for fresh stems',
      'Scratch-resistant velvet felt base pad',
      'Neutral Scandinavian warm cream tone'
    ],
    specifications: {
      'Material': 'High-density Architectural Ceramic',
      'Dimensions': '11" D x 24" H (28cm x 61cm)',
      'Weight': '4.2 kg (9.25 lbs)',
      'Color': 'Warm Oatmeal / Matte Ivory',
      'Finish': 'Textured Fluted Glaze',
      'Care': 'Wipe clean with a damp lint-free cloth',
      'Country of Origin': 'India (Crafted in Khurja)'
    },
    dimensions: '11" D x 24" H',
    material: 'Architectural Ceramic',
    color: 'Warm Oatmeal',
    deliveryDays: 3,
    freeDelivery: true,
    warranty: '1 Year Crack & Defect Guarantee',
    featured: true,
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'prod-2',
    title: 'Aura Brass & Frosted Opal Globe Pendant Lamp',
    subtitle: 'Brushed brass mid-century ceiling chandelier with warm glow',
    category: 'Lighting & Lamps',
    price: 135,
    originalPrice: 249,
    discountPercent: 45,
    rating: 4.9,
    reviewCount: 420,
    inStock: true,
    stockQuantity: 9,
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A timeless silhouette engineered for ambient harmony. Featuring mouth-blown milk glass globes suspended from electroplated brushed brass armatures, casting a flattering diffuse glow across dining islands or intimate reading corners.',
    highlights: [
      'Genuine electroplated brushed brass finish (anti-tarnish)',
      'Dual-layer triplex hand-blown opal glass diffuser',
      'Compatible with smart dimmers & standard E26/E27 LED bulbs',
      'Adjustable drop suspension wire up to 59 inches'
    ],
    specifications: {
      'Material': 'Solid Brass & Hand-blown Triplex Glass',
      'Dimensions': '14" W x 14" D x 22" H (Pendant)',
      'Weight': '3.1 kg',
      'Bulb Base': 'E26 / E27 (Warm 2700K 9W LED included)',
      'Voltage': '110V - 240V Multi-region',
      'Certifications': 'CE & UL Certified'
    },
    dimensions: '14" W x 22" H',
    material: 'Brushed Brass & Opal Glass',
    color: 'Warm Brass Gold',
    deliveryDays: 2,
    freeDelivery: true,
    warranty: '2 Years Electrical & Finish Warranty',
    featured: true,
    createdAt: '2026-09-05T12:00:00Z'
  },
  {
    id: 'prod-3',
    title: 'Minimalist Arch Full-Length Dressing Mirror',
    subtitle: 'Ultra-thin gold-edged aluminum alloy frame with shatterproof HD glass',
    category: 'Wall Art & Mirrors',
    price: 189,
    originalPrice: 320,
    discountPercent: 40,
    rating: 4.7,
    reviewCount: 184,
    inStock: true,
    stockQuantity: 6,
    badge: 'Aura Assured',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'This architectural cathedral-arch mirror introduces spatial depth, light amplification, and effortless sophistication. Designed with commercial-grade 5mm copper-free silver glass and an aerospace aluminum frame.',
    highlights: [
      '5mm HD distortion-free copper-free glass mirror',
      'Explosion-proof membrane backing prevents splintering',
      'Dual placement: Free-standing with retractable easel or wall-mount',
      'Corrosion-resistant matte champagne gold finish'
    ],
    specifications: {
      'Frame Material': 'Aviation-grade Aluminum Alloy',
      'Dimensions': '65" H x 24" W x 1.2" D',
      'Glass Type': '5mm Silvered float mirror',
      'Weight': '11.8 kg',
      'Mounting': 'Wall anchor hardware & folding floor stand included'
    },
    dimensions: '65" H x 24" W',
    material: 'Aluminum Frame & 5mm Glass',
    color: 'Champagne Gold',
    deliveryDays: 4,
    freeDelivery: true,
    warranty: '3 Years Anti-Fog & Mirror Silvering Warranty',
    featured: true,
    createdAt: '2026-09-10T14:30:00Z'
  },
  {
    id: 'prod-4',
    title: 'Hand-Tufted Berber Wool Geometric Area Rug',
    subtitle: 'Plush Moroccan tribal pattern with organic un-dyed wool pile',
    category: 'Rugs & Cushions',
    price: 219,
    originalPrice: 420,
    discountPercent: 47,
    rating: 4.9,
    reviewCount: 260,
    inStock: true,
    stockQuantity: 12,
    badge: 'Handcrafted',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Handcrafted by generational artisans in Rajasthan, this plush wool rug blends centuries-old nomadic diamond motifs with modern minimalist restraint. Silky underfoot with 1.2-inch high pile thickness.',
    highlights: [
      '100% New Zealand Virgin Wool with natural lanolin sheen',
      'Plush 1.2-inch high pile thickness for cloud-like comfort',
      'Natural latex reinforced cotton canvas backing',
      'Shed-resistant double-twisted yarn construction'
    ],
    specifications: {
      'Material': '100% New Zealand Wool & Cotton Weft',
      'Size': '5 ft x 8 ft (152cm x 244cm)',
      'Weave Type': 'Hand-Tufted Cut Pile',
      'Weight': '14 kg',
      'Pile Height': '30 mm (1.2 inches)',
      'Care': 'Vacuum regularly without beater bar; spot clean with wool detergent'
    },
    dimensions: '5 ft x 8 ft',
    material: '100% Virgin Wool',
    color: 'Ivory & Charcoal Black',
    deliveryDays: 3,
    freeDelivery: true,
    warranty: '1 Year Craftsmanship Warranty',
    featured: true,
    createdAt: '2026-09-12T09:00:00Z'
  },
  {
    id: 'prod-5',
    title: 'Abstract Organic Cast Bronze Human Silhouette',
    subtitle: 'Sculptural mantle art piece celebrating contemplative balance',
    category: 'Sculptures & Accents',
    price: 65,
    originalPrice: 110,
    discountPercent: 40,
    rating: 4.6,
    reviewCount: 142,
    inStock: true,
    stockQuantity: 4,
    badge: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Inspired by Giacometti forms, this sand-cast bronze sculpture captures the tranquility of introspective mindfulness. Ideal for bookends, coffee table trays, or art vitrines.',
    highlights: [
      'Solid sand-cast heavy alloy bronze',
      'Patinated matte black finish with subtle bronze undertones',
      'Substantial weight preventing accidental topples',
      'Protective felt pads on pedestal'
    ],
    specifications: {
      'Material': 'Cast Bronze Alloy with Black Patina',
      'Dimensions': '4.5" W x 3" D x 12.5" H',
      'Weight': '1.8 kg',
      'Color': 'Antique Noir Bronze',
      'Placement': 'Console, Fireplace Mantel, Floating Shelves'
    },
    dimensions: '4.5" W x 12.5" H',
    material: 'Sand-cast Bronze',
    color: 'Antique Noir',
    deliveryDays: 2,
    freeDelivery: true,
    warranty: 'Lifetime Metal Integrity Guarantee',
    featured: false,
    createdAt: '2026-09-15T11:00:00Z'
  },
  {
    id: 'prod-6',
    title: 'Japanese Wabi-Sabi Ceramic Matcha & Tea Set',
    subtitle: 'Hand-thrown stoneware teapot with four matching cups and bamboo tray',
    category: 'Kitchen & Dining',
    price: 79,
    originalPrice: 140,
    discountPercent: 43,
    rating: 4.9,
    reviewCount: 388,
    inStock: true,
    stockQuantity: 22,
    badge: 'Festive Deal',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Honor the art of slow living. Fired at 1300°C for exceptional heat retention and durability, this organic matte stoneware tea service features a raw clay base, reactive celadon glaze, and bent bamboo handle.',
    highlights: [
      'High-fired coarse grain stoneware clay',
      'Built-in stainless steel mesh loose-leaf tea infuser',
      'Lead-free, cadmium-free food-safe glaze',
      'Includes 800ml teapot, 4 cups (180ml each), and organic bamboo tray'
    ],
    specifications: {
      'Material': 'High-fire Stoneware & Natural Bamboo',
      'Capacity': 'Teapot 800ml / Cups 180ml each',
      'Dishwasher Safe': 'Yes (remove bamboo handle)',
      'Microwave Safe': 'Yes (ceramic components only)',
      'Box Content': '1 Teapot, 4 Cups, 1 Bamboo Serving Tray'
    },
    dimensions: 'Teapot 7" x 6", Cups 3" x 2.8"',
    material: 'Ceramic Stoneware & Bamboo',
    color: 'Celadon Sage & Raw Clay',
    deliveryDays: 3,
    freeDelivery: true,
    warranty: '6 Months Replacement against Thermal Shock',
    featured: true,
    createdAt: '2026-09-18T16:00:00Z'
  },
  {
    id: 'prod-7',
    title: 'Travertine Marble Pedestal Side Table',
    subtitle: 'Monolithic natural honed Italian beige travertine stone accent table',
    category: 'Furniture Accents',
    price: 289,
    originalPrice: 499,
    discountPercent: 42,
    rating: 4.8,
    reviewCount: 95,
    inStock: true,
    stockQuantity: 3,
    badge: 'Aura Assured',
    images: [
      'https://images.unsplash.com/photo-1533779283484-8da49dc9a67e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A sculptural statement carved from solid natural travertine stone. Each piece showcases unique geological cavities and warm sedimentary veining, honed to a smooth matte touch.',
    highlights: [
      '100% Solid Natural Italian Travertine Marble',
      'Honed matte sealant protects against spills and water rings',
      'Heavy monolithic weight ensures exceptional stability',
      'Organic chamfered edge profiling'
    ],
    specifications: {
      'Material': 'Natural Italian Travertine Marble',
      'Dimensions': '16" Diameter x 20" Height',
      'Weight': '23.5 kg (51.8 lbs)',
      'Finish': 'Honed & Sealed Matte Stone',
      'Assembly': 'None (Fully assembled monolithic piece)'
    },
    dimensions: '16" D x 20" H',
    material: 'Natural Italian Travertine',
    color: 'Desert Sand / Warm Cream',
    deliveryDays: 5,
    freeDelivery: true,
    warranty: '5 Years Structural Stone Warranty',
    featured: true,
    createdAt: '2026-09-20T08:00:00Z'
  },
  {
    id: 'prod-8',
    title: 'Smoked Amber Glass Mushroom Table Lamp',
    subtitle: 'Retro 1970s iconic ambient lamp with dimmable warm filament',
    category: 'Lighting & Lamps',
    price: 69,
    originalPrice: 120,
    discountPercent: 42,
    rating: 4.7,
    reviewCount: 215,
    inStock: true,
    stockQuantity: 15,
    badge: 'Trending',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Channeling mid-century European design, this single-piece mouth-blown glass mushroom lamp casts a warm, soothing ambient halo. Perfect for bedside tables, console shelving, and cozy workspaces.',
    highlights: [
      'Mouth-blown tinted amber art glass',
      'Inline rotary dimmer switch with 3 brightness modes',
      'Braided textile cord in golden beige (1.8m)',
      'Low power consumption energy-efficient warm LED'
    ],
    specifications: {
      'Material': 'Hand-blown Borosilicate Amber Glass',
      'Dimensions': '9" Diameter x 11.5" Height',
      'Weight': '1.4 kg',
      'Power': 'USB-C or Standard AC Wall Plug with inline dimmer'
    },
    dimensions: '9" D x 11.5" H',
    material: 'Mouth-blown Amber Glass',
    color: 'Warm Honey Amber',
    deliveryDays: 2,
    freeDelivery: true,
    warranty: '1 Year Electronic Component Warranty',
    featured: false,
    createdAt: '2026-09-22T13:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Ananya Sharma',
    rating: 5,
    title: 'Stunning centerpiece for our living room console!',
    comment: 'The quality of the ceramic finish blew me away. The fluting gives it such a high-end designer look comparable to West Elm or Crate & Barrel at a fraction of the cost. Fast 2-day delivery and secure bubble packaging!',
    date: '2026-09-28',
    verified: true,
    helpfulCount: 38
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Rohan Mehra',
    rating: 5,
    title: 'Heavy, luxurious and exactly as pictured',
    comment: 'Extremely well packed. The matte ivory shade is so soothing. Added eucalyptus and dried bunny tails, and everyone asks where we bought it.',
    date: '2026-09-24',
    verified: true,
    helpfulCount: 19
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Priya Venkatesh',
    rating: 5,
    title: 'The warm glow transformed our dining room',
    comment: 'The brass finish is genuine brushed metal, not cheap gold paint. Connected it to a Lutron dimmer switch and the opal glass diffuses the light evenly with zero glare.',
    date: '2026-09-29',
    verified: true,
    helpfulCount: 42
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    userName: 'Vikram Sengupta',
    rating: 4,
    title: 'Zero distortion in the glass',
    comment: 'A true 5mm mirror with no warping. The arched top looks gorgeous in our master bedroom. Heavy and sturdy stand.',
    date: '2026-09-20',
    verified: true,
    helpfulCount: 15
  },
  {
    id: 'rev-5',
    productId: 'prod-4',
    userName: 'Devika Patel',
    rating: 5,
    title: 'Feels like walking on clouds',
    comment: 'The 100% wool pile is so thick and luxurious! My kids love sitting on it while reading. No chemical odor upon unboxing.',
    date: '2026-09-25',
    verified: true,
    helpfulCount: 27
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'DECORIVA15',
    discountPercent: 15,
    minOrderValue: 50,
    maxDiscount: 45,
    description: '15% OFF on luxury orders above $50'
  },
  {
    code: 'AURALUXE15',
    discountPercent: 15,
    minOrderValue: 50,
    maxDiscount: 45,
    description: '15% OFF on luxury orders above $50'
  },
  {
    code: 'FESTIVE25',
    discountPercent: 25,
    minOrderValue: 150,
    maxDiscount: 75,
    description: 'Grand Living Festival 25% OFF on orders above $150'
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    minOrderValue: 0,
    maxDiscount: 20,
    description: '10% instant discount for new home decorators'
  }
];
