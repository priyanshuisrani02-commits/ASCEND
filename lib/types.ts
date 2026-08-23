export type AchievementRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type ChallengeStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'INSANE';
export type RecordStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type NotificationType = 'ACHIEVEMENT_UNLOCKED' | 'CHALLENGE_COMPLETED' | 'RANK_CHANGED' | 'RECORD_VERIFIED' | 'RECORD_REJECTED' | 'SYSTEM';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  level: number;
  xp: number;
  ranking_points: number;
  is_admin: boolean;
  favorite_games: string[];
  created_at: string;
  updated_at?: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  genre: string;
  cover_url: string;
  banner_url: string;
  player_count: number;
  achievement_count: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  game_id: string;
  game_title?: string;
  game_slug?: string;
  title: string;
  description: string;
  icon_url: string;
  rarity: AchievementRarity;
  xp_reward: number;
  requirements: string;
  is_active: boolean;
  unlocked_count: number;
  total_players_count: number;
  created_at: string;
  is_unlocked?: boolean;
  unlocked_at?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  game_id: string;
  game_title?: string;
  game_slug?: string;
  difficulty: ChallengeDifficulty;
  xp_reward: number;
  ranking_reward: number;
  start_date: string;
  end_date: string;
  participant_count: number;
  status: ChallengeStatus;
  requirements: string;
  created_at: string;
  user_joined?: boolean;
  user_completed?: boolean;
}

export interface RecordSubmission {
  id: string;
  user_id: string;
  username?: string;
  user_avatar?: string;
  game_id: string;
  game_title?: string;
  title: string;
  category: string;
  score_value: number;
  score_unit: string;
  evidence_url: string;
  status: RecordStatus;
  submitted_at: string;
  verified_at?: string;
  verified_by?: string;
  moderator_note?: string;
}

export interface ActivityEvent {
  id: string;
  user_id: string;
  username: string;
  user_avatar: string;
  event_type: 'ACHIEVEMENT_UNLOCKED' | 'RECORD_SUBMITTED' | 'CHALLENGE_COMPLETED' | 'LEVEL_UP';
  title: string;
  description: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
