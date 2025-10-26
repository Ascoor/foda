export const statCards = [
  {
    id: 'totalVotes',
    value: '43,592',
    trend: '+5.4%',
    deltaLabel: 'delta.lastElection',
    icon: 'Vote'
  },
  {
    id: 'participationRate',
    value: '73%',
    trend: '+2.1%',
    deltaLabel: 'delta.lastMonth',
    icon: 'TrendingUp'
  },
  {
    id: 'analytics',
    value: '8,234',
    trend: '+12%',
    deltaLabel: 'delta.activeMonitors',
    icon: 'Users'
  },
  {
    id: 'reports',
    value: '156',
    trend: '-3%',
    deltaLabel: 'delta.pendingReviews',
    icon: 'BarChart3'
  }
];

export const voteDistribution = [
  { key: 'candidateA', name: 'Candidate A', value: 35 },
  { key: 'candidateB', name: 'Candidate B', value: 28 },
  { key: 'candidateC', name: 'Candidate C', value: 22 },
  { key: 'candidateD', name: 'Candidate D', value: 15 }
];

export const participationTrend = [
  { month: 'Jan', rate: 45 },
  { month: 'Feb', rate: 52 },
  { month: 'Mar', rate: 61 },
  { month: 'Apr', rate: 58 },
  { month: 'May', rate: 67 },
  { month: 'Jun', rate: 73 }
];

export const partyOverview = [
  { party: 'Party A', votes: 12500 },
  { party: 'Party B', votes: 10200 },
  { party: 'Party C', votes: 8900 },
  { party: 'Party D', votes: 6700 },
  { party: 'Party E', votes: 5200 }
];

export const turnoutByDistrict = [
  { name: 'Mansoura', turnout: 72, participation: 64 },
  { name: 'Talkha', turnout: 68, participation: 59 },
  { name: 'Bilqas', turnout: 74, participation: 66 },
  { name: 'Sherbin', turnout: 62, participation: 55 },
  { name: 'Aga', turnout: 70, participation: 61 }
];

export const mapCenters = [
  {
    id: 'mansoura-university',
    name: 'Mansoura University Center',
    position: [31.0425, 31.3542],
    voters: 5400,
    participation: 76
  },
  {
    id: 'dakahlia-club',
    name: 'Dakahlia Youth Club',
    position: [31.0452, 31.3813],
    voters: 3200,
    participation: 69
  },
  {
    id: 'city-hall',
    name: 'Mansoura City Hall',
    position: [31.0406, 31.3772],
    voters: 4100,
    participation: 71
  },
  {
    id: 'industrial-zone',
    name: 'Industrial Zone Pavilion',
    position: [31.0622, 31.3569],
    voters: 2800,
    participation: 63
  }
];
