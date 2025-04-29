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
      tickets_children: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_children_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_cinema: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_cinema_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_concerts: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_concerts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_festivals: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_festivals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_giftcards: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_giftcards_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_other: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_other_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_sports: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_sports_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_theatre: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_theatre_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_travel: {
        Row: {
          buyer_id: string | null
          category_id: string | null
          created_at: string
          description: string | null
          event_date: string | null
          event_id: string | null
          file_path: string | null
          id: string
          owner_id: string
          price: number
          seat_info: string | null
          seller_id: string
          status: string
          user_id: string
          venue: string | null
        }
        Insert: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id: string
          venue?: string | null
        }
        Update: {
          buyer_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_id?: string | null
          file_path?: string | null
          id?: string
          owner_id?: string
          price?: number
          seat_info?: string | null
          seller_id?: string
          status?: string
          user_id?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_travel_category_id_fkey"
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
