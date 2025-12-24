import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminPageProps {
  currentUser: any;
}

export default function AdminPage({ currentUser }: AdminPageProps) {
  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator')) {
      fetchStats();
      fetchReports();
      fetchUsers();
      fetchVideos();
    }
  }, [currentUser]);

  const fetchStats = async () => {
    const response = await fetch('https://functions.poehali.dev/cdb0387a-0e1c-4752-8b13-b3b1f98b1cb4?action=stats', {
      headers: {
        'X-User-Role': currentUser.role,
      },
    });
    const data = await response.json();
    setStats(data.stats);
  };

  const fetchReports = async () => {
    const response = await fetch('https://functions.poehali.dev/cdb0387a-0e1c-4752-8b13-b3b1f98b1cb4?action=reports', {
      headers: {
        'X-User-Role': currentUser.role,
      },
    });
    const data = await response.json();
    setReports(data.reports || []);
  };

  const fetchUsers = async () => {
    const response = await fetch('https://functions.poehali.dev/cdb0387a-0e1c-4752-8b13-b3b1f98b1cb4?action=users', {
      headers: {
        'X-User-Role': currentUser.role,
      },
    });
    const data = await response.json();
    setUsers(data.users || []);
  };

  const fetchVideos = async () => {
    const response = await fetch('https://functions.poehali.dev/cdb0387a-0e1c-4752-8b13-b3b1f98b1cb4?action=videos', {
      headers: {
        'X-User-Role': currentUser.role,
      },
    });
    const data = await response.json();
    setVideos(data.videos || []);
  };

  const handleResolveReport = async (reportId: number, status: string) => {
    await fetch('https://functions.poehali.dev/cdb0387a-0e1c-4752-8b13-b3b1f98b1cb4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': currentUser.role,
      },
      body: JSON.stringify({
        action: 'resolve_report',
        report_id: reportId,
        status,
        reviewer_id: currentUser.id,
      }),
    });
    fetchReports();
  };

  const handleUpdateVideoStatus = async (videoId: number, status: string) => {
    await fetch('https://functions.poehali.dev/cdb0387a-0e1c-4752-8b13-b3b1f98b1cb4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': currentUser.role,
      },
      body: JSON.stringify({
        action: 'update_video_status',
        video_id: videoId,
        status,
      }),
    });
    fetchVideos();
  };

  const handleVerifyUser = async (userId: number, isVerified: boolean) => {
    await fetch('https://functions.poehali.dev/cdb0387a-0e1c-4752-8b13-b3b1f98b1cb4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Role': currentUser.role,
      },
      body: JSON.stringify({
        action: 'verify_user',
        user_id: userId,
        is_verified: isVerified,
      }),
    });
    fetchUsers();
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {currentUser.role === 'admin' ? 'Админ-панель' : 'Модератор-панель'}
        </h1>
        <p className="text-gray-400">Управление платформой ЮтубКости</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#181818] border-[#272727]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Пользователи</p>
                  <p className="text-3xl font-bold">{stats.total_users}</p>
                </div>
                <Icon name="Users" size={40} className="text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-[#272727]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Видео</p>
                  <p className="text-3xl font-bold">{stats.total_videos}</p>
                </div>
                <Icon name="Video" size={40} className="text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-[#272727]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Комментарии</p>
                  <p className="text-3xl font-bold">{stats.total_comments}</p>
                </div>
                <Icon name="MessageSquare" size={40} className="text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-[#272727]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Жалобы</p>
                  <p className="text-3xl font-bold text-yellow-500">{stats.pending_reports}</p>
                </div>
                <Icon name="Flag" size={40} className="text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="bg-[#272727]">
          <TabsTrigger value="reports">Жалобы ({reports.length})</TabsTrigger>
          <TabsTrigger value="videos">Видео</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card className="bg-[#181818] border-[#272727]">
            <CardHeader>
              <CardTitle>Жалобы на модерацию</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#272727]">
                    <TableHead>ID</TableHead>
                    <TableHead>От кого</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Причина</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} className="border-[#272727]">
                      <TableCell>{report.id}</TableCell>
                      <TableCell>{report.reporter_name}</TableCell>
                      <TableCell>
                        <Badge variant={report.video_id ? 'default' : 'secondary'}>
                          {report.video_id ? 'Видео' : 'Комментарий'}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{new Date(report.created_at).toLocaleDateString('ru-RU')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-500"
                            onClick={() => handleResolveReport(report.id, 'approved')}
                          >
                            Одобрить
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500"
                            onClick={() => handleResolveReport(report.id, 'rejected')}
                          >
                            Отклонить
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card className="bg-[#181818] border-[#272727]">
            <CardHeader>
              <CardTitle>Управление видео</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#272727]">
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Канал</TableHead>
                    <TableHead>Просмотры</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id} className="border-[#272727]">
                      <TableCell>{video.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{video.title}</TableCell>
                      <TableCell>{video.channel_name}</TableCell>
                      <TableCell>{video.views_count}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            video.status === 'published'
                              ? 'default'
                              : video.status === 'blocked'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {video.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={video.status}
                          onValueChange={(value) => handleUpdateVideoStatus(video.id, value)}
                        >
                          <SelectTrigger className="w-32 bg-[#121212] border-[#3f3f3f]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#282828] border-[#3f3f3f]">
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-[#181818] border-[#272727]">
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#272727]">
                    <TableHead>ID</TableHead>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Подписчики</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Верификация</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-[#272727]">
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.subscribers_count}</TableCell>
                      <TableCell>
                        <Badge>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {currentUser.role === 'admin' && (
                          <Button
                            size="sm"
                            variant={user.is_verified ? 'default' : 'outline'}
                            onClick={() => handleVerifyUser(user.id, !user.is_verified)}
                          >
                            {user.is_verified ? (
                              <Icon name="BadgeCheck" size={16} />
                            ) : (
                              <Icon name="Shield" size={16} />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
