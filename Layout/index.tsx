import { View, Text } from 'react-native'
import React from 'react'
interface Props{
 children?: React.ReactNode;

}
export default function AuthLayout({children}:Props) {
  return (
    <View>
     {children}
    </View>
  )
}