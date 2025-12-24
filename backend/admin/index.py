import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Админ-панель и модерация контента
    Args: event - запрос с httpMethod, body, queryStringParameters
          context - контекст выполнения
    Returns: HTTP ответ с данными для админ-панели
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-User-Role',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers_dict = event.get('headers', {})
    user_role = headers_dict.get('X-User-Role') or headers_dict.get('x-user-role')
    
    if user_role not in ['admin', 'moderator']:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Access denied'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            action = params.get('action', 'stats')
            
            if action == 'stats':
                cur.execute("SELECT COUNT(*) as total_users FROM users")
                users_count = cur.fetchone()['total_users']
                
                cur.execute("SELECT COUNT(*) as total_videos FROM videos")
                videos_count = cur.fetchone()['total_videos']
                
                cur.execute("SELECT COUNT(*) as total_comments FROM comments")
                comments_count = cur.fetchone()['total_comments']
                
                cur.execute("SELECT COUNT(*) as pending_reports FROM reports WHERE status = 'pending'")
                reports_count = cur.fetchone()['pending_reports']
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'stats': {
                            'total_users': users_count,
                            'total_videos': videos_count,
                            'total_comments': comments_count,
                            'pending_reports': reports_count
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'reports':
                cur.execute(
                    """
                    SELECT r.*, 
                           u.name as reporter_name,
                           v.title as video_title,
                           c.text as comment_text
                    FROM reports r
                    LEFT JOIN users u ON r.reporter_id = u.id
                    LEFT JOIN videos v ON r.video_id = v.id
                    LEFT JOIN comments c ON r.comment_id = c.id
                    WHERE r.status = 'pending'
                    ORDER BY r.created_at DESC
                    LIMIT 50
                    """
                )
                reports = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'reports': reports}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'users':
                cur.execute(
                    """
                    SELECT id, email, name, avatar_url, subscribers_count, role, is_verified, created_at
                    FROM users
                    ORDER BY created_at DESC
                    LIMIT 100
                    """
                )
                users = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'users': users}, default=str),
                    'isBase64Encoded': False
                }
            
            elif action == 'videos':
                cur.execute(
                    """
                    SELECT v.*, u.name as channel_name
                    FROM videos v
                    JOIN users u ON v.user_id = u.id
                    ORDER BY v.created_at DESC
                    LIMIT 100
                    """
                )
                videos = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'videos': videos}, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'resolve_report':
                report_id = body_data.get('report_id')
                status = body_data.get('status')
                reviewer_id = body_data.get('reviewer_id')
                
                cur.execute(
                    "UPDATE reports SET status = %s, reviewed_by = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (status, reviewer_id, report_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'update_video_status':
                video_id = body_data.get('video_id')
                status = body_data.get('status')
                
                cur.execute(
                    "UPDATE videos SET status = %s, is_moderated = true WHERE id = %s",
                    (status, video_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'verify_user' and user_role == 'admin':
                user_id = body_data.get('user_id')
                is_verified = body_data.get('is_verified', True)
                
                cur.execute(
                    "UPDATE users SET is_verified = %s WHERE id = %s",
                    (is_verified, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'change_role' and user_role == 'admin':
                user_id = body_data.get('user_id')
                new_role = body_data.get('role')
                
                cur.execute(
                    "UPDATE users SET role = %s WHERE id = %s",
                    (new_role, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid request'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
