import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";

function ConversationItem({ conversation, onPress }) {
    return (
        <TouchableOpacity
            style={styles.conversation_container}
            onPress={onPress}
        >
            <Image
                source={{ uri: conversation.member.avatar }}
                style={styles.conversation_avatar}
            />

            <View style={styles.conversation_content}>
                <View>
                    <Text style={styles.conversation_username}>
                        {conversation.member.username}
                    </Text>
                    <Text>{conversation.last_message.content}</Text>
                </View>
                <View>
                    <Text>
                        {moment(conversation.last_message.createdAt)
                            .startOf("day")
                            .fromNow()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    conversation_container: {
        backgroundColor: "#B4E4FF",
        height: 100,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: 8,
        borderRadius: 16,
    },
    conversation_avatar: {
        width: 80,
        height: 80,
        marginLeft: 8,
        borderRadius: 50,
    },
    conversation_content: {
        padding: 8,
        width: "75%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    conversation_username: {
        fontSize: 16,
        paddingBottom: 8,
        fontWeight: "700",
    },
});

export default ConversationItem;
