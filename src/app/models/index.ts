export interface User {
  id: number;
  email?: string;
  firstName: string;
  lastName: string;
  headline?: string;
  location?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  summary?: string;
  openToWork?: boolean;
  accountTier?: string;
  profileVisibility?: string;
  createdAt?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  headline?: string;
  location?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface Post {
  id: number;
  authorUserId: number;
  companyId?: number;
  groupId?: number;
  type?: string;
  content?: string;
  mediaUrlsJson?: string;
  linkUrl?: string;
  isDraft?: boolean;
  isPinned?: boolean;
  repostOfPostId?: number;
  createdAt?: string;
  author?: User;
  reactionCount?: number;
  commentCount?: number;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  parentCommentId?: number;
  text: string;
  createdAt?: string;
  user?: User;
}

export interface Reaction {
  id: number;
  userId: number;
  postId?: number;
  commentId?: number;
  type: string;
}

export interface Connection {
  id: number;
  userId: number;
  connectedUserId: number;
  user?: User;
}

export interface ConnectionRequest {
  id: number;
  requesterUserId: number;
  addresseeUserId: number;
  status: string;
  message?: string;
  requester?: User;
}

export interface Conversation {
  id: number;
  type: string;
  title?: string;
  isMuted?: boolean;
  isArchived?: boolean;
  lastMessage?: Message;
  members?: User[];
  unreadCount?: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderUserId: number;
  text: string;
  createdAt?: string;
  sender?: User;
  readAt?: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  linkUrl?: string;
  createdAt?: string;
}

export interface Job {
  id: number;
  companyId: number;
  posterUserId: number;
  title: string;
  location?: string;
  jobType?: string;
  workplaceType?: string;
  experienceLevel?: string;
  description?: string;
  skillsJson?: string;
  isOpen?: boolean;
  company?: Company;
  createdAt?: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  applicantUserId: number;
  stage: string;
  resumeUrl?: string;
  coverLetter?: string;
  createdAt?: string;
  applicant?: User;
}

export interface JobAlert {
  id: number;
  userId: number;
  name: string;
  filtersJson?: string;
  enabled?: boolean;
}

export interface Company {
  id: number;
  name: string;
  industry?: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}

export interface CompanyProduct {
  id: number;
  companyId: number;
  name: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

export interface CompanyAdmin {
  id: number;
  companyId: number;
  userId: number;
}

export interface Group {
  id: number;
  name: string;
  ownerUserId: number;
  visibility?: string;
  description?: string;
  memberCount?: number;
}

export interface Experience {
  id: number;
  userId: number;
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Education {
  id: number;
  userId: number;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  id: number;
  userId: number;
  name: string;
  endorsementCount?: number;
}

export interface SearchResult {
  id: number;
  type: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface ApiListResponse<T> {
  items?: T[];
  data?: T[];
  total?: number;
}
