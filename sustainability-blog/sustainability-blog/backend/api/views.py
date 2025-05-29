from rest_framework import viewsets, filters
from rest_framework.authentication import TokenAuthentication # <--- Import this
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post
# Assuming your serializers are in serializers.py relative to views.py
from .serializers import PostListSerializer, PostDetailSerializer 
from django.utils import timezone # Add this import if not present for timezone.now()

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    
    # Add this line
    authentication_classes = [TokenAuthentication] 
    
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'category__name', 'tags__name']
    ordering_fields = ['created_at', 'published_at', 'title']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Post.objects.all()
        if self.action == 'list':
            if not self.request.user.is_staff:
                queryset = queryset.filter(status='published')
        category = self.request.query_params.get('category', None)
        tag = self.request.query_params.get('tag', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostDetailSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context

    def perform_create(self, serializer):
        if serializer.validated_data.get('status') == 'published':
            serializer.validated_data['published_at'] = timezone.now()
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:  # Created
            post_url = response.data.get('url')
            response.data = {
                'url': post_url,
                'message': 'Post created successfully',
                'post': response.data
            }
        return response
