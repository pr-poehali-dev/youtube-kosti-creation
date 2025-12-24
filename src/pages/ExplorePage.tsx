import VideoCard from '@/components/VideoCard';

const categories = [
  { name: 'Музыка', icon: '🎵', color: 'from-purple-600 to-pink-600' },
  { name: 'Игры', icon: '🎮', color: 'from-blue-600 to-cyan-600' },
  { name: 'Новости', icon: '📰', color: 'from-red-600 to-orange-600' },
  { name: 'Спорт', icon: '⚽', color: 'from-green-600 to-emerald-600' },
  { name: 'Образование', icon: '📚', color: 'from-yellow-600 to-amber-600' },
  { name: 'Технологии', icon: '💻', color: 'from-indigo-600 to-blue-600' },
];

const trendingVideos = Array.from({ length: 12 }, (_, i) => ({
  id: `explore-${i + 1}`,
  title: ['Популярное видео дня', 'Тренд недели', 'Вирусное видео'][i % 3] + ` #${i + 1}`,
  thumbnail: `https://picsum.photos/seed/explore${i}/640/360`,
  channel: 'TrendChannel' + (i + 1),
  channelAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=explore${i}`,
  views: Math.floor(Math.random() * 2000000) + 100000,
  uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  duration: `${Math.floor(Math.random() * 20) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  verified: i % 2 === 0,
}));

export default function ExplorePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Исследуй</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`bg-gradient-to-br ${category.color} p-6 rounded-xl hover:scale-105 transition-transform`}
          >
            <div className="text-4xl mb-2">{category.icon}</div>
            <div className="font-semibold">{category.name}</div>
          </button>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">В тренде</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {trendingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
