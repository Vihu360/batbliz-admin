// Network Manager for Cricket Admin Dashboard
// Centralized API management for all CRUD operations

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

export interface TableColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  maxLength?: number;
}

export interface TableSchema {
  tableName: string;
  columns: TableColumn[];
}

export interface TableDataResponse {
  success: boolean;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/admin';

class ApiManager {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Generic CRUD operations
  async getTables(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/tables');
  }

  async getTableSchema(tableName: string): Promise<ApiResponse<TableSchema>> {
    return this.request<TableSchema>(`/schema/tables/${tableName}/columns`);
  }

  async getTableData(
    tableName: string,
    page: number = 1,
    limit: number = 10,
    filters?: Record<string, any>
  ): Promise<ApiResponse<TableDataResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && { filters: JSON.stringify(filters) }),
    });
    return this.request<TableDataResponse>(`/crud/${tableName}?${params}`);
  }

  async createRecord(
    tableName: string,
    data: Record<string, any>
  ): Promise<ApiResponse<any>> {
    return this.request(`/crud/${tableName}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRecord(
    tableName: string,
    id: string | number,
    data: Record<string, any>
  ): Promise<ApiResponse<any>> {
    return this.request(`/tables/${tableName}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRecord(
    tableName: string,
    id: string | number
  ): Promise<ApiResponse<any>> {
    return this.request(`/tables/${tableName}/${id}`, {
      method: 'DELETE',
    });
  }

  async getRecord(
    tableName: string,
    id: string | number
  ): Promise<ApiResponse<any>> {
    return this.request(`/tables/${tableName}/${id}`);
  }
}

// Export singleton instance
export const apiManager = new ApiManager();

// Table categorization for the cricket admin dashboard
export const TABLE_CATEGORIES = {
  MATCH_INFO: {
    name: 'Match Information',
    description: 'Core match data including competitions, seasons, and matches',
    tables: ['competition', 'seasons', 'match', 'venues', 'match_summary'],
    icon: 'Trophy',
  },
  PLAYERS: {
    name: 'Players & Contracts',
    description: 'Player information, contracts, and match statistics',
    tables: ['players', 'player_contracts', 'player_match_stats'],
    icon: 'Users',
  },
  TEAMS: {
    name: 'Teams & Statistics',
    description: 'Team information and match statistics',
    tables: ['teams', 'team_match_stats'],
    icon: 'Shield',
  },
  MATCH_DETAILS: {
    name: 'Match Details',
    description: 'Detailed match events and innings data',
    tables: ['innings', 'ball_events'],
    icon: 'Activity',
  },
  SOCIAL: {
    name: 'Social & Content',
    description: 'User interactions and content management',
    tables: ['users', 'posts', 'follows'],
    icon: 'MessageCircle',
  },
  INTEGRATIONS: {
    name: 'External Integrations',
    description: 'External provider mappings and integrations',
    tables: ['external_providers', 'provider_ids_map'],
    icon: 'Link',
  },
} as const;

export type TableCategory = keyof typeof TABLE_CATEGORIES;

// Helper function to get category by table name
export function getCategoryByTable(tableName: string): TableCategory | null {
  for (const [categoryKey, category] of Object.entries(TABLE_CATEGORIES)) {
    if (category.tables.includes(tableName as never)) {
      return categoryKey as TableCategory;
    }
  }
  return null;
}

// Helper function to get all tables in a category
export function getTablesInCategory(category: TableCategory): string[] {
  return [...TABLE_CATEGORIES[category].tables];
}
