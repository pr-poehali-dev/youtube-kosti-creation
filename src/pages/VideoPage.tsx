import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import VideoCard from '@/components/VideoCard';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface VideoPageProps {
  currentUser: any;
}

export default function VideoPage({ currentUser }: VideoPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Алексей',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      text: 'Отличное видео! Очень полезная информация',
      likes: 45,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      author: 'Мария',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      text: 'Спасибо за контент, ждём продолжение!',
      likes: 23,
      uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ]);

  const video = {
    id,
    title: 'Как создать свой YouTube канал с нуля в 2024',
    channel: 'TechMaster',
    channelAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techmaster',
    subscribers: '1.2M',
    views: 125000,
    likes: 5420,
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: 'В этом видео я расскажу как с нуля создать YouTube канал и начать зарабатывать. Мы рассмотрим все этапы: от регистрации до монетизации канала.\n\nТайм-коды:\n0:00 Введение\n1:30 Регистрация канала\n5:15 Настройка профиля\n10:20 Первое видео\n15:45 Продвижение',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  };

  const relatedVideos = Array.from({ length: 10 }, (_, i) => ({
    id: `related-${i + 1}`,
    title: ['Секреты монетизации YouTube', 'Лучшее оборудование для блогера', 'SEO для YouTube'][i % 3],
    thumbnail: `https://picsum.photos/seed/related${i}/320/180`,
    channel: 'Channel ' + (i + 1),
    channelAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=related${i}`,
    views: Math.floor(Math.random() * 500000) + 1000,
    uploadedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
    duration: `${Math.floor(Math.random() * 15) + 5}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    verified: i % 2 === 0,
  }));

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: String(comments.length + 1),
      author: currentUser?.name || 'Гость',
      avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
      text: commentText,
      likes: 0,
      uploadedAt: new Date(),
    };
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)} млн`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)} тыс.`;
    return views.toString();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
      <div className="flex-1 w-full lg:w-auto">
        <div className="bg-black rounded-xl overflow-hidden mb-4">
          <video 
            controls 
            className="w-full aspect-video"
            poster={`https://picsum.photos/seed/${id}/1280/720`}
          >
            <source src={video.videoUrl} type="video/mp4" />
          </video>
        </div>

        <h1 className="text-xl font-bold mb-3">{video.title}</h1>

        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-1 w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={video.channelAvatar} />
              <AvatarFallback>{video.channel[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{video.channel}</div>
              <div className="text-xs text-gray-400">{video.subscribers} подписчиков</div>
            </div>
            <Button
              onClick={() => setSubscribed(!subscribed)}
              className={subscribed ? 'bg-[#272727] hover:bg-[#3f3f3f]' : 'bg-red-600 hover:bg-red-700'}
            >
              {subscribed ? 'Вы подписаны' : 'Подписаться'}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
              <Button
                variant="ghost"
                className={`rounded-none hover:bg-[#3f3f3f] ${liked ? 'text-blue-500' : ''}`}
                onClick={handleLike}
              >
                <Icon name="ThumbsUp" size={20} className="mr-2" />
                {video.likes + (liked ? 1 : 0)}
              </Button>
              <Separator orientation="vertical" className="h-6 bg-[#3f3f3f]" />
              <Button
                variant="ghost"
                className={`rounded-none hover:bg-[#3f3f3f] ${disliked ? 'text-red-500' : ''}`}
                onClick={handleDislike}
              >
                <Icon name="ThumbsDown" size={20} />
              </Button>
            </div>

            <Button variant="ghost" className="bg-[#272727] hover:bg-[#3f3f3f] rounded-full hidden sm:flex">
              <Icon name="Share2" size={20} className="mr-2" />
              Поделиться
            </Button>
            <Button variant="ghost" size="icon" className="bg-[#272727] hover:bg-[#3f3f3f] rounded-full sm:hidden">
              <Icon name="Share2" size={20} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="bg-[#272727] hover:bg-[#3f3f3f] rounded-full" size="icon">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#282828] border-[#3f3f3f]">
                <DropdownMenuItem className="cursor-pointer">
                  <Icon name="Flag" size={18} className="mr-2" />
                  Пожаловаться
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Icon name="ListPlus" size={18} className="mr-2" />
                  Добавить в плейлист
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-[#272727] rounded-xl p-4 mb-6">
          <div className="font-semibold mb-2">
            {formatViews(video.views)} просмотров • {formatDistanceToNow(video.uploadedAt, { locale: ru, addSuffix: true })}
          </div>
          <p className={`whitespace-pre-line ${!showFullDescription && 'line-clamp-3'}`}>
            {video.description}
          </p>
          <Button
            variant="ghost"
            className="mt-2 text-gray-400 hover:text-white"
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? 'Свернуть' : 'Показать полностью'}
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">{comments.length} комментариев</h2>

          {currentUser ? (
            <div className="flex gap-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Добавить комментарий..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-transparent border-b border-[#3f3f3f] rounded-none resize-none focus:border-white"
                  rows={2}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setCommentText('')}
                    disabled={!commentText.trim()}
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Комментировать
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400">
              Войдите, чтобы оставить комментарий
            </div>
          )}

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{comment.author}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(comment.uploadedAt, { locale: ru, addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{comment.text}</p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Icon name="ThumbsUp" size={16} className="mr-1" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Icon name="ThumbsDown" size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Ответить
                    </Button>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Icon name="MoreVertical" size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#282828] border-[#3f3f3f]">
                    <DropdownMenuItem className="cursor-pointer text-red-400">
                      <Icon name="Flag" size={16} className="mr-2" />
                      Пожаловаться
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="grid grid-cols-1 gap-2">
          {relatedVideos.map((video) => (
            <div
              key={video.id}
              className="flex gap-2 cursor-pointer group"
              onClick={() => navigate(`/video/${video.id}`)}
            >
              <div className="relative w-40 flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-xs font-semibold">
                  {video.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h3>
                <div className="text-xs text-gray-400">{video.channel}</div>
                <div className="text-xs text-gray-400">
                  {formatViews(video.views)} • {formatDistanceToNow(video.uploadedAt, { locale: ru, addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}