import { createSelector } from "@reduxjs/toolkit";
import { infoSelector } from "../selectors/infoSelector";

export const conversationListSelector = (state) =>
    state.conversations.conversations;

export const cleanConversationListSelector = createSelector(
    infoSelector,
    conversationListSelector,
    (user, conversations) => {
        const conversationList = conversations.map((conversation) => {
            const member =
                conversation.members[0]._id === user._id
                    ? conversation.members[1]
                    : conversation.members[0];

            return {
                _id: conversation._id,
                member: {
                    _id: member._id,
                    username: member.person.username,
                    avatar: member.person.avatar,
                },
                last_message: {
                    content: conversation.last_message.content,
                    createdAt: conversation.last_message.createdAt,
                },
            };
        });

        // console.log(conversationList);
        return conversationList;
    }
);
