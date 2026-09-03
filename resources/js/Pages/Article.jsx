import MainLayout from '@/Layouts/MainLayout';

function ArticleCard({ article }) {
    return (
        <a
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
                <h3 className="text-base font-bold text-pitlane leading-snug group-hover:text-sector-700 transition-colors line-clamp-2">
                    {article.title}
                </h3>
                {article.excerpt && (
                    <p className="text-sm text-pitlane-60 leading-relaxed line-clamp-2 flex-1">{article.excerpt}</p>
                )}
                <div className="text-xs text-alloy mt-1">
                    {article.published_at && new Date(article.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>
        </a>
    );
}

export default function Article({ article, related = [] }) {
    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <nav className="text-sm text-pitlane-60 mb-8 flex gap-2 flex-wrap items-center">
                    <a href="/" className="hover:text-sector-600">Home</a>
                    <span>/</span>
                    <a href="/articles" className="hover:text-sector-600">Articles</a>
                    <span>/</span>
                    <span className="text-pitlane">{article.title}</span>
                </nav>

                {/* Cover image */}
                {article.cover_image && (
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-cloud">
                        <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    {article.category && (
                        <span className="t-label text-sector-600 bg-sector-50 px-3 py-1 rounded-full">{article.category}</span>
                    )}
                    <span className="text-sm text-alloy">{article.read_minutes} min read</span>
                    {article.published_at && (
                        <span className="text-sm text-alloy">
                            {new Date(article.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="t-display text-pitlane leading-tight mb-6">{article.title}</h1>

                {/* Excerpt */}
                {article.excerpt && (
                    <p className="text-lg text-pitlane-60 leading-relaxed mb-8 border-l-4 border-sector-500 pl-5 italic">
                        {article.excerpt}
                    </p>
                )}

                {/* Body */}
                {article.body ? (
                    <div
                        className="prose prose-lg max-w-none text-pitlane-60 leading-relaxed
                            prose-headings:text-pitlane prose-headings:font-bold
                            prose-a:text-sector-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-pitlane
                            prose-li:marker:text-sector-500"
                        dangerouslySetInnerHTML={{ __html: article.body }}
                    />
                ) : (
                    <div className="py-12 text-center text-alloy italic text-sm">Article body coming soon.</div>
                )}

                {/* Divider */}
                <div className="border-t border-asphalt my-12" />

                {/* Related articles */}
                {related.length > 0 && (
                    <div>
                        <h2 className="t-h2 text-pitlane mb-6">More articles</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map(a => <ArticleCard key={a.id} article={a} />)}
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}
