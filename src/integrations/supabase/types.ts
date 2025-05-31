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
      colleague_survey_responses: {
        Row: {
          consent_for_research: boolean | null
          created_at: string
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s: number
          evaluator_department: string | null
          evaluator_email: string | null
          evaluator_name: string | null
          evaluator_position: string | null
          id: string
          is_anonymous: boolean | null
          manager_department: string | null
          manager_name: string
          manager_position: string | null
          organization: string | null
          slq_score: number
        }
        Insert: {
          consent_for_research?: boolean | null
          created_at?: string
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s: number
          evaluator_department?: string | null
          evaluator_email?: string | null
          evaluator_name?: string | null
          evaluator_position?: string | null
          id?: string
          is_anonymous?: boolean | null
          manager_department?: string | null
          manager_name: string
          manager_position?: string | null
          organization?: string | null
          slq_score: number
        }
        Update: {
          consent_for_research?: boolean | null
          created_at?: string
          dimension_a?: number
          dimension_a2?: number
          dimension_i?: number
          dimension_l?: number
          dimension_m?: number
          dimension_s?: number
          evaluator_department?: string | null
          evaluator_email?: string | null
          evaluator_name?: string | null
          evaluator_position?: string | null
          id?: string
          is_anonymous?: boolean | null
          manager_department?: string | null
          manager_name?: string
          manager_position?: string | null
          organization?: string | null
          slq_score?: number
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          consent_for_research: boolean | null
          created_at: string
          department: string | null
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s: number
          id: string
          is_anonymous: boolean | null
          organization: string | null
          position: string | null
          slq_score: number
          strategy: number
          survey_type: string
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          consent_for_research?: boolean | null
          created_at?: string
          department?: string | null
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s?: number
          id?: string
          is_anonymous?: boolean | null
          organization?: string | null
          position?: string | null
          slq_score: number
          strategy: number
          survey_type?: string
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          consent_for_research?: boolean | null
          created_at?: string
          department?: string | null
          dimension_a?: number
          dimension_a2?: number
          dimension_i?: number
          dimension_l?: number
          dimension_m?: number
          dimension_s?: number
          id?: string
          is_anonymous?: boolean | null
          organization?: string | null
          position?: string | null
          slq_score?: number
          strategy?: number
          survey_type?: string
          user_email?: string | null
          user_name?: string | null
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
