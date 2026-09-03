import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';

export default function Articles({ articles = [] }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = ['All', ...new Set(articles.map(a => a.category).filter(Boolean))];

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-10">

                <nav className="text-sm text-pitlane-60 mb-6 flex gap-2">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <span className="text-pitlane">Articles</span>
                </nav>

                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="t-h1 text-pitlane">Build guides &amp; articles</h1>
                        <p className="text-sm text-pitlane-60 mt-1">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {articles.length === 0 ? (
                    <div className="py-24 text-center text-alloy text-sm">No articles published yet.</div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map(article => (
                            <a
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="group flex flex-col bg-white border border-asphalt rounded-xl overflow-hidden hover:border-sector-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="aspect-[16/9] bg-cloud overflow-hidden">
                                    {article.cover_image ? (
                                        <img
                                            src={article.cover_image}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-grid flex items-center justify-center">
                                            <svg className="w-10 h-10 text-alloy-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 p-4 gap-2">
                                    <div className="flex items-center gap-2">
                                        {article.category && (
                                            <span className="t-label text-sector-600 bg-sector-50 px-2 py-0.5 rounded">{article.category}</span>
                                        )}
                                        <span className="t-label text-alloy">{article.read_minutes} min read</span>
                                    </div>
                                    <h2 className="text-base font-bold text-pitlane leading-snug group-hover:text-sector-700 transition-colors line-clamp-2">
                                        {article.title}
                                    </h2>
                                    {article.excerpt && (
                                        <p className="text-sm text-pitlane-60 leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                                    )}
                                    <div className="text-xs text-alloy mt-1">
                                        {article.published_at && new Date(article.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

            </div>
        </MainLayout>
    );
}
