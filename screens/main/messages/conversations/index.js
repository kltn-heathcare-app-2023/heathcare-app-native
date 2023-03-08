import { useEffect } from "react";
import { Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ConversationItem from "../../../../components/ConversationItem";
import { cleanConversationListSelector } from "../../../../redux/selectors/conversationSelector";
import { infoSelector } from "../../../../redux/selectors/infoSelector";
import { fetchConversationByPatientId } from "../../../../redux/slices/conversationSlice";

import RouterKey from "../../../../utils/Routerkey";
function ConversationScreen({ navigation }) {
    const user_info = useSelector(infoSelector);
    const conversations = useSelector(cleanConversationListSelector);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchConversationByPatientId(user_info._id));
    }, []);

    const onPressConversation = (conversation) => {
        navigation.navigate(RouterKey.CONVERSATION_DETAIL_SCREEN, {
            conversation,
        });
    };

    return (
        <ScrollView>
            {conversations.length > 0 &&
                conversations.map((conversation) => (
                    <ConversationItem
                        conversation={conversation}
                        key={conversation._id}
                        onPress={() => onPressConversation(conversation)}
                    />
                ))}
        </ScrollView>
    );
}

export default ConversationScreen;
