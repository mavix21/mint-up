import type { Doc, Id } from '../_generated/dataModel';

export type MemberProfile = {
  _id: Id<'users'>;
  name?: string;
  imageUrl: string | null;
};

export type LeaderboardResult = {
  topAttendees: Array<{
    userId: Id<'users'>;
    name?: string;
    imageUrl: string | null;
    rank: number;
    totalEventsAttended: number;
  }>;
  attendanceStreak: Array<{
    userId: Id<'users'>;
    name?: string;
    imageUrl: string | null;
    rank: number;
    streak: number;
  }>;
};

type BuildCommunityLeaderboardInput = {
  events: Array<{ _id: Id<'events'>; startDate: number }>;
  registrationsByEvent: Map<Id<'events'>, Doc<'registrations'>[]>;
  members: MemberProfile[];
  now?: number;
  maxTopEntries?: number;
  maxStreakEntries?: number;
};

const DEFAULT_TOP_ENTRIES = 10;
const DEFAULT_STREAK_ENTRIES = 10;

type AttendanceAccumulator = {
  totalEventsAttended: number;
  events: Set<Id<'events'>>;
};

type CheckInsByEvent = Map<Id<'events'>, Set<Id<'users'>>>;

export function buildCommunityLeaderboard({
  events,
  registrationsByEvent,
  members,
  now = Date.now(),
  maxTopEntries = DEFAULT_TOP_ENTRIES,
  maxStreakEntries = DEFAULT_STREAK_ENTRIES,
}: BuildCommunityLeaderboardInput): LeaderboardResult {
  if (events.length === 0 || members.length === 0) {
    return { topAttendees: [], attendanceStreak: [] };
  }

  const memberMap = new Map<Id<'users'>, MemberProfile>();
  members.forEach((member) => memberMap.set(member._id, member));

  const attendanceByUser = new Map<Id<'users'>, AttendanceAccumulator>();
  const checkInsByEvent: CheckInsByEvent = new Map();

  for (const event of events) {
    const registrations = registrationsByEvent.get(event._id) ?? [];
    const eligibleUserIds = new Set<Id<'users'>>();

    for (const registration of registrations) {
      if (registration.status.type === 'rejected') continue;
      if (!registration.checkIn) continue;
      if (!memberMap.has(registration.userId)) continue;
      eligibleUserIds.add(registration.userId);
    }

    checkInsByEvent.set(event._id, eligibleUserIds);

    for (const userId of eligibleUserIds) {
      const accumulator = attendanceByUser.get(userId) ?? {
        totalEventsAttended: 0,
        events: new Set<Id<'events'>>(),
      };

      if (!accumulator.events.has(event._id)) {
        accumulator.events.add(event._id);
        accumulator.totalEventsAttended += 1;
      }

      attendanceByUser.set(userId, accumulator);
    }
  }

  const topAttendees = Array.from(attendanceByUser.entries())
    .map(([userId, accumulator]) => {
      const member = memberMap.get(userId);
      return {
        userId,
        name: member?.name ?? undefined,
        imageUrl: member?.imageUrl ?? null,
        totalEventsAttended: accumulator.totalEventsAttended,
      };
    })
    .sort((a, b) => {
      if (b.totalEventsAttended !== a.totalEventsAttended) {
        return b.totalEventsAttended - a.totalEventsAttended;
      }
      const nameA = (a.name ?? '').toLowerCase();
      const nameB = (b.name ?? '').toLowerCase();
      return nameA.localeCompare(nameB);
    })
    .slice(0, Math.max(0, maxTopEntries))
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  const attendanceStreak = buildAttendanceStreak({
    members,
    events,
    checkInsByEvent,
    now,
    maxEntries: maxStreakEntries,
  });

  return { topAttendees, attendanceStreak };
}

type BuildAttendanceStreakInput = {
  members: MemberProfile[];
  events: Array<{ _id: Id<'events'>; startDate: number }>;
  checkInsByEvent: CheckInsByEvent;
  now: number;
  maxEntries: number;
};

function buildAttendanceStreak({
  members,
  events,
  checkInsByEvent,
  now,
  maxEntries,
}: BuildAttendanceStreakInput): LeaderboardResult['attendanceStreak'] {
  const completedEvents = events
    .filter((event) => event.startDate <= now)
    .sort((a, b) => b.startDate - a.startDate);

  if (completedEvents.length === 0) return [];

  const streaks = members.map((member) => {
    let streak = 0;

    for (const event of completedEvents) {
      const attendees = checkInsByEvent.get(event._id);
      if (attendees?.has(member._id)) {
        streak += 1;
      } else {
        break;
      }
    }

    return { member, streak };
  });

  return streaks
    .filter(({ streak }) => streak > 0)
    .sort((a, b) => {
      if (b.streak !== a.streak) {
        return b.streak - a.streak;
      }
      const nameA = (a.member.name ?? '').toLowerCase();
      const nameB = (b.member.name ?? '').toLowerCase();
      return nameA.localeCompare(nameB);
    })
    .slice(0, Math.max(0, maxEntries))
    .map(({ member, streak }, index) => ({
      userId: member._id,
      name: member.name ?? undefined,
      imageUrl: member.imageUrl ?? null,
      streak,
      rank: index + 1,
    }));
}
