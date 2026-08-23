-- ====================================================================
-- ASCEND — SEED DATA
-- ====================================================================

-- 1. SEED GAMES
INSERT INTO public.games (id, slug, title, description, genre, cover_url, banner_url, player_count, achievement_count)
VALUES 
  (
    'a0000000-0000-0000-0000-000000000001',
    'valorant',
    'VALORANT',
    'A 5v5 character-based tactical shooter where precise gunplay meets adaptive agent abilities.',
    'Tactical Shooter',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    14250,
    18
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'counter-strike-2',
    'Counter-Strike 2',
    'The premier tactical FPS featuring overhauled smoke grenades, sub-tick updates, and competitive matchmaking.',
    'Tactical Shooter',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=1200&auto=format&fit=crop&q=80',
    21800,
    24
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'elden-ring',
    'ELDEN RING',
    'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord.',
    'Action RPG',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=1200&auto=format&fit=crop&q=80',
    9840,
    32
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'fortnite',
    'Fortnite',
    'Drop into the Battle Royale, build, fight, and be the last player standing in fast-paced competitive matches.',
    'Battle Royale',
    'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    35400,
    20
  ),
  (
    'a0000000-0000-0000-0000-000000000005',
    'rocket-league',
    'Rocket League',
    'High-octane hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid physics.',
    'Sports / Action',
    'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    11200,
    15
  ),
  (
    'a0000000-0000-0000-0000-000000000006',
    'minecraft',
    'Minecraft',
    'Explore infinite worlds, construct colossal fortresses, and conquer survival challenges in the ultimate sandbox.',
    'Sandbox Survival',
    'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
    42100,
    40
  )
ON CONFLICT (id) DO NOTHING;

-- 2. SEED ACHIEVEMENTS
INSERT INTO public.achievements (id, slug, game_id, title, description, icon_url, rarity, xp_reward, requirements)
VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'first-blood-val',
    'a0000000-0000-0000-0000-000000000001',
    'First Blood',
    'Secure the first kill of the round in a competitive Valorant match.',
    'Crosshair',
    'COMMON',
    150,
    'Eliminate an enemy before any teammate or enemy dies in a round.'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'clutch-master-val',
    'a0000000-0000-0000-0000-000000000001',
    '1v4 Clutch Master',
    'Win a 1v4 round scenario in ranked competition.',
    'Zap',
    'RARE',
    500,
    'Defeat 4 remaining enemies alone in a single round and plant/defuse.'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'radiant-ace-val',
    'a0000000-0000-0000-0000-000000000001',
    'Radiant Ace',
    'Eliminate all 5 enemies in a round using headshots only.',
    'Flame',
    'EPIC',
    1000,
    'Score 5 headshot eliminations in under 30 seconds.'
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'global-elite-cs2',
    'b0000000-0000-0000-0000-000000000004',
    'Deagle Sniper',
    'Achieve 3 headshots with a Desert Eagle in a single round in CS2.',
    'Target',
    'RARE',
    600,
    'Land 3 consecutive headshot kills with Desert Eagle pistol.'
  ),
  (
    'b0000000-0000-0000-0000-000000000005',
    'malenia-no-hit-elden',
    'a0000000-0000-0000-0000-000000000003',
    'Goddess of Rot (Hitless)',
    'Defeat Malenia, Blade of Miquella without taking a single hit.',
    'ShieldAlert',
    'MYTHIC',
    3500,
    'Defeat Malenia solo in Phase 1 & 2 taking zero damage.'
  ),
  (
    'b0000000-0000-0000-0000-000000000006',
    'victory-royale-fort',
    'a0000000-0000-0000-0000-000000000004',
    'Crown Victory',
    'Win a Battle Royale match while holding a Victory Crown.',
    'Crown',
    'UNCOMMON',
    300,
    'Finish #1 in Solo or Squads holding a Victory Crown.'
  ),
  (
    'b0000000-0000-0000-0000-000000000007',
    'flip-reset-goal-rl',
    'a0000000-0000-0000-0000-000000000005',
    'Aerial Flip Reset Goal',
    'Score an aerial flip reset goal in a competitive Rocket League match.',
    'Trophy',
    'LEGENDARY',
    2000,
    'Perform a flip reset off the ball in mid-air and score.'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. SEED CHALLENGES
INSERT INTO public.challenges (id, title, description, game_id, difficulty, xp_reward, ranking_reward, start_date, end_date, participant_count, status, requirements)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'Tactical Precision Week',
    'Score 50 headshot kills across competitive Valorant matches this week.',
    'a0000000-0000-0000-0000-000000000001',
    'HARD',
    1500,
    150,
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '6 days',
    1420,
    'ACTIVE',
    'Submit video or post-match summary showing 50 total headshots.'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'Elden Lord Speedrun Sprint',
    'Defeat Starscourge Radahn in under 3 minutes of entering the arena.',
    'a0000000-0000-0000-0000-000000000003',
    'EXPERT',
    2500,
    250,
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '5 days',
    890,
    'ACTIVE',
    'Record video starting from festival door entry to enemy vanquished banner.'
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'Supersonic Streak',
    'Win 5 consecutive competitive 2v2 Rocket League matches.',
    'a0000000-0000-0000-0000-000000000005',
    'MEDIUM',
    1000,
    100,
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '4 days',
    2150,
    'ACTIVE',
    'Maintain a unbroken 5-game winning streak in Ranked 2v2.'
  )
ON CONFLICT (id) DO NOTHING;
