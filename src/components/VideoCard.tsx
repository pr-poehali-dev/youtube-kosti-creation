import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
    channel: string;
    channelAvatar: string;
    views: number;
    uploadedAt: Date;
    duration: string;
    verified?: boolean;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const navigate = useNavigate();

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div 
      className="group cursor-pointer animate-fade-in"
      onClick={() => navigate(`/video/${video.id}`)}
    >
      <div className="relative overflow-hidden rounded-xl mb-3">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-semibold">
          {video.duration}
        </div>
      </div>

      <div className="flex gap-3">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={video.channelAvatar} />
          <AvatarFallback>{video.channel[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-gray-300 transition-colors mb-1">
            {video.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>{video.channel}</span>
            {video.verified && (
              <Icon name="BadgeCheck" size={14} className="text-gray-400" />
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {formatViews(video.views)} просмотров • {formatDistanceToNow(video.uploadedAt, { locale: ru, addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
}
