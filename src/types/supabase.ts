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
      clinical_sessions: {
        Row: {
          applied_apparatus: string | null
          archived_at: string | null
          asepsis: string | null
          cleaning: string | null
          closed_comedones: boolean
          consultation_reason: string | null
          created_at: string
          created_by: string
          date: string
          diagnosis: string | null
          excoriations: boolean
          exfoliation: string | null
          extractions: string | null
          final_product: string | null
          goals: string | null
          home_care_day: string | null
          home_care_night: string | null
          id: string
          last_saved_at: string
          macules: boolean
          mask: string | null
          massages: string | null
          milium_cysts: boolean
          nodules: boolean
          open_comedones: boolean
          pa: string | null
          papules: boolean
          patient_id: string
          pustules: boolean
          return_to_eudermia: string | null
          scars: boolean
          sebaceous_cysts: boolean
          status: Database["public"]["Enums"]["session_status"]
          sunscreen: string | null
          tubercles: boolean
          updated_at: string
          updated_by: string
        }
        Insert: {
          applied_apparatus?: string | null
          archived_at?: string | null
          asepsis?: string | null
          cleaning?: string | null
          closed_comedones?: boolean
          consultation_reason?: string | null
          created_at?: string
          created_by: string
          date?: string
          diagnosis?: string | null
          excoriations?: boolean
          exfoliation?: string | null
          extractions?: string | null
          final_product?: string | null
          goals?: string | null
          home_care_day?: string | null
          home_care_night?: string | null
          id?: string
          last_saved_at?: string
          macules?: boolean
          mask?: string | null
          massages?: string | null
          milium_cysts?: boolean
          nodules?: boolean
          open_comedones?: boolean
          pa?: string | null
          papules?: boolean
          patient_id: string
          pustules?: boolean
          return_to_eudermia?: string | null
          scars?: boolean
          sebaceous_cysts?: boolean
          status?: Database["public"]["Enums"]["session_status"]
          sunscreen?: string | null
          tubercles?: boolean
          updated_at?: string
          updated_by: string
        }
        Update: {
          applied_apparatus?: string | null
          archived_at?: string | null
          asepsis?: string | null
          cleaning?: string | null
          closed_comedones?: boolean
          consultation_reason?: string | null
          created_at?: string
          created_by?: string
          date?: string
          diagnosis?: string | null
          excoriations?: boolean
          exfoliation?: string | null
          extractions?: string | null
          final_product?: string | null
          goals?: string | null
          home_care_day?: string | null
          home_care_night?: string | null
          id?: string
          last_saved_at?: string
          macules?: boolean
          mask?: string | null
          massages?: string | null
          milium_cysts?: boolean
          nodules?: boolean
          open_comedones?: boolean
          pa?: string | null
          papules?: boolean
          patient_id?: string
          pustules?: boolean
          return_to_eudermia?: string | null
          scars?: boolean
          sebaceous_cysts?: boolean
          status?: Database["public"]["Enums"]["session_status"]
          sunscreen?: string | null
          tubercles?: boolean
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_sessions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_sessions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admin_user_id: string
          alcohol: boolean
          allergic_history: string | null
          archived_at: string | null
          born_date: string | null
          cosmetics_used: string | null
          created_at: string
          created_by: string
          current_home_treatment: string | null
          diet: string | null
          drugs: boolean
          email: string
          first_consultation_date: string | null
          gastrointestinal_history: boolean | null
          healthcare_plan: string | null
          healthcare_plan_number: string | null
          hereditary_history: string | null
          hirsutism: boolean
          hypertrichosis: boolean
          id: string
          instagram_account: string | null
          location: string | null
          marital_status: string | null
          medication: string | null
          modifications_or_suggestions: string | null
          name: string
          nationality: string | null
          number_of_children: number | null
          obesity: boolean
          occupation: string | null
          organic_history: string | null
          other_medical_history: string | null
          person_for_contact: string | null
          phone: string | null
          pregnancy: boolean
          previous_and_current_treatments: string | null
          smoke: boolean
          street: string | null
          street_number: string | null
          thyroid: boolean
          updated_at: string
          updated_by: string
          weight_loss: boolean
          working_hours: string | null
        }
        Insert: {
          admin_user_id: string
          alcohol?: boolean
          allergic_history?: string | null
          archived_at?: string | null
          born_date?: string | null
          cosmetics_used?: string | null
          created_at?: string
          created_by: string
          current_home_treatment?: string | null
          diet?: string | null
          drugs?: boolean
          email: string
          first_consultation_date?: string | null
          gastrointestinal_history?: boolean | null
          healthcare_plan?: string | null
          healthcare_plan_number?: string | null
          hereditary_history?: string | null
          hirsutism?: boolean
          hypertrichosis?: boolean
          id?: string
          instagram_account?: string | null
          location?: string | null
          marital_status?: string | null
          medication?: string | null
          modifications_or_suggestions?: string | null
          name: string
          nationality?: string | null
          number_of_children?: number | null
          obesity?: boolean
          occupation?: string | null
          organic_history?: string | null
          other_medical_history?: string | null
          person_for_contact?: string | null
          phone?: string | null
          pregnancy?: boolean
          previous_and_current_treatments?: string | null
          smoke?: boolean
          street?: string | null
          street_number?: string | null
          thyroid?: boolean
          updated_at?: string
          updated_by: string
          weight_loss?: boolean
          working_hours?: string | null
        }
        Update: {
          admin_user_id?: string
          alcohol?: boolean
          allergic_history?: string | null
          archived_at?: string | null
          born_date?: string | null
          cosmetics_used?: string | null
          created_at?: string
          created_by?: string
          current_home_treatment?: string | null
          diet?: string | null
          drugs?: boolean
          email?: string
          first_consultation_date?: string | null
          gastrointestinal_history?: boolean | null
          healthcare_plan?: string | null
          healthcare_plan_number?: string | null
          hereditary_history?: string | null
          hirsutism?: boolean
          hypertrichosis?: boolean
          id?: string
          instagram_account?: string | null
          location?: string | null
          marital_status?: string | null
          medication?: string | null
          modifications_or_suggestions?: string | null
          name?: string
          nationality?: string | null
          number_of_children?: number | null
          obesity?: boolean
          occupation?: string | null
          organic_history?: string | null
          other_medical_history?: string | null
          person_for_contact?: string | null
          phone?: string | null
          pregnancy?: boolean
          previous_and_current_treatments?: string | null
          smoke?: boolean
          street?: string | null
          street_number?: string | null
          thyroid?: boolean
          updated_at?: string
          updated_by?: string
          weight_loss?: boolean
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          lastname: string
          name: string
          professional_title: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          lastname: string
          name: string
          professional_title?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          lastname?: string
          name?: string
          professional_title?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          invitation_status: Database["public"]["Enums"]["invitation_status"]
          invited_by: string
          invited_lastname: string
          invited_name: string
          professional_title: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          invitation_status?: Database["public"]["Enums"]["invitation_status"]
          invited_by: string
          invited_lastname: string
          invited_name: string
          professional_title?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invitation_status?: Database["public"]["Enums"]["invitation_status"]
          invited_by?: string
          invited_lastname?: string
          invited_name?: string
          professional_title?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_patient: { Args: { patient_uuid: string }; Returns: boolean }
      can_access_session: { Args: { session_uuid: string }; Returns: boolean }
      can_manage_profile: { Args: { profile_uuid: string }; Returns: boolean }
      complete_user_onboarding: {
        Args: never
        Returns: {
          profile_id: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      is_superadmin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "superadmin" | "admin"
      invitation_status: "pending" | "accepted" | "revoked"
      session_status: "draft" | "completed"
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
      app_role: ["superadmin", "admin"],
      invitation_status: ["pending", "accepted", "revoked"],
      session_status: ["draft", "completed"],
    },
  },
} as const
