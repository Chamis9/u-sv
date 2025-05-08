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
      activity_log: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          email: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          email?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_user: {
        Row: {
          created_at: string
          email: string | null
          id: string
          password: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          password?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          password?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          priority: number | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          priority?: number | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          priority?: number | null
          status?: string
        }
        Relationships: []
      }
      deleted_tickets: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          category_name: string | null
          created_at: string
          deleted_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          event_time: string | null
          file_path: string | null
          id: string
          original_id: string
          owner_id: string
          price: number
          price_per_unit: number
          quantity: number
          seat_info: string | null
          seller_id: string
          status: string
          title: string | null
          updated_at: string | null
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at: string
          deleted_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          event_time?: string | null
          file_path?: string | null
          id?: string
          original_id: string
          owner_id: string
          price: number
          price_per_unit?: number
          quantity?: number
          seat_info?: string | null
          seller_id: string
          status?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string
          deleted_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          event_time?: string | null
          file_path?: string | null
          id?: string
          original_id?: string
          owner_id?: string
          price?: number
          price_per_unit?: number
          quantity?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string | null
          id: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
        }
        Relationships: []
      }
      registered_users: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          last_sign_in_at: string | null
          phone: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_sign_in_at?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          category_name: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          event_time: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          price_per_unit: number
          quantity: number
          seat_info: string | null
          seller_id: string
          status: string
          title: string | null
          updated_at: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          event_time?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          price_per_unit?: number
          quantity?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          category_name?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          event_time?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          price_per_unit?: number
          quantity?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          title?: string | null
          updated_at?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_email_exists: {
        Args: { check_email: string }
        Returns: boolean
      }
      check_phone_exists: {
        Args: { check_phone: string }
        Returns: boolean
      }
      check_user_exists_by_email: {
        Args: { check_email: string }
        Returns: boolean
      }
      get_activities: {
        Args: { page_size: number; page_number: number }
        Returns: Json[]
      }
      get_activity_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_recent_activities: {
        Args: { limit_num: number }
        Returns: Json[]
      }
      log_activity: {
        Args: {
          p_activity_type: string
          p_description: string
          p_user_id: string
          p_email: string
          p_metadata: Json
        }
        Returns: undefined
      }
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
