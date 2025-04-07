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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Cinema: {
        Row: {
          address: string | null
          createdAt: string
          externalIds: Json | null
          fullAddress: string | null
          id: string
          name: string
          searchableName: string
          source: Json | null
          updatedAt: string
        }
        Insert: {
          address?: string | null
          createdAt?: string
          externalIds?: Json | null
          fullAddress?: string | null
          id: string
          name: string
          searchableName: string
          source?: Json | null
          updatedAt: string
        }
        Update: {
          address?: string | null
          createdAt?: string
          externalIds?: Json | null
          fullAddress?: string | null
          id?: string
          name?: string
          searchableName?: string
          source?: Json | null
          updatedAt?: string
        }
        Relationships: []
      }
      GarbageTitle: {
        Row: {
          createdAt: string
          id: number
          title: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id?: number
          title: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: number
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Movie: {
        Row: {
          createdAt: string
          format: string
          id: string
          language: string
          movieIds: string[] | null
          title: string
          titleVariations: string[] | null
          tmdbId: number | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          format: string
          id: string
          language: string
          movieIds?: string[] | null
          title: string
          titleVariations?: string[] | null
          tmdbId?: number | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          format?: string
          id?: string
          language?: string
          movieIds?: string[] | null
          title?: string
          titleVariations?: string[] | null
          tmdbId?: number | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Movie_tmdbId_fkey"
            columns: ["tmdbId"]
            isOneToOne: false
            referencedRelation: "tmdb"
            referencedColumns: ["id"]
          },
        ]
      }
      Showtime: {
        Row: {
          cinemaId: string
          createdAt: string
          details: Json | null
          filmId: string
          id: number
          link: string
          movieFormat: string
          theatreFilmId: string
          ticketType: string
          unixTime: number
          updatedAt: string
        }
        Insert: {
          cinemaId: string
          createdAt?: string
          details?: Json | null
          filmId: string
          id?: number
          link: string
          movieFormat: string
          theatreFilmId: string
          ticketType: string
          unixTime: number
          updatedAt: string
        }
        Update: {
          cinemaId?: string
          createdAt?: string
          details?: Json | null
          filmId?: string
          id?: number
          link?: string
          movieFormat?: string
          theatreFilmId?: string
          ticketType?: string
          unixTime?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Showtime_cinemaId_fkey"
            columns: ["cinemaId"]
            isOneToOne: false
            referencedRelation: "Cinema"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Showtime_filmId_fkey"
            columns: ["filmId"]
            isOneToOne: false
            referencedRelation: "Movie"
            referencedColumns: ["id"]
          },
        ]
      }
      tmdb: {
        Row: {
          createdAt: string
          external_ids: Json | null
          genres: Json | null
          id: number
          image: Json | null
          origin_country: string[] | null
          original_language: string | null
          original_title: string | null
          overview: string | null
          parental: string | null
          ratings: Json | null
          recommendations: string | null
          release_date: string | null
          runtime: number | null
          spoken_languages: Json | null
          streaming: Json | null
          title: string
          updatedAt: string
          videos: Json | null
        }
        Insert: {
          createdAt?: string
          external_ids?: Json | null
          genres?: Json | null
          id: number
          image?: Json | null
          origin_country?: string[] | null
          original_language?: string | null
          original_title?: string | null
          overview?: string | null
          parental?: string | null
          ratings?: Json | null
          recommendations?: string | null
          release_date?: string | null
          runtime?: number | null
          spoken_languages?: Json | null
          streaming?: Json | null
          title: string
          updatedAt: string
          videos?: Json | null
        }
        Update: {
          createdAt?: string
          external_ids?: Json | null
          genres?: Json | null
          id?: number
          image?: Json | null
          origin_country?: string[] | null
          original_language?: string | null
          original_title?: string | null
          overview?: string | null
          parental?: string | null
          ratings?: Json | null
          recommendations?: string | null
          release_date?: string | null
          runtime?: number | null
          spoken_languages?: Json | null
          streaming?: Json | null
          title?: string
          updatedAt?: string
          videos?: Json | null
        }
        Relationships: []
      }
      Updates: {
        Row: {
          createdAt: string
          destinationField: string | null
          destinationText: string | null
          id: number
          modelName: string
          operation: string
          sourceField: string
          sourceText: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          destinationField?: string | null
          destinationText?: string | null
          id?: number
          modelName: string
          operation: string
          sourceField: string
          sourceText: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          destinationField?: string | null
          destinationText?: string | null
          id?: number
          modelName?: string
          operation?: string
          sourceField?: string
          sourceText?: string
          updatedAt?: string
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
