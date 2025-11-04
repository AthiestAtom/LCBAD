export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_story_reads: {
        Row: {
          id: string
          read_at: string
          story_id: string
          user_id: string
        }
        Insert: {
          id?: string
          read_at?: string
          story_id: string
          user_id: string
        }
        Update: {
          id?: string
          read_at?: string
          story_id?: string
          user_id?: string
        }
        Relationships: []
      }
      anonymous_online_users: {
        Row: {
          id: string;
          public_key: string;
          pseudonym: string;
          last_seen: string;
          is_online: boolean;
        };
        Insert: {
          id?: string;
          public_key: string;
          pseudonym: string;
          last_seen?: string;
          is_online?: boolean;
        };
        Update: {
          id?: string;
          public_key?: string;
          pseudonym?: string;
          last_seen?: string;
          is_online?: boolean;
        };
        Relationships: [];
      };
      anonymous_messages: {
        Row: {
          id: string;
          sender_public_key: string;
          receiver_public_key: string;
          content: string;
          encrypted_content: string | null;
          message_type: string;
          ipfs_hash: string | null;
          sequence_number: number;
          created_at: string;
          updated_at: string;
          is_ephemeral: boolean;
          expires_at: string | null;
          is_burned: boolean;
          burned_at: string | null;
          is_delivered: boolean;
          delivered_at: string | null;
          is_read: boolean;
          read_at: string | null;
          edited_at: string | null;
          reply_to_message_id: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          sender_public_key: string;
          receiver_public_key: string;
          content: string;
          encrypted_content?: string | null;
          message_type?: string;
          ipfs_hash?: string | null;
          sequence_number?: number;
          created_at?: string;
          updated_at?: string;
          is_ephemeral?: boolean;
          expires_at?: string | null;
          is_burned?: boolean;
          burned_at?: string | null;
          is_delivered?: boolean;
          delivered_at?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          edited_at?: string | null;
          reply_to_message_id?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          sender_public_key?: string;
          receiver_public_key?: string;
          content?: string;
          encrypted_content?: string | null;
          message_type?: string;
          ipfs_hash?: string | null;
          sequence_number?: number;
          created_at?: string;
          updated_at?: string;
          is_ephemeral?: boolean;
          expires_at?: string | null;
          is_burned?: boolean;
          burned_at?: string | null;
          is_delivered?: boolean;
          delivered_at?: string | null;
          is_read?: boolean;
          read_at?: string | null;
          edited_at?: string | null;
          reply_to_message_id?: string | null;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "anonymous_messages_reply_to_message_id_fkey";
            columns: ["reply_to_message_id"];
            isOneToOne: false;
            referencedRelation: "anonymous_messages";
            referencedColumns: ["id"];
          }
        ];
      };
      anonymous_typing_indicators: {
        Row: {
          id: string;
          sender_public_key: string;
          receiver_public_key: string;
          is_typing: boolean;
          started_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          sender_public_key: string;
          receiver_public_key: string;
          is_typing?: boolean;
          started_at?: string;
          expires_at?: string;
        };
        Update: {
          id?: string;
          sender_public_key?: string;
          receiver_public_key?: string;
          is_typing?: boolean;
          started_at?: string;
          expires_at?: string;
        };
        Relationships: [];
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_unread_count: {
        Args: {
          receiver_key: string;
        };
        Returns: number;
      };
      mark_messages_as_read: {
        Args: {
          receiver_key: string;
          sender_key: string;
          read_before?: string;
        };
        Returns: number;
      };
      cleanup_expired_typing_indicators: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      cleanup_expired_messages: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

