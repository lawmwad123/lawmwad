export interface Vertical {
  id: string;
  display: string;
  org_name: string;
  description: string;
  sample_queries: string[];
}

export interface DbColumn {
  name: string;
  type: string;       // Postgres data_type string, e.g. "text", "integer", "boolean"
  nullable: boolean;
}

export interface DiscoveredEntity {
  entity_name: string;
  display_name: string;
  description: string;
  row_count: number;
  sample_questions: string[];
  columns?: DbColumn[];
}

export interface Session {
  session_id: string;
  org_name: string;
  vertical: string;
  schema_name: string;
  actions_enabled: boolean;
  available_actions: Action[];
  sample_queries: string[];
  entity_count: number;
  // Discovery fields — populated for custom connections
  discovered_entities?: DiscoveredEntity[];
  suggested_queries?: string[];
  capabilities_summary?: string;
}

export interface Action {
  action_type: string;
  display_name: string;
  description: string;
  risk_level: "low" | "medium" | "high" | "critical";
  required_params: string[];
  example_prompts: string[];
}

export interface AgentResult {
  thread_id: string;
  text: string;
  template_type: "text" | "table" | "stats" | "chart" | "summary" | "comparison" | "error";
  data?: Record<string, unknown>[];
  row_count?: number;
  sql_query?: string;
  source_tables?: string[];
  chart_type?: "bar" | "pie" | "line" | "progress" | "distribution";
  display_metadata?: {
    column_types?: Record<string, string>;
    distributions?: Array<{
      column: string;
      distribution: Array<{ label: string; count: number; pct: number }>;
    }>;
  };
  suggested_followups?: string[];
  suggested_title?: string;
  action_plan?: ActionPlan;
  error?: string;
}

export interface RecordDiffField {
  field: string;
  old:   string;
  new:   string;
}

export interface ActionPlan {
  action_type:          string;
  display_name:         string;
  description:          string;
  risk_level:           "low" | "medium" | "high" | "critical";
  params:               Record<string, unknown>;
  summary:              string;
  clarification_needed: boolean;
  /** Raw SQL — kept for sandbox actions, hidden from users in UI */
  sql_template:         string;
  /** Human-readable before/after for each changed field */
  record_diff?:         RecordDiffField[];
  /** Identifying context of the record being mutated (name, email, etc.) */
  record_preview?:      Record<string, unknown>;
}

export interface ProgressStep {
  step: string;
  status: string;
  visible: boolean;
}
