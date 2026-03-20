export type RecruiterProfile = {
  name: string;
  linkedinUrl: string;
};

export type CompanyItem = {
  id: string;
  name: string;
  website: string;
  linkedinUrl: string;
  cities: string[];
  recruiters: RecruiterProfile[];
  createdAt: Date;
  updatedAt: Date;
};

export type CompanyListResult = {
  companies: CompanyItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};
