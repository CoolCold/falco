import Select from 'components/Select';
import styled from 'styled-components';
import { colorUsage, fontFamily, fontSize, fontWeight, getSpacing, lineHeight, settingsContainerSize } from 'stylesheet';

const Style = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 0 ${getSpacing(4)} 0;
    margin: 0;
    width: ${settingsContainerSize};
  `,

  PageTitle: styled.h1`
    line-height: ${lineHeight.h1Text};
    color: ${colorUsage.h1Text};
    font-family: ${fontFamily.mainSans};
    font-size: ${fontSize.h1Text};
    font-weight: ${fontWeight.h1Text};
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

Title: styled.h2`
  line-height: ${lineHeight.h2Text};
  color: ${colorUsage.h2Text};
  font-family: ${fontFamily.mainSans};
  font-size: ${fontSize.h2Text};
  font-weight: ${fontWeight.h2Text};
  margin-top: ${getSpacing(6)};
`,

PageSubTitle: styled.h3`
  line-height: ${lineHeight.h3Text};
  color: ${colorUsage.h3Text};
  font-family: ${fontFamily.mainSans};
  font-size: ${fontSize.h3Text};
  font-weight: ${fontWeight.h3Text};
  margin-top: ${getSpacing(4)};
`,

SelectUser: styled(Select)`
  margin-top: ${getSpacing(4)};
  font-family: ${fontFamily.mainSans};
  font-size: ${fontSize.inputSelectText};
  line-height: ${lineHeight.inputSelectText};
`,

InviteUserLink: styled.div`
  margin-top: ${getSpacing(4)};
  line-height: ${lineHeight.bodyText};
  color: ${colorUsage.bodyText};
  font-family: ${fontFamily.mainSans};
  font-size: ${fontSize.bodyText};
  font-weight: ${fontWeight.bodyText};
`,

ProjectSettingsBlock: styled.div`
  border: solid 1px ${colorUsage.projectSettingsContainerBorder};
  margin-top: ${getSpacing(4)};
  border-radius: 3px;
  font-family: ${fontFamily.mainSans};
  font-size: ${fontSize.inputText};
  line-height: ${lineHeight.inputText};
  color: ${colorUsage.inputText};
`,

ElementContainer: styled.div`
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;

  :first-child {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom: solid 1px ${colorUsage.projectSettingsContainerBorder};
    background-color: ${colorUsage.oddProjectMemberBackground};
    font-weight: bold;
  }

  :last-child {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  :nth-child(odd){
    background-color: ${colorUsage.oddProjectMemberBackground};
  }
`,

AuditParameterName: styled.div`
  width: 40%;
`,

Configuration: styled.div`
  width: 40%;
`,

NetworkShape: styled.div`
  width: 20%;
`,

MemberUsername: styled.div`
  width: 25%;
`,

MemberEmail: styled.div`
  width: 30%;
`,

MemberAdminBadgeContainer: styled.div`
  width: 40%;
  display:flex;
  justify-content: center;
`,

MemberAdminDeleteContainer: styled.div`
  width: 5%;
  display: flex;
  flex-direction: row-reverse;
`,

MemberAdminDeleteButton: styled.button`
  cursor: pointer;
  border: none;
  border-radius: 50%;
  height: 24px;
  width: 24px;
  padding: 2px;
  background: inherit;

  &:hover {
    opacity: 0.5;
    background: white;
    transition-duration: 0.2s;
  }
`,

SettingsFieldContainer: styled.div`
  margin-top: ${getSpacing(4)};
`,

ExplanationText: styled.span`
  margin-top: ${getSpacing(4)};
  line-height: ${lineHeight.bodyText};
  color: ${colorUsage.bodyText};
  font-family: ${fontFamily.mainSans};
  font-size: ${fontSize.bodyText};
  font-weight: ${fontWeight.bodyText};
`,
};

export default Style;
