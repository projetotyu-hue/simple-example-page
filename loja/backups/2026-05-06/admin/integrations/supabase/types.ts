export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          category: string | null
          category_id: string | null
          created_at: string
          description: string | null
          discount_percent: number | null
          featured: boolean
          free_shipping: boolean
          id: string
          image_url: string | null
          name: string
          original_price: number | null
          position: number
          price: number
          sales_count: number
          section: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          featured?: boolean
          free_shipping?: boolean
          id?: string
          image_url?: string | null
          name: string
          original_price?: number | null
          position?: number
          price: number
          sales_count?: number
          section?: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          featured?: boolean
          free_shipping?: boolean
          id?: string
          image_url?: string | null
          name?: string
          original_price?: number | null
          position?: number
          price?: number
          sales_count?: number
          section?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          cpf: string | null
          orders_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          cpf?: string | null
          orders_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          cpf?: string | null
          orders_count?: number | null
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          products_total: number | null
          shipping_total: number | null
          discount_total: number | null
          total: number | null
          status: string | null
          created_at: string
          payment_id: string | null
          items: Json | null
        }
        Insert: {
          id?: string
          customer_id?: string | null
          products_total?: number | null
          shipping_total?: number | null
          discount_total?: number | null
          total?: number | null
          status?: string | null
          created_at?: string
          payment_id?: string | null
          items?: Json | null
        }
        Update: {
          id?: string
          customer_id?: string | null
          products_total?: number | null
          shipping_total?: number | null
          discount_total?: number | null
          total?: number | null
          status?: string | null
          created_at?: string
          payment_id?: string | null
          items?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string | null
          customer_id: string | null
          amount: number
          status: string
          payment_method: string | null
          gateway_transaction_id: string | null
          gateway_response: Json | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          customer_id?: string | null
          amount: number
          status: string
          payment_method?: string | null
          gateway_transaction_id?: string | null
          gateway_response?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          customer_id?: string | null
          amount?: number
          status?: string
          payment_method?: string | null
          gateway_transaction_id?: string | null
          gateway_response?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          id: string
          session_id: string | null
          customer_id: string | null
          event_type: string
          product_id: string | null
          order_id: string | null
          payment_id: string | null
          funnel_step: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id?: string | null
          customer_id?: string | null
          event_type: string
          product_id?: string | null
          order_id?: string | null
          payment_id?: string | null
          funnel_step?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string | null
          customer_id?: string | null
          event_type?: string
          product_id?: string | null
          order_id?: string | null
          payment_id?: string | null
          funnel_step?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          id: string
          shop_name: string | null
          logo_url: string | null
          sold_count: string | null
          tracking_link: string | null
          head_script: string | null
          cnpj: string | null
          address: string | null
          email: string | null
          phone: string | null
          hours: string | null
          rating: string | null
          followers: string | null
          updated_at: string
          tiktok_pixel_id: string | null
          whosamungus_id: string | null
          gateway_mode: string | null
          gateway_secret_key: string | null
          shipping_rates: Json | null
          upsells: Json | null
          protection_product: Json | null
        }
        Insert: {
          id?: string
          shop_name?: string | null
          logo_url?: string | null
          sold_count?: string | null
          tracking_link?: string | null
          head_script?: string | null
          cnpj?: string | null
          address?: string | null
          email?: string | null
          phone?: string | null
          hours?: string | null
          rating?: string | null
          followers?: string | null
          updated_at?: string
          tiktok_pixel_id?: string | null
          whosamungus_id?: string | null
          gateway_mode?: string | null
          gateway_secret_key?: string | null
          shipping_rates?: Json | null
          upsells?: Json | null
          protection_product?: Json | null
        }
        Update: {
          id?: string
          shop_name?: string | null
          logo_url?: string | null
          sold_count?: string | null
          tracking_link?: string | null
          head_script?: string | null
          cnpj?: string | null
          address?: string | null
          email?: string | null
          phone?: string | null
          hours?: string | null
          rating?: string | null
          followers?: string | null
          updated_at?: string
          tiktok_pixel_id?: string | null
          whosamungus_id?: string | null
          gateway_mode?: string | null
          gateway_secret_key?: string | null
          shipping_rates?: Json | null
          upsells?: Json | null
          protection_product?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_revenue_analytics: {
        Args: {
          period: string
          start_date: string
          end_date: string
        }
        Returns: {
          period_label: string
          period_start: string
          revenue: number
          count: number
        }[]
      }
      get_conversion_analytics: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          code_generated: number
          payments_completed: number
          conversion_rate: number
        }[]
      }
      get_funnel_analytics: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          funnel_step: string
          event_count: number
          abandonment_count: number
        }[]
      }
      get_top_products: {
        Args: {
          limit_count: number
          start_date: string
          end_date: string
        }
        Returns: {
          product_id: string
          product_name: string
          quantity_sold: number
          revenue: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
