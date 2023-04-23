import {createSelector} from '@reduxjs/toolkit';
import {AVATAR_DEFAULT} from '../../common/constant';
import {infoSelector} from '../selectors/infoSelector';
import {doctorProfileSelector} from './doctor/infoSelector';
import moment from 'moment';

export const conversationListSelector = state =>
  state.conversations.conversations;

export const doctorConversationListSelector = state =>
  state.doctor_conversations.conversations;

export const cleanConversationListSelector = createSelector(
  infoSelector,
  conversationListSelector,
  (user, conversations) => {
    if (user && conversations) {
      const conversationList = conversations.map(conversation => {
        const member =
          conversation.members[0]._id === user._id
            ? conversation.members[1]
            : conversation.members[0];

        return {
          _id: conversation._id,
          member: {
            _id: member._id,
            username: member.person.username,
            avatar:
              member.person.avatar !== ''
                ? member.person.avatar
                : AVATAR_DEFAULT,
          },
          last_message: {
            content: conversation.last_message?.content ?? '',
            createdAt: conversation.last_message?.createdAt ?? '',
          },
        };
      });

      // console.log(conversationList);
      return conversationList;
    }

    return [];
  },
);

export const cleanDoctorConversationListSelector = createSelector(
  doctorProfileSelector,
  doctorConversationListSelector,
  (profile, conversations) => {
    if (profile && conversations.length > 0) {
      const conversationList = conversations.map(conversation => {
        const member =
          conversation.members[0]?._id === profile?.doctor?._id
            ? conversation.members[1]
            : conversation.members[0];

        return {
          _id: conversation._id,
          member: {
            _id: member._id,
            username: member.person.username,
            avatar:
              member.person.avatar !== ''
                ? member.person.avatar
                : AVATAR_DEFAULT,
          },
          last_message: {
            content: conversation.last_message?.content ?? '',
            createdAt: conversation.last_message?.createdAt ?? '',
          },
        };
      });

      return conversationList;
    }
    return [];
  },
);
