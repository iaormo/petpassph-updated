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
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          duration: number
          ghl_appointment_id: string | null
          id: string
          notes: string | null
          owner_email: string
          pet_id: string
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          duration?: number
          ghl_appointment_id?: string | null
          id?: string
          notes?: string | null
          owner_email: string
          pet_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          duration?: number
          ghl_appointment_id?: string | null
          id?: string
          notes?: string | null
          owner_email?: string
          pet_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          channel_id: string | null
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string | null
          sender_id: string
        }
        Insert: {
          channel_id?: string | null
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string | null
          sender_id: string
        }
        Update: {
          channel_id?: string | null
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "prayer_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      go_high_level_config: {
        Row: {
          api_key: string
          company_id: string | null
          created_at: string
          id: string
          location_id: string | null
        }
        Insert: {
          api_key: string
          company_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
        }
        Update: {
          api_key?: string
          company_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
        }
        Relationships: []
      }
      prayer_channel_members: {
        Row: {
          channel_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_channel_members_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "prayer_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_channels: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_private: boolean
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean
          name?: string
        }
        Relationships: []
      }
      prayers: {
        Row: {
          body: string
          channel_id: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          prayed_count: number
          private: boolean
          status: string
          title: string
          user_id: string
          username: string | null
        }
        Insert: {
          body: string
          channel_id?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          prayed_count?: number
          private?: boolean
          status?: string
          title: string
          user_id: string
          username?: string | null
        }
        Update: {
          body?: string
          channel_id?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          prayed_count?: number
          private?: boolean
          status?: string
          title?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayers_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "prayer_channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_prayer_channel: {
        Args: {
          channel_name: string
          channel_description: string
          is_private_channel: boolean
          creator_id: string
        }
        Returns: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_private: boolean
          name: string
        }
      }
      get_user_channels: {
        Args: { user_id: string }
        Returns: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_private: boolean
          name: string
        }[]
      }
      invite_user_to_channel: {
        Args: { channel_id: string; invitee_email: string; inviter_id: string }
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
