import { clubRepositoryInterceptor } from "@/features/club/interceptors/club-repository.interceptor";
import { managerRepositoryInterceptor } from "@/features/club/interceptors/manager-repository.interceptor";
import { marketRepositoryInterceptor } from "@/features/market/interceptors/market-repository.interceptor";
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from "@angular/common/http";
import { authRepositoryInterceptor } from "../auth/interceptors/auth.interceptor";
import { errorInterceptor } from "../interceptors/error.interceptor";
import { tokenInterceptor } from "../interceptors/token.interceptor";
import { playerRepositoryInterceptor } from "@/shared/interceptors/player-repository.interceptor";
import { nationalityRepositoryInterceptor } from "@/shared/interceptors/nationality-repository.interceptor";

export const provideCoreHttp = () =>
  provideHttpClient(
    withInterceptors([
      tokenInterceptor,
      errorInterceptor,
      // mock interceptors
      ...mockInterceptors,
    ]),
  );

const mockInterceptors: HttpInterceptorFn[] = [
  authRepositoryInterceptor,
  clubRepositoryInterceptor,
  managerRepositoryInterceptor,
  marketRepositoryInterceptor,
  playerRepositoryInterceptor,
  nationalityRepositoryInterceptor,
];