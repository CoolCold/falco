import Badge from 'components/Badge';
import Loader from 'components/Loader';
import MessagePill from 'components/MessagePill';
import ToggleButton from 'components/ToggleButton';
import Close from 'icons/Close';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps } from 'react-intl';
import ReduxToastr, { toastr } from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { RouteComponentProps } from 'react-router';
import { ValueType } from 'react-select/lib/types';
import { ProjectMember, ProjectToastrDisplayType, ProjectType } from 'redux/entities/projects/types';
import { useFetchProjectIfUndefined } from 'redux/entities/projects/useFetchProjectIfUndefined';
import { UserState } from 'redux/user';
import { modelizeUser } from 'redux/user/modelizer';
import { ApiUser, User } from 'redux/user/types';
import { makeGetRequest } from 'services/networking/request';
import { isUserAdminOfProject } from 'services/utils';
import { colorUsage } from 'stylesheet';
import Style from './MembersSettings.style';

export type OwnProps = {} & RouteComponentProps<{
  projectId: string;
}>;

type Props = {
  currentUser: UserState,
  addMemberToProject: (projectId: string, userId: string) => void;
  removeMemberOfProjectRequest: (projectId: string, userId: string) => void;
  editMemberOfProjectRequest: (projectId: string, userId: string, isAdmin: boolean) => void;
  fetchProjectsRequest: (projectId: string) => void;
  project?: ProjectType | null;
  toastrDisplay: ProjectToastrDisplayType;
  setProjectToastrDisplay: (toastrDisplay: ProjectToastrDisplayType) => void;
} & OwnProps &
  InjectedIntlProps;

const MembersSettings: React.FunctionComponent<Props> = ({
  addMemberToProject,
  removeMemberOfProjectRequest,
  editMemberOfProjectRequest,
  fetchProjectsRequest,
  match,
  intl,
  project,
  currentUser,
  toastrDisplay,
  setProjectToastrDisplay,
}) => {

  interface UserOption {
    value: string;
    label: string;
    disabled: boolean;
  };

  const [selectOption, setSelectOption]: [ValueType<UserOption | {}>, any] = React.useState(null);
  const [allUsers, setAllUsers] = React.useState([]);

  const fetchAllUsers = () => {
    const request = makeGetRequest('/api/core/users', true);
    request
      .then((response) => {
        if(response) {
          setAllUsers(response.body.map((apiUser:ApiUser) => modelizeUser(apiUser)));
        }
      })
  }

  React.useEffect(
    () => {
      fetchAllUsers();
    },
    [],
  );

  React.useEffect(
    () => {
      setSelectOption(null);
    },
    [project],
  );

  useFetchProjectIfUndefined(fetchProjectsRequest, match.params.projectId, project);

  React.useEffect(
    () => {
      if('' !== toastrDisplay) {
        switch(toastrDisplay) {
          case "addMemberSuccess":
            toastr.success(
              intl.formatMessage({'id': 'Toastr.ProjectSettings.success_title'}),
              intl.formatMessage({'id': 'Toastr.ProjectSettings.add_member_success_message'}),
            );
            break;
          case "addMemberError":
            toastr.error(
              intl.formatMessage({'id': 'Toastr.ProjectSettings.error_title'}),
              intl.formatMessage({'id': 'Toastr.ProjectSettings.error_message'}),
            );
            break;
        }

        setProjectToastrDisplay('');
      }
    },
    [toastrDisplay, setProjectToastrDisplay, intl],
  );

  const onChange = (selectedOption: ValueType<UserOption | {}>) => {
    setSelectOption(selectedOption);
    if(selectedOption && 'value' in selectedOption && project) {
      addMemberToProject(project.uuid, selectedOption.value);
    }
  }

  const projectMembersSelectOptions = allUsers && project && allUsers.map((user: User) => {
    const memberInProject = project.projectMembers.map((projectMember: ProjectMember) => projectMember.id).includes(user.id);

    return {
      value: user.id,
      label: `${user.username} - ${user.emailAddress}` + (memberInProject ? intl.formatMessage({ id: 'ProjectSettings.member_in_project'}) : ''),
      disabled: memberInProject,
    }
  }).sort((a, b) => +a.disabled - +b.disabled); // display the disabled elements at the end :
  // we cast the disabled properties to int using the + operator and we make the difference between the two.

  if (project === undefined) {
    return (
      <Style.Container>
        <Loader />
      </Style.Container>
    );
  }

  if (project === null || currentUser === null) {
    return (
      <Style.Container>
        <MessagePill messageType="error">
          <FormattedMessage id="Project.project_error" />
        </MessagePill>
      </Style.Container>
    );
  }

  const projectMembersWithCurrentUserFirst = project.projectMembers.sort((a, b) => a.username === currentUser.username ? -1 : b.username === currentUser.username ? 1 : 0)

  return (
    <Style.Container>
      <Style.PageTitle>{intl.formatMessage({ id: 'ProjectSettings.settings'}) + ' - ' + project.name}</Style.PageTitle>
      <Style.PageSubTitle>
        <FormattedMessage id="ProjectSettings.project_members"/>
      </Style.PageSubTitle>
      {isUserAdminOfProject(currentUser, project) && <Style.SelectUser
        placeholder={intl.formatMessage({ id: "ProjectSettings.add_member" })}
        options={projectMembersSelectOptions}
        onChange={onChange}
        isOptionDisabled={(option: UserOption) => option.disabled}
        value={selectOption}
      />}
      <Style.InviteUserLink>
        {intl.formatMessage({id: "ProjectSettings.member_not_on_falco"})}
        <a href="/sign-up">
          { // small hack to get the page for the proper environment
            `${window.location.href.match(/https?:\/\/[^/]+/)}/sign-up`}
        </a>
      </Style.InviteUserLink>
      <Style.ProjectSettingsBlock>
        <Style.ElementContainer>
          <Style.MemberUsername>{intl.formatMessage({ id: "ProjectSettings.member_username"})}</Style.MemberUsername>
          <Style.MemberEmail>{intl.formatMessage({ id: "ProjectSettings.member_email"})}</Style.MemberEmail>
          <Style.MemberAdminBadgeContainer>
            {intl.formatMessage({ id: "ProjectSettings.member_status"})}
          </Style.MemberAdminBadgeContainer>
        </Style.ElementContainer>
        {projectMembersWithCurrentUserFirst.map((projectMember: ProjectMember) =>
            <Style.ElementContainer key={projectMember.username}>
              <Style.MemberUsername>{projectMember.username}</Style.MemberUsername>
              <Style.MemberEmail>{projectMember.emailAddress}</Style.MemberEmail>
              <Style.MemberAdminBadgeContainer>
                {isUserAdminOfProject(currentUser, project)
                  ? <ToggleButton
                    onChange={() => editMemberOfProjectRequest(project.uuid, projectMember.id, !projectMember.isAdmin)}
                    checked={projectMember.isAdmin}
                    disabled={projectMember.username === currentUser.username}
                    label={intl.formatMessage({id: "ProjectSettings.admin"})}
                  />
                  : projectMember.isAdmin && <Badge
                    backgroundColor={colorUsage.adminBadgeBackground}
                    color={colorUsage.adminBadgeText}
                    text={intl.formatMessage({id: "ProjectSettings.admin"}).toUpperCase()}
                  />}
              </Style.MemberAdminBadgeContainer>
              <Style.MemberAdminDeleteContainer>
                  {isUserAdminOfProject(currentUser, project) && projectMember.username !== currentUser.username &&
                    (<Style.MemberAdminDeleteButton onClick={() => removeMemberOfProjectRequest(project.uuid, projectMember.id)}>
                      <Close
                        color={colorUsage.projectSettingsIconColor}
                        width="13px"
                        strokeWidth="15"
                      />
                    </Style.MemberAdminDeleteButton>)}
              </Style.MemberAdminDeleteContainer >
            </Style.ElementContainer>
          )}
      </Style.ProjectSettingsBlock>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        closeOnToastrClick
      />
    </Style.Container>
  );
}

export default MembersSettings;
