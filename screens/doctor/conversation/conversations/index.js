import {useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ConversationItem from '../../../../components/ConversationItem';
import {cleanDoctorConversationListSelector} from '../../../../redux/selectors/conversationSelector';
import {doctorProfileSelector} from '../../../../redux/selectors/doctor/infoSelector';
import {fetchConversationByDoctorId} from '../../../../redux/slices/doctor/doctorConversationSlice';
import {getAllConversation} from '../../../../services/doctor/patient';
import RouterKey from '../../../../utils/Routerkey';
import Header from '../../../../components/Header';

function DoctorConversationList({navigation}) {
  const doctor_conversations = useSelector(cleanDoctorConversationListSelector);

  const onPressConversation = conversation => {
    navigation.navigate(RouterKey.DOCTOR_CONVERSATION_DETAIL_SCREEN, {
      conversation,
    });
  };

  return (
    <>
      <Header title={'Cuộc trò chuyện'} handle={() => navigation.goBack()} />
      <ScrollView>
        {doctor_conversations.length > 0 &&
          doctor_conversations.map(conversation => (
            <ConversationItem
              conversation={conversation}
              key={conversation._id}
              onPress={() => onPressConversation(conversation)}
            />
          ))}
      </ScrollView>
    </>
  );
}

export default DoctorConversationList;
