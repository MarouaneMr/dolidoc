import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import SuccessfullyRegister from '@/components/SuccessfullyRegister'
import { useTranslation } from 'react-i18next'
import { useNavigation } from 'expo-router'

export default function index() {
  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  
  return (
    <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
     <SuccessfullyRegister title={t('appointment_success')} btnText={t('go_to_home')}/>
    </View>
  )
}

