import hmac
import hashlib
import json
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone
from blog.models import Post, Category, Tag

def verify_webhook_signature(request):
    if 'HTTP_X_HUB_SIGNATURE' not in request.META:
        return False
    
    signature = request.META['HTTP_X_HUB_SIGNATURE']
    if not signature.startswith('sha1='):
        return False
    
    expected = signature[5:]
    secret = getattr(settings, 'WEBHOOK_SECRET', '').encode()
    computed = hmac.new(secret, request.body, hashlib.sha1).hexdigest()
    
    return hmac.compare_digest(computed, expected)

@csrf_exempt
@require_POST
def content_webhook(request):
    if not verify_webhook_signature(request):
        return HttpResponseBadRequest('Invalid signature')
    
    try:
        payload = json.loads(request.body)
        action = payload.get('action')
        content = payload.get('content', {})
        
        if action == 'create_post':
            category, _ = Category.objects.get_or_create(
                name=content.get('category', 'Uncategorized'),
                defaults={'description': ''}
            )
            
            tags = []
            for tag_name in content.get('tags', []):
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                tags.append(tag)
            
            post = Post.objects.create(
                title=content['title'],
                content=content['content'],
                excerpt=content.get('excerpt', ''),
                category=category,
                status=content.get('status', 'draft'),
                author_id=content.get('author_id', 1)  # Default to first admin
            )
            
            if tags:
                post.tags.set(tags)
            
            if post.status == 'published':
                post.published_at = timezone.now()
                post.save()
                
            return HttpResponse('Post created successfully')
            
        elif action == 'update_post':
            try:
                post = Post.objects.get(id=content['id'])
                
                if 'category' in content:
                    category, _ = Category.objects.get_or_create(
                        name=content['category'],
                        defaults={'description': ''}
                    )
                    post.category = category
                
                if 'tags' in content:
                    tags = []
                    for tag_name in content['tags']:
                        tag, _ = Tag.objects.get_or_create(name=tag_name)
                        tags.append(tag)
                    post.tags.set(tags)
                
                update_fields = ['title', 'content', 'excerpt', 'status']
                for field in update_fields:
                    if field in content:
                        setattr(post, field, content[field])
                
                if content.get('status') == 'published' and not post.published_at:
                    post.published_at = timezone.now()
                
                post.save()
                return HttpResponse('Post updated successfully')
                
            except Post.DoesNotExist:
                return HttpResponseBadRequest('Post not found')
                
        elif action == 'delete_post':
            try:
                post = Post.objects.get(id=content['id'])
                post.delete()
                return HttpResponse('Post deleted successfully')
            except Post.DoesNotExist:
                return HttpResponseBadRequest('Post not found')
        
        return HttpResponseBadRequest('Invalid action')
        
    except (json.JSONDecodeError, KeyError) as e:
        return HttpResponseBadRequest(f'Invalid payload: {str(e)}')