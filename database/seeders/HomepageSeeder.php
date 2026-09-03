<?php

namespace Database\Seeders;

use App\Models\BlogArticle;
use App\Models\HomeDeal;
use App\Models\HomeFeaturedProduct;
use App\Models\Testimonial;
use App\Models\Turn14Product;
use Illuminate\Database\Seeder;

class HomepageSeeder extends Seeder
{
    public function run(): void
    {
        // ── Pick products from specific categories ────────────────────────
        $byCategory = function (string $cat, int $n) {
            return Turn14Product::where('sync_active', 1)
                ->where('discontinued', 0)
                ->where('category', $cat)
                ->whereNotNull('thumbnail')
                ->inRandomOrder()
                ->limit($n)
                ->pluck('id');
        };

        $anyProducts = function (int $n, array $excludeIds = []) {
            return Turn14Product::where('sync_active', 1)
                ->where('discontinued', 0)
                ->whereNotNull('thumbnail')
                ->whereNotIn('id', $excludeIds)
                ->inRandomOrder()
                ->limit($n)
                ->pluck('id');
        };

        // ── Deals of the Day ─────────────────────────────────────────────
        HomeDeal::truncate();
        $dealIds = $byCategory('Suspension', 3)
            ->concat($byCategory('Brakes, Rotors & Pads', 2))
            ->concat($byCategory('Air Intake Systems', 1));

        if ($dealIds->count() < 6) {
            $dealIds = $dealIds->concat($anyProducts(6 - $dealIds->count(), $dealIds->all()));
        }

        $endsAt = now()->addHours(rand(18, 47));
        foreach ($dealIds->take(6) as $i => $id) {
            HomeDeal::create([
                'turn14_product_id' => $id,
                'deal_price_incl'   => null, // uses product price
                'ends_at'           => $endsAt,
                'is_active'         => true,
                'sort_order'        => $i,
            ]);
        }

        // ── Trending products ────────────────────────────────────────────
        HomeFeaturedProduct::where('section', 'trending')->delete();
        $trendIds = $byCategory('Engine Components', 3)
            ->concat($byCategory('Exhaust, Mufflers & Tips', 2))
            ->concat($byCategory('Forced Induction', 2))
            ->concat($byCategory('Suspension', 1));

        if ($trendIds->count() < 8) {
            $trendIds = $trendIds->concat($anyProducts(8 - $trendIds->count(), $trendIds->all()));
        }

        foreach ($trendIds->take(8) as $i => $id) {
            HomeFeaturedProduct::create([
                'turn14_product_id' => $id,
                'section'           => 'trending',
                'is_active'         => true,
                'sort_order'        => $i,
            ]);
        }

        // ── Popular products with tabs ────────────────────────────────────
        HomeFeaturedProduct::where('section', 'popular')->delete();
        $tabs = [
            'Suspension'        => $byCategory('Suspension', 6),
            'Air Intake'        => $byCategory('Air Intake Systems', 6),
            'Exhaust'           => $byCategory('Exhaust, Mufflers & Tips', 6),
            'Engine'            => $byCategory('Engine Components', 6),
        ];

        $sort = 0;
        foreach ($tabs as $tab => $ids) {
            $filled = $ids->count() > 0 ? $ids : $anyProducts(4);
            foreach ($filled->take(6) as $id) {
                HomeFeaturedProduct::create([
                    'turn14_product_id' => $id,
                    'section'           => 'popular',
                    'category_tab'      => $tab,
                    'is_active'         => true,
                    'sort_order'        => $sort++,
                ]);
            }
        }

        // ── Testimonials ─────────────────────────────────────────────────
        Testimonial::truncate();
        $testimonials = [
            [
                'customer_name'     => 'Ruan van der Merwe',
                'customer_location' => 'Pretoria, GP',
                'vehicle'           => '2018 Subaru WRX STI',
                'body'              => 'Got my Brembo big brake kit landed at my door, fully priced in rands — no customs shock at the end. The fitment was spot on for my STI. Delivery took 4 days from order.',
                'rating'            => 5,
                'sort_order'        => 0,
            ],
            [
                'customer_name'     => 'Ashleigh Mokoena',
                'customer_location' => 'Johannesburg, GP',
                'vehicle'           => '2020 Golf GTI Mk7.5',
                'body'              => 'Finally a SA shop that stocks proper performance parts with real prices. Ordered an Eibach Pro-Kit suspension set — arrived in 3 days and the install was straightforward.',
                'rating'            => 5,
                'sort_order'        => 1,
            ],
            [
                'customer_name'     => 'Danie Botha',
                'customer_location' => 'Cape Town, WC',
                'vehicle'           => '2015 Ford Mustang GT',
                'body'              => 'The stage filter on the site made it easy to figure out where my build was. Went Stage 2 — headers, intake and a tune kit. All parts were correct fitment, no surprises.',
                'rating'            => 5,
                'sort_order'        => 2,
            ],
            [
                'customer_name'     => 'Kefiloe Sithole',
                'customer_location' => 'Durban, KZN',
                'vehicle'           => '2019 Toyota GR86',
                'body'              => 'Been trying to source a Mishimoto rad for my 86 locally for months. Found it here, ZAR price, delivered in 5 days. Support team actually knew the car. Will be back.',
                'rating'            => 4,
                'sort_order'        => 3,
            ],
        ];

        foreach ($testimonials as $data) {
            Testimonial::create(array_merge($data, ['is_active' => true]));
        }

        // ── Blog articles ─────────────────────────────────────────────────
        BlogArticle::truncate();
        $articles = [
            [
                'title'        => 'Stage 1 vs Stage 2: What\'s the actual difference?',
                'slug'         => 'stage-1-vs-stage-2-difference',
                'category'     => 'Build Guides',
                'cover_image'  => 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
                'excerpt'      => 'Most people know the terms but can\'t define the line. Here\'s a clear breakdown of what separates Stage 1 from Stage 2, and when to make the move.',
                'read_minutes' => 5,
                'is_published' => true,
                'published_at' => now()->subDays(3),
                'sort_order'   => 0,
            ],
            [
                'title'        => 'Cold air intake: worth it or not?',
                'slug'         => 'cold-air-intake-worth-it',
                'category'     => 'Suspension',
                'cover_image'  => 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
                'excerpt'      => 'The mod everyone does first. We break down what a cold air intake actually does, what gains are real vs marketing, and which ones fit SA conditions.',
                'read_minutes' => 4,
                'is_published' => true,
                'published_at' => now()->subDays(7),
                'sort_order'   => 1,
            ],
            [
                'title'        => 'How we price: exchange rate, duty & VAT explained',
                'slug'         => 'how-we-price-exchange-rate-duty-vat',
                'category'     => 'Buying Guide',
                'cover_image'  => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
                'excerpt'      => 'Every price on our site is the all-in landed price. Here\'s exactly how we calculate it — exchange rate, customs duty class, freight, and VAT — so there are no surprises.',
                'read_minutes' => 3,
                'is_published' => true,
                'published_at' => now()->subDays(14),
                'sort_order'   => 2,
            ],
        ];

        foreach ($articles as $data) {
            BlogArticle::create($data);
        }

        echo "Homepage seeded.\n";
        echo "  Deals:    " . HomeDeal::count() . "\n";
        echo "  Trending: " . HomeFeaturedProduct::where('section','trending')->count() . "\n";
        echo "  Popular:  " . HomeFeaturedProduct::where('section','popular')->count() . "\n";
        echo "  Reviews:  " . Testimonial::count() . "\n";
        echo "  Articles: " . BlogArticle::count() . "\n";
    }
}
