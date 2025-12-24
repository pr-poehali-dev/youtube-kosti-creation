import json
import os
import base64
import psycopg2
import boto3
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime

s3 = boto3.client('s3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Работа с видео: загрузка, получение, удаление
    Args: event - запрос с httpMethod, body, queryStringParameters
          context - контекст выполнения
    Returns: HTTP ответ с данными видео
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            video_id = params.get('id')
            user_id = params.get('user_id')
            category = params.get('category')
            limit = int(params.get('limit', 20))
            
            if video_id:
                cur.execute(
                    """
                    SELECT v.*, u.name as channel_name, u.avatar_url as channel_avatar, u.subscribers_count 
                    FROM videos v 
                    JOIN users u ON v.user_id = u.id 
                    WHERE v.id = %s AND v.status = 'published'
                    """,
                    (video_id,)
                )
                video = cur.fetchone()
                
                if video:
                    cur.execute("UPDATE videos SET views_count = views_count + 1 WHERE id = %s", (video_id,))
                    conn.commit()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'video': dict(video)}, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Video not found'}),
                        'isBase64Encoded': False
                    }
            
            query = """
                SELECT v.*, u.name as channel_name, u.avatar_url as channel_avatar, u.is_verified 
                FROM videos v 
                JOIN users u ON v.user_id = u.id 
                WHERE v.status = 'published'
            """
            query_params = []
            
            if user_id:
                query += " AND v.user_id = %s"
                query_params.append(user_id)
            
            if category:
                query += " AND v.category = %s"
                query_params.append(category)
            
            query += " ORDER BY v.created_at DESC LIMIT %s"
            query_params.append(limit)
            
            cur.execute(query, query_params)
            videos = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'videos': videos}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            title = body_data.get('title')
            description = body_data.get('description', '')
            video_base64 = body_data.get('video_base64')
            thumbnail_base64 = body_data.get('thumbnail_base64')
            duration = body_data.get('duration', 0)
            category = body_data.get('category', 'Другое')
            
            if not user_id or not title or not video_base64:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            video_data = base64.b64decode(video_base64)
            video_filename = f'videos/{user_id}/{datetime.now().timestamp()}.mp4'
            
            s3.put_object(
                Bucket='files',
                Key=video_filename,
                Body=video_data,
                ContentType='video/mp4'
            )
            
            video_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{video_filename}"
            
            thumbnail_url = None
            if thumbnail_base64:
                thumbnail_data = base64.b64decode(thumbnail_base64)
                thumbnail_filename = f'thumbnails/{user_id}/{datetime.now().timestamp()}.jpg'
                s3.put_object(
                    Bucket='files',
                    Key=thumbnail_filename,
                    Body=thumbnail_data,
                    ContentType='image/jpeg'
                )
                thumbnail_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{thumbnail_filename}"
            
            cur.execute(
                """
                INSERT INTO videos (user_id, title, description, video_url, thumbnail_url, duration, category) 
                VALUES (%s, %s, %s, %s, %s, %s, %s) 
                RETURNING id, title, description, video_url, thumbnail_url, duration, views_count, likes_count, created_at
                """,
                (user_id, title, description, video_url, thumbnail_url, duration, category)
            )
            video = dict(cur.fetchone())
            conn.commit()
            
            cur.execute(
                """
                INSERT INTO notifications (user_id, type, title, message, link)
                SELECT s.subscriber_id, 'new_video', %s, %s, %s
                FROM subscriptions s
                WHERE s.channel_id = %s
                """,
                (f'Новое видео от канала', title, f'/video/{video["id"]}', user_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'video': video}, default=str),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
