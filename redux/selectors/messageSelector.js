import {createSelector} from '@reduxjs/toolkit';
import {
  conversationListSelector,
  doctorConversationListSelector,
} from './conversationSelector';
import {infoSelector} from '../selectors/infoSelector';
import {doctorProfileSelector} from './doctor/infoSelector';
export const messageListSelector = state => state.messages.messages;
export const conversationClickedSelector = state =>
  state.messages.conversation_id_clicked;

export const messageListByConversationSelector = createSelector(
  conversationListSelector,
  conversationClickedSelector,
  messageListSelector,
  infoSelector,
  (conversations, conversation_id, messages, me) => {
    const conversation_clicked = conversations.find(
      conversation => conversation._id === conversation_id,
    );

    const _messages = messages.map(message => {
      return {
        ...message,
        sender:
          conversation_clicked.members[0]._id === message.senderId
            ? {
                username: conversation_clicked.members[0].person.username,
                avatar: conversation_clicked.members[0].person.avatar,
              }
            : {
                username: conversation_clicked.members[1].person.username,
                avatar: conversation_clicked.members[1].person.avatar,
              },
        isMe: me._id === message.senderId ? true : false,
      };
    });

    return _messages;
  },
);

export const messageDoctorListByConversationSelector = createSelector(
  doctorConversationListSelector,
  conversationClickedSelector,
  messageListSelector,
  doctorProfileSelector,
  (conversations, conversation_id, messages, me) => {
    const conversation_clicked = conversations.find(
      conversation => conversation._id === conversation_id,
    );

    const _messages = messages.map(message => {
      return {
        ...message,
        sender:
          conversation_clicked.members[0]._id === message.senderId
            ? {
                username: conversation_clicked.members[0].person.username,
                avatar: conversation_clicked.members[0].person.avatar,
              }
            : {
                username: conversation_clicked.members[1].person.username,
                avatar: conversation_clicked.members[1].person.avatar,
              },
        isMe: me.doctor._id === message.senderId ? true : false,
      };
    });

    return _messages;
  },
);
