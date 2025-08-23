export type CommunityListItem = {
  id: string;
  name: string;
  logoUrl: string;
  memberCount: number;
  eventCount: number;
  description: string;
};

export const communityListData: CommunityListItem[] = [
  {
    id: 'community-1',
    name: 'Dev3Pack',
    logoUrl: 'url_to_logo_1.png',
    memberCount: 150,
    eventCount: 14,
    description: 'A community for the next generation of onchain builders.',
  },
  {
    id: 'community-2',
    name: 'Ethereum Lima',
    logoUrl: 'url_to_logo_2.png',
    memberCount: 500,
    eventCount: 35,
    description: 'Connecting the Ethereum ecosystem in Peru.',
  },
  {
    id: 'community-3',
    name: 'Odisea Labs',
    logoUrl: 'url_to_logo_3.png',
    memberCount: 250,
    eventCount: 22,
    description: 'Exploring the frontiers of web3 and decentralized science.',
  },
];

export type LeaderboardEntry = {
  rank?: number;
  user: { name: string; pfpUrl: string };
  totalAttended?: number;
  streak?: number;
};

export type CommunityProfile = {
  id: string;
  name: string;
  bannerUrl: string;
  logoUrl: string;
  description: string;
  stats: { members: number; events: number; activeStreak: number };
  leaderboard: {
    topAttendees: LeaderboardEntry[];
    attendanceStreak: LeaderboardEntry[];
  };
};

export const communityProfileData: CommunityProfile = {
  id: 'community-1',
  name: 'Dev3Pack',
  bannerUrl: 'url_to_banner.png',
  logoUrl: 'url_to_logo_1.png',
  description:
    'A community for the next generation of onchain builders. Join us for weekly workshops, hackathons, and networking events.',
  stats: { members: 150, events: 12, activeStreak: 5 },
  leaderboard: {
    topAttendees: [
      { rank: 1, user: { name: 'Alice', pfpUrl: '...' }, totalAttended: 12 },
      { rank: 2, user: { name: 'Bob', pfpUrl: '...' }, totalAttended: 11 },
      { rank: 3, user: { name: 'Charlie', pfpUrl: '...' }, totalAttended: 9 },
      { rank: 4, user: { name: 'Diana', pfpUrl: '...' }, totalAttended: 8 },
    ],
    attendanceStreak: [
      { user: { name: 'Alice', pfpUrl: '...' }, streak: 12 },
      { user: { name: 'Eve', pfpUrl: '...' }, streak: 7 },
      { user: { name: 'Frank', pfpUrl: '...' }, streak: 5 },
    ],
  },
};

export function getCommunityProfileById(id: string): CommunityProfile | undefined {
  if (id === communityProfileData.id) return communityProfileData;
  const fallbackFromList = communityListData.find((c) => c.id === id);
  if (!fallbackFromList) return undefined;
  return {
    id: fallbackFromList.id,
    name: fallbackFromList.name,
    bannerUrl: 'url_to_banner.png',
    logoUrl: fallbackFromList.logoUrl,
    description: fallbackFromList.description,
    stats: {
      members: fallbackFromList.memberCount,
      events: fallbackFromList.eventCount,
      activeStreak: 0,
    },
    leaderboard: {
      topAttendees: [],
      attendanceStreak: [],
    },
  };
}
