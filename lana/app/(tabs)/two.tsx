import { Text } from '@/components/Text'
import axios from 'axios'
import { useState } from 'react'
import { Alert, Button, TextInput, StyleSheet, View, ScrollView, Pressable } from 'react-native'

type FormData = {
  [key: string]: string
}

const initialFormData: FormData = {
  year: '',
  weekofyear: '',
  ndvi_ne: '',
  ndvi_nw: '',
  ndvi_se: '',
  ndvi_sw: '',
  precipitation_amt_mm: '',
  reanalysis_air_temp_k: '',
  station_avg_temp_c: '',
  reanalysis_relative_humidity_percent: '',
  station_precip_mm: ''
}

export default function TabTwoScreen() {
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const [result, setResult] = useState<string>()

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value })
  }

  const handlePredict = () => {
    if (Object.values(formData).some(value => value === '')) {
      Alert.alert('Error', 'Datos incompletos')
      return
    }

    const data = {
      year: parseInt(formData.year),
      weekofyear: parseInt(formData.weekofyear),
      ndvi_ne: parseFloat(formData.ndvi_ne),
      ndvi_nw: parseFloat(formData.ndvi_nw),
      ndvi_se: parseFloat(formData.ndvi_se),
      ndvi_sw: parseFloat(formData.ndvi_sw),
      precipitation_amt_mm: parseFloat(formData.precipitation_amt_mm),
      reanalysis_air_temp_k: parseFloat(formData.reanalysis_air_temp_k),
      station_avg_temp_c: parseFloat(formData.station_avg_temp_c),
      reanalysis_relative_humidity_percent: parseFloat(formData.reanalysis_relative_humidity_percent),
      station_precip_mm: parseFloat(formData.station_precip_mm)
    }

    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/predict1`, data)
      .then(response => {
        setResult(`Casos de dengue: ${response.data.result.toFixed(2)}`)
      })
      .catch(error => {
        alert(error.message || 'Ocurrió un error')
      })
  }

  return (
    <ScrollView style={styles.container}>
      <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 2</Text>
      <Text textStyle='Title1' colorStyle='Primary'>Casos de dengue</Text>
      <View style={styles.groupedList}>
        {Object.keys(initialFormData).map((key) => (
          <>
            <View style={styles.row} key={key}>
              <View style={styles.title}>
                <Text textStyle='Body' colorStyle='Primary'>{key.replace(/_/g, ' ').toUpperCase()}:</Text>
              </View>
              <TextInput
                style={styles.textField}
                keyboardType='numeric'
                value={formData[key]}
                onChangeText={(value) => handleChange(key, value)}
              />
            </View>
            <View style={styles.separator} />
          </>
        ))}
      </View>
      <Pressable style={styles.tableRow} onPress={handlePredict}>
        <Text textStyle='Body' colorStyle='Tint'>Predecir</Text>
      </Pressable>
      {result && 
        <>
          <View style={{ marginTop: 37, paddingHorizontal: 16 }}>
            <Text textStyle='Footnote' colorStyle='Secondary'>RESULTADO</Text>
          </View>
          <View style={styles.result}>
            <Text textStyle='Body' colorStyle='Tint'>{result}</Text>
          </View>
          <View style={{ marginTop: 9, paddingHorizontal: 16 }}>
            <Text textStyle='Footnote' colorStyle='Secondary'>Mimi</Text>
          </View>
        </>
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f7'
  },
  groupedList: {
    maxWidth: 640,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 10
  },
  row: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tableRow: {
    height: 44,
    maxWidth: 640,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 37
  },
  separator: {
    height: 1,
    backgroundColor: '#b9b9bb',
    marginHorizontal: 16
  },
  title: {
    width: 100
  },
  textField: {
    flex: 1,
    fontSize: 17,
    borderWidth: 0,
    paddingHorizontal: 16,
    height: '100%'
  },
  result: {
    maxWidth: 640,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 149, 0, .15)',
    marginTop: 10,
    padding: 16
  }
})