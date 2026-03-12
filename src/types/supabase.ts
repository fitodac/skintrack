export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'superadmin' | 'admin';
export type SessionStatus = 'draft' | 'completed';
export type InvitationStatus = 'pending' | 'accepted' | 'revoked';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          name: string;
          lastname: string;
          professional_title: string | null;
          role: AppRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          name: string;
          lastname: string;
          professional_title?: string | null;
          role?: AppRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      user_invitations: {
        Row: {
          id: string;
          email: string;
          role: AppRole;
          invited_name: string;
          invited_lastname: string;
          professional_title: string | null;
          invited_by: string;
          invitation_status: InvitationStatus;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: AppRole;
          invited_name: string;
          invited_lastname: string;
          professional_title?: string | null;
          invited_by: string;
          invitation_status?: InvitationStatus;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_invitations']['Insert']>;
        Relationships: [];
      };
      patients: {
        Row: {
          id: string;
          admin_user_id: string;
          name: string;
          born_date: string | null;
          nationality: string | null;
          marital_status: string | null;
          number_of_children: number | null;
          street: string | null;
          street_number: string | null;
          location: string | null;
          email: string;
          phone: string | null;
          instagram_account: string | null;
          healthcare_plan: string | null;
          healthcare_plan_number: string | null;
          person_for_contact: string | null;
          occupation: string | null;
          working_hours: string | null;
          first_consultation_date: string | null;
          hereditary_history: string | null;
          allergic_history: string | null;
          organic_history: string | null;
          thyroid: boolean;
          weight_loss: boolean;
          hypertrichosis: boolean;
          hirsutism: boolean;
          obesity: boolean;
          gastrointestinal_history: boolean | null;
          pregnancy: boolean;
          medication: string | null;
          alcohol: boolean;
          drugs: boolean;
          smoke: boolean;
          other_medical_history: string | null;
          cosmetics_used: string | null;
          previous_and_current_treatments: string | null;
          current_home_treatment: string | null;
          diet: string | null;
          modifications_or_suggestions: string | null;
          created_by: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          admin_user_id: string;
          name: string;
          born_date?: string | null;
          nationality?: string | null;
          marital_status?: string | null;
          number_of_children?: number | null;
          street?: string | null;
          street_number?: string | null;
          location?: string | null;
          email: string;
          phone?: string | null;
          instagram_account?: string | null;
          healthcare_plan?: string | null;
          healthcare_plan_number?: string | null;
          person_for_contact?: string | null;
          occupation?: string | null;
          working_hours?: string | null;
          first_consultation_date?: string | null;
          hereditary_history?: string | null;
          allergic_history?: string | null;
          organic_history?: string | null;
          thyroid?: boolean;
          weight_loss?: boolean;
          hypertrichosis?: boolean;
          hirsutism?: boolean;
          obesity?: boolean;
          gastrointestinal_history?: boolean | null;
          pregnancy?: boolean;
          medication?: string | null;
          alcohol?: boolean;
          drugs?: boolean;
          smoke?: boolean;
          other_medical_history?: string | null;
          cosmetics_used?: string | null;
          previous_and_current_treatments?: string | null;
          current_home_treatment?: string | null;
          diet?: string | null;
          modifications_or_suggestions?: string | null;
          created_by: string;
          updated_by: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['patients']['Insert']>;
        Relationships: [];
      };
      clinical_sessions: {
        Row: {
          id: string;
          patient_id: string;
          date: string;
          consultation_reason: string | null;
          closed_comedones: boolean;
          open_comedones: boolean;
          papules: boolean;
          pustules: boolean;
          nodules: boolean;
          tubercles: boolean;
          scars: boolean;
          excoriations: boolean;
          milium_cysts: boolean;
          sebaceous_cysts: boolean;
          macules: boolean;
          diagnosis: string | null;
          goals: string | null;
          cleaning: string | null;
          return_to_eudermia: string | null;
          exfoliation: string | null;
          asepsis: string | null;
          extractions: string | null;
          pa: string | null;
          massages: string | null;
          mask: string | null;
          final_product: string | null;
          sunscreen: string | null;
          applied_apparatus: string | null;
          home_care_day: string | null;
          home_care_night: string | null;
          status: SessionStatus;
          last_saved_at: string;
          created_by: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          date?: string;
          consultation_reason?: string | null;
          closed_comedones?: boolean;
          open_comedones?: boolean;
          papules?: boolean;
          pustules?: boolean;
          nodules?: boolean;
          tubercles?: boolean;
          scars?: boolean;
          excoriations?: boolean;
          milium_cysts?: boolean;
          sebaceous_cysts?: boolean;
          macules?: boolean;
          diagnosis?: string | null;
          goals?: string | null;
          cleaning?: string | null;
          return_to_eudermia?: string | null;
          exfoliation?: string | null;
          asepsis?: string | null;
          extractions?: string | null;
          pa?: string | null;
          massages?: string | null;
          mask?: string | null;
          final_product?: string | null;
          sunscreen?: string | null;
          applied_apparatus?: string | null;
          home_care_day?: string | null;
          home_care_night?: string | null;
          status?: SessionStatus;
          last_saved_at?: string;
          created_by: string;
          updated_by: string;
          created_at?: string;
          updated_at?: string;
          archived_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['clinical_sessions']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      complete_user_onboarding: {
        Args: never;
        Returns: {
          profile_id: string;
          role: AppRole;
        }[];
      };
      is_superadmin: {
        Args: never;
        Returns: boolean;
      };
      can_access_patient: {
        Args: {
          patient_uuid: string;
        };
        Returns: boolean;
      };
      can_access_session: {
        Args: {
          session_uuid: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      session_status: SessionStatus;
      invitation_status: InvitationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
