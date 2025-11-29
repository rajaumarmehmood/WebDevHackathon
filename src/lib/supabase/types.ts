export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_url: string | null;
          analysis: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_url?: string | null;
          analysis?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_url?: string | null;
          analysis?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      interview_preps: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          role: string;
          technologies: string[];
          prep_material: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          role: string;
          technologies: string[];
          prep_material?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          role?: string;
          technologies?: string[];
          prep_material?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          job_title: string;
          company: string;
          location: string;
          salary_range: string | null;
          match_score: number;
          status: string;
          applied_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_title: string;
          company: string;
          location: string;
          salary_range?: string | null;
          match_score: number;
          status?: string;
          applied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_title?: string;
          company?: string;
          location?: string;
          salary_range?: string | null;
          match_score?: number;
          status?: string;
          applied_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
