export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cover_letters: {
        Row: {
          company_name: string | null
          content: string
          created_at: string | null
          id: string
          position_title: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          content: string
          created_at?: string | null
          id?: string
          position_title?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          content?: string
          created_at?: string | null
          id?: string
          position_title?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string
          description: string | null
          field_of_study: string | null
          gpa: string | null
          graduation_date: string | null
          id: string
          institution_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          degree: string
          description?: string | null
          field_of_study?: string | null
          gpa?: string | null
          graduation_date?: string | null
          id?: string
          institution_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          degree?: string
          description?: string | null
          field_of_study?: string | null
          gpa?: string | null
          graduation_date?: string | null
          id?: string
          institution_name?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_date: string | null
          company_name: string
          created_at: string | null
          id: string
          job_url: string | null
          location: string | null
          notes: string | null
          position_title: string
          salary_range: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_date?: string | null
          company_name: string
          created_at?: string | null
          id?: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          position_title: string
          salary_range?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_date?: string | null
          company_name?: string
          created_at?: string | null
          id?: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          position_title?: string
          salary_range?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          summary: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          summary?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          summary?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          template_id: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          template_id?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          template_id?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          skill_level: string | null
          skill_name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          skill_level?: string | null
          skill_name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          skill_level?: string | null
          skill_name?: string
          user_id?: string
        }
        Relationships: []
      }
      work_experience: {
        Row: {
          company_name: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          position_title: string
          start_date: string | null
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position_title: string
          start_date?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position_title?: string
          start_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
