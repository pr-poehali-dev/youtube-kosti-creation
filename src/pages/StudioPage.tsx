import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface StudioPageProps {
  currentUser: any;
}

export default function StudioPage({ currentUser }: StudioPageProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');

  const myVideos = [
    {
      id: '1',
      title: 'Мое первое видео на ЮтубКости',
      thumbnail: 'https://picsum.photos/seed/myvideo1/320/180',
      views: 1234,
      likes: 89,
      comments: 23,
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    console.log('Uploading:', { file: uploadedFile, title: videoTitle, description: videoDescription });
    setUploadedFile(null);
    setVideoTitle('');
    setVideoDescription('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ЮтубКости Студио</h1>
        <p className="text-gray-400">Управляйте своим каналом и контентом</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="bg-[#272727]">
          <TabsTrigger value="upload">Загрузить видео</TabsTrigger>
          <TabsTrigger value="videos">Мои видео</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="settings">Настройки канала</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card className="bg-[#181818] border-[#272727]">
            <CardHeader>
              <CardTitle>Загрузить новое видео</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-[#3f3f3f] rounded-xl p-12 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-semibold mb-2">
                    {uploadedFile ? uploadedFile.name : 'Перетащите видео сюда или нажмите для выбора'}
                  </p>
                  <p className="text-sm text-gray-400">MP4, MOV, AVI (макс. 2GB)</p>
                </label>
              </div>

              {uploadedFile && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="video-title">Название видео</Label>
                    <Input
                      id="video-title"
                      placeholder="Введите название видео"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="bg-[#121212] border-[#3f3f3f]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-description">Описание</Label>
                    <Textarea
                      id="video-description"
                      placeholder="Расскажите зрителям о вашем видео"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      className="bg-[#121212] border-[#3f3f3f] min-h-32"
                    />
                  </div>

                  <Button onClick={handleUpload} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Icon name="Upload" size={20} className="mr-2" />
                    Опубликовать видео
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Мои видео ({myVideos.length})</h2>
            <Button variant="outline" className="border-[#3f3f3f]">
              <Icon name="Filter" size={18} className="mr-2" />
              Фильтр
            </Button>
          </div>

          {myVideos.map((video) => (
            <Card key={video.id} className="bg-[#181818] border-[#272727]">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 aspect-video object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <div className="flex gap-6 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Icon name="Eye" size={16} />
                        {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="ThumbsUp" size={16} />
                        {video.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MessageSquare" size={16} />
                        {video.comments}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-[#3f3f3f]">
                        <Icon name="Edit" size={16} className="mr-1" />
                        Редактировать
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#3f3f3f]">
                        <Icon name="BarChart3" size={16} className="mr-1" />
                        Аналитика
                      </Button>
                      <Button variant="outline" size="sm" className="border-[#3f3f3f] text-red-400">
                        <Icon name="Trash2" size={16} className="mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#181818] border-[#272727]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Просмотры</p>
                    <p className="text-3xl font-bold">12.5K</p>
                  </div>
                  <Icon name="Eye" size={40} className="text-blue-500" />
                </div>
                <p className="text-sm text-green-400 mt-2">+15% за неделю</p>
              </CardContent>
            </Card>

            <Card className="bg-[#181818] border-[#272727]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Подписчики</p>
                    <p className="text-3xl font-bold">{currentUser.subscribers}</p>
                  </div>
                  <Icon name="Users" size={40} className="text-red-500" />
                </div>
                <p className="text-sm text-green-400 mt-2">+24 за неделю</p>
              </CardContent>
            </Card>

            <Card className="bg-[#181818] border-[#272727]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Лайки</p>
                    <p className="text-3xl font-bold">892</p>
                  </div>
                  <Icon name="ThumbsUp" size={40} className="text-green-500" />
                </div>
                <p className="text-sm text-green-400 mt-2">+8% за неделю</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#181818] border-[#272727]">
            <CardHeader>
              <CardTitle>График просмотров</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2">
                {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                  <div key={i} className="flex-1 bg-blue-600 rounded-t" style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="flex justify-around mt-4 text-sm text-gray-400">
                <span>Пн</span>
                <span>Вт</span>
                <span>Ср</span>
                <span>Чт</span>
                <span>Пт</span>
                <span>Сб</span>
                <span>Вс</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-[#181818] border-[#272727]">
            <CardHeader>
              <CardTitle>Информация о канале</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="border-[#3f3f3f]">
                  <Icon name="Upload" size={18} className="mr-2" />
                  Изменить аватар
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel-name">Название канала</Label>
                <Input
                  id="channel-name"
                  defaultValue={currentUser.name}
                  className="bg-[#121212] border-[#3f3f3f]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel-description">Описание канала</Label>
                <Textarea
                  id="channel-description"
                  placeholder="Расскажите о своём канале"
                  className="bg-[#121212] border-[#3f3f3f] min-h-32"
                />
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
