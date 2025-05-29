from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication # <--- NEW IMPORT
from django.utils import timezone
from blog.models import Category, Tag, Post
from .serializers import (
    CategorySerializer, TagSerializer,
    PostListSerializer, PostDetailSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    
    # ADDED: This tells DRF to use TokenAuthentication for this ViewSet
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
        # Ensure 'published_at' is set if status is 'published'
        if serializer.validated_data.get('status') == 'published':
            serializer.validated_data['published_at'] = timezone.now()
        
        # Assign the authenticated user as the author
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        # Custom response formatting for the create action
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:  # Created
            post_url = response.data.get('url') # Assuming PostDetailSerializer provides a 'url' field
            response.data = {
                'url': post_url,
                'message': 'Post created successfully',
                'post': response.data # Include the full post data in a nested 'post' key
            }
        return response
