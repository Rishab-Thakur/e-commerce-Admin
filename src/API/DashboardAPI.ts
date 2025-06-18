import {api} from "./Index";

import type {DashboardStats} from "../Interface/DashboardServiceInterface";

export const DashboardAPI = {
  getStats: () => api.get<DashboardStats>("/dashboard"),
};