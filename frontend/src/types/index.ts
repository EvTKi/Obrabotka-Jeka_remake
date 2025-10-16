export interface Replacement {
  old: string;
  new: string;
}

export interface MatchCandidate {
  role_name: string;
  score: number;
}

export interface PendingMatch {
  original: string;
  candidates: MatchCandidate[];
}

export interface AnalysisResponse {
  unique_tu: string[];
  unique_tv: string[];
  unique_iv: string[];
  pending_matches: {
    TU: PendingMatch[];
    TV: PendingMatch[];
    IV: PendingMatch[];
  };
  auto_matches: {
    TU: Array<{ original: string; matched: string; uid: string; type: string }>;
    TV: Array<{ original: string; matched: string; uid: string; type: string }>;
    IV: Array<{ original: string; matched: string; uid: string; type: string }>;
  };
}

export interface ProcessedData {
  data: any[];
  highlight_rows: number[];
  tu_summary: Record<string, any>;
  tv_summary: Record<string, any>;
  iv_summary: Record<string, any>;
}