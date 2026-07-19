export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          updated_at?: string
        }
      }
      story_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          color?: string
        }
      }
      stories: {
        Row: {
          id: string
          full_name: string
          age: number
          school: string
          phone_number: string | null
          category_id: string
          title: string
          content: string
          reflection: string
          changemaker_name: string
          changemaker_reason: string
          publish_consent: boolean
          privacy_agreement: boolean
          status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published'
          cover_image_url: string | null
          rejection_reason: string | null
          view_count: number
          is_spotlight: boolean
          admin_notes: string | null
          submitted_at: string
          reviewed_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          age: number
          school: string
          phone_number?: string | null
          category_id: string
          title: string
          content: string
          reflection: string
          changemaker_name: string
          changemaker_reason: string
          publish_consent: boolean
          privacy_agreement: boolean
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'published'
          cover_image_url?: string | null
          rejection_reason?: string | null
          view_count?: number
          is_spotlight?: boolean
          admin_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string
          age?: number
          school?: string
          phone_number?: string | null
          category_id?: string
          title?: string
          content?: string
          reflection?: string
          changemaker_name?: string
          changemaker_reason?: string
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'published'
          cover_image_url?: string | null
          rejection_reason?: string | null
          view_count?: number
          is_spotlight?: boolean
          admin_notes?: string | null
          reviewed_at?: string | null
          published_at?: string | null
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          story_id: string
          author_name: string
          content: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          story_id: string
          author_name: string
          content: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: string
          status?: 'pending' | 'approved' | 'rejected'
          updated_at?: string
        }
      }
      article_categories: {
        Row: {
          id: string
          name: string
          slug: string
          section: 'skin_talk' | 'girl_talk' | 'creators_corner'
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          section: 'skin_talk' | 'girl_talk' | 'creators_corner'
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          section?: 'skin_talk' | 'girl_talk' | 'creators_corner'
          description?: string | null
          color?: string
        }
      }
      article_tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          cover_image_url: string | null
          author_id: string | null
          author_name: string
          category_id: string
          status: 'draft' | 'published'
          view_count: number
          reading_time: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          cover_image_url?: string | null
          author_id?: string | null
          author_name: string
          category_id: string
          status?: 'draft' | 'published'
          view_count?: number
          reading_time?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          cover_image_url?: string | null
          author_name?: string
          category_id?: string
          status?: 'draft' | 'published'
          view_count?: number
          reading_time?: number
          published_at?: string | null
          updated_at?: string
        }
      }
      article_tag_relations: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: never
      }
      weekly_spotlights: {
        Row: {
          id: string
          story_id: string
          week_start: string
          week_end: string
          message: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          week_start: string
          week_end: string
          message?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          story_id?: string
          week_start?: string
          week_end?: string
          message?: string | null
          is_active?: boolean
        }
      }
      changemaker_nominations: {
        Row: {
          id: string
          story_id: string
          nominee_name: string
          nominee_school: string
          reason: string
          month: number
          year: number
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          nominee_name: string
          nominee_school: string
          reason: string
          month: number
          year: number
          created_at?: string
        }
        Update: never
      }
      changemaker_winners: {
        Row: {
          id: string
          name: string
          school: string
          biography: string | null
          photo_url: string | null
          reason: string
          impact: string | null
          inspirational_message: string | null
          month: number
          year: number
          nomination_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          school: string
          biography?: string | null
          photo_url?: string | null
          reason: string
          impact?: string | null
          inspirational_message?: string | null
          month: number
          year: number
          nomination_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          school?: string
          biography?: string | null
          photo_url?: string | null
          reason?: string
          impact?: string | null
          inspirational_message?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          page: string
          referrer: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page: string
          referrer?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          value?: Json
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          admin_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
      media: {
        Row: {
          id: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          bucket: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          bucket: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: never
      }
      audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          old_data: Json | null
          new_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_monthly_changemaker: {
        Args: { p_month: number; p_year: number }
        Returns: {
          nominee_name: string
          nominee_school: string
          reason: string
          nomination_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
