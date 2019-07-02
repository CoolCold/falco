import { RouterState } from 'connected-react-router';
import { PersistPartial } from 'redux-persist/lib/persistReducer';
import { LeadAction, LeadState } from 'redux/lead';
import { AuditResultsAction, AuditResultsState } from './auditResults';
import { ContentAction, ContentState } from './content';
import { EntitiesAction, EntitiesState } from './entities/types';
import { LoginAction, LoginState } from './login';
import { ParametersAction, ParametersState } from './parameters';
import { UserAction, UserState } from './user';

export type RootState = Readonly<{
  lead: LeadState;
  login: LoginState & PersistPartial;
  parameters: ParametersState & PersistPartial;
  entities: EntitiesState;
  auditResults: AuditResultsState;
  user: UserState;
  content: ContentState & PersistPartial;
}>;
// This type allows url fetching from anywhere without modifying the RootState
export type RootStateWithRouter = RootState & Readonly<{ router: RouterState }>;

export type RootAction =
  | LeadAction
  | LoginAction
  | ParametersAction
  | EntitiesAction
  | AuditResultsAction
  | UserAction
  | ContentAction;
