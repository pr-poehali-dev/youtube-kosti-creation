import VideoCard from '@/components/VideoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const trendCategories = ['Сейчас', 'Музыка', 'Игры', 'Новости', 'Спорт'];

const generateTrendVideos = (category: string, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${category}-trend-${i + 1}`,
    title: `${category}: Топ видео ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/${category}${i}/640/360`,
    channel: `${category}Channel${i + 1}`,
    channelAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${category}${i}`,
    views: Math.floor(Math.random() * 5000000) + 100000,
    uploadedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    duration: `${Math.floor(Math.random() * 20) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    verified: i % 2 === 0,
  }));

export default function TrendsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">В тренде</h1>
        <p className="text-gray-400">Самые популярные видео на ЮтубКости</p>
      </div>

      <Tabs defaultValue="now" className="space-y-6">
        <TabsList className="bg-[#272727]">
          {trendCategories.map((category) => (
            <TabsTrigger
              key={category}
              value={category.toLowerCase().replace('сейчас', 'now')}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="now">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {generateTrendVideos('now', 16).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>

        {['музыка', 'игры', 'новости', 'спорт'].map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {generateTrendVideos(category, 12).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
