import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Лайки, дизлайки, комментарии, подписки
    Args: event - запрос с httpMethod, body
          context - контекст выполнения
    Returns: HTTP ответ с результатом действия
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            user_id = body_data.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id required'}),
                    'isBase64Encoded': False
                }
            
            if action == 'like_video':
                video_id = body_data.get('video_id')
                is_like = body_data.get('is_like', True)
                
                cur.execute(
                    "SELECT * FROM video_likes WHERE video_id = %s AND user_id = %s",
                    (video_id, user_id)
                )
                existing = cur.fetchone()
                
                if existing:
                    cur.execute(
                        "UPDATE video_likes SET is_like = %s WHERE video_id = %s AND user_id = %s",
                        (is_like, video_id, user_id)
                    )
                else:
                    cur.execute(
                        "INSERT INTO video_likes (video_id, user_id, is_like) VALUES (%s, %s, %s)",
                        (video_id, user_id, is_like)
                    )
                
                cur.execute(
                    """
                    UPDATE videos SET 
                        likes_count = (SELECT COUNT(*) FROM video_likes WHERE video_id = %s AND is_like = true),
                        dislikes_count = (SELECT COUNT(*) FROM video_likes WHERE video_id = %s AND is_like = false)
                    WHERE id = %s
                    """,
                    (video_id, video_id, video_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'comment':
                video_id = body_data.get('video_id')
                text = body_data.get('text')
                parent_id = body_data.get('parent_comment_id')
                
                cur.execute(
                    "INSERT INTO comments (video_id, user_id, text, parent_comment_id) VALUES (%s, %s, %s, %s) RETURNING id, text, created_at",
                    (video_id, user_id, text, parent_id)
                )
                comment = dict(cur.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'comment': comment}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'subscribe':
                channel_id = body_data.get('channel_id')
                
                cur.execute(
                    "SELECT * FROM subscriptions WHERE subscriber_id = %s AND channel_id = %s",
                    (user_id, channel_id)
                )
                existing = cur.fetchone()
                
                if existing:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'subscribed': True}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (%s, %s)",
                    (user_id, channel_id)
                )
                
                cur.execute(
                    "UPDATE users SET subscribers_count = subscribers_count + 1 WHERE id = %s",
                    (channel_id,)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'subscribed': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'report':
                video_id = body_data.get('video_id')
                comment_id = body_data.get('comment_id')
                reason = body_data.get('reason')
                description = body_data.get('description', '')
                
                cur.execute(
                    "INSERT INTO reports (reporter_id, video_id, comment_id, reason, description) VALUES (%s, %s, %s, %s, %s)",
                    (user_id, video_id, comment_id, reason, description)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid action'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            video_id = params.get('video_id')
            
            if video_id:
                cur.execute(
                    """
                    SELECT c.*, u.name as author_name, u.avatar_url as author_avatar 
                    FROM comments c 
                    JOIN users u ON c.user_id = u.id 
                    WHERE c.video_id = %s AND c.parent_comment_id IS NULL 
                    ORDER BY c.created_at DESC
                    """,
                    (video_id,)
                )
                comments = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'comments': comments}, default=str),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
