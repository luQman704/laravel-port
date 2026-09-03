<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\BlogArticle;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response
    {
        $articles = BlogArticle::where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->get(['id', 'title', 'slug', 'category', 'cover_image', 'excerpt', 'read_minutes', 'published_at'])
            ->toArray();

        return Inertia::render('Articles', ['articles' => $articles]);
    }

    public function show(string $slug): Response
    {
        $article = BlogArticle::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        $related = BlogArticle::where('is_published', true)
            ->where('id', '!=', $article->id)
            ->where('category', $article->category)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get(['id', 'title', 'slug', 'category', 'cover_image', 'excerpt', 'read_minutes', 'published_at'])
            ->toArray();

        if (count($related) < 3) {
            $existing = collect($related)->pluck('id')->push($article->id)->all();
            $more = BlogArticle::where('is_published', true)
                ->whereNotIn('id', $existing)
                ->orderByDesc('published_at')
                ->limit(3 - count($related))
                ->get(['id', 'title', 'slug', 'category', 'cover_image', 'excerpt', 'read_minutes', 'published_at'])
                ->toArray();
            $related = array_merge($related, $more);
        }

        return Inertia::render('Article', [
            'article' => $article->toArray(),
            'related' => $related,
        ]);
    }
}
