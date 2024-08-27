import { Text } from '@/components/Text'
import { AuthContext } from '@/contexts/AuthContext'
import { sendWhatsapp } from '@/services/authService'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

export default function TabTwoScreen() {
  const [year, setYear] = useState('')
  const [weekofyear, setWeekofyear] = useState('')
  const [ndvi_ne, setNdviNe] = useState('')
  const [ndvi_nw, setNdviNw] = useState('')
  const [ndvi_se, setNdviSe] = useState('')
  const [ndvi_sw, setNdviSw] = useState('')
  const [precipitation_amt_mm, setPrecipitationAmtMm] = useState('')
  const [reanalysis_air_temp_k, setReanalysisAirTempK] = useState('')
  const [station_avg_temp_c, setStationAvgTempC] = useState('')
  const [reanalysis_relative_humidity_percent, setReanalysisRelativeHumidityPercent] = useState('')
  const [station_precip_mm, setStationPrecipMm] = useState('')

  const [result, setResult] = useState<string>('')

  const authContext = useContext(AuthContext)

  if (!authContext) {
    return null
  }

  const { user } = authContext

  const handleSubmit = async () => {
    if (!year || !weekofyear || !ndvi_ne || !ndvi_nw || !ndvi_se || !ndvi_sw || !precipitation_amt_mm || !reanalysis_air_temp_k || !station_avg_temp_c || !reanalysis_relative_humidity_percent || !station_precip_mm) {
      alert('Datos incompletos')
      return
    }

    if (
      isNaN(parseInt(year)) || parseInt(year) < 1990 || parseInt(year) > 2013 ||
      isNaN(parseInt(weekofyear)) || parseInt(weekofyear) < 1 || parseInt(weekofyear) > 53 ||
      isNaN(parseFloat(ndvi_ne)) || parseFloat(ndvi_ne) < -1 || parseFloat(ndvi_ne) > 1 ||
      isNaN(parseFloat(ndvi_nw)) || parseFloat(ndvi_nw) < -1 || parseFloat(ndvi_nw) > 1 ||
      isNaN(parseFloat(ndvi_se)) || parseFloat(ndvi_se) < -1 || parseFloat(ndvi_se) > 1 ||
      isNaN(parseFloat(ndvi_sw)) || parseFloat(ndvi_sw) < -1 || parseFloat(ndvi_sw) > 1 ||
      isNaN(parseFloat(precipitation_amt_mm)) || parseFloat(precipitation_amt_mm) < 0 || parseFloat(precipitation_amt_mm) > 200 ||
      isNaN(parseFloat(reanalysis_air_temp_k)) || parseFloat(reanalysis_air_temp_k) < 295 || parseFloat(reanalysis_air_temp_k) > 302 ||
      isNaN(parseFloat(station_avg_temp_c)) || parseFloat(station_avg_temp_c) < 24.2 || parseFloat(station_avg_temp_c) > 30.3 ||
      isNaN(parseFloat(reanalysis_relative_humidity_percent)) || parseFloat(reanalysis_relative_humidity_percent) < 64.9 || parseFloat(reanalysis_relative_humidity_percent) > 98 ||
      isNaN(parseFloat(station_precip_mm)) || parseFloat(station_precip_mm) < 0 || parseFloat(station_precip_mm) > 212
    ) {
      alert('Datos incorrectos')
      return
    }

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/predict1`, [
        {
          year: parseInt(year),
          weekofyear: parseInt(weekofyear),
          ndvi_ne: parseFloat(ndvi_ne),
          ndvi_nw: parseFloat(ndvi_nw),
          ndvi_se: parseFloat(ndvi_se),
          ndvi_sw: parseFloat(ndvi_sw),
          precipitation_amt_mm: parseFloat(precipitation_amt_mm),
          reanalysis_air_temp_k: parseFloat(reanalysis_air_temp_k),
          station_avg_temp_c: parseFloat(station_avg_temp_c),
          reanalysis_relative_humidity_percent: parseFloat(reanalysis_relative_humidity_percent),
          station_precip_mm: parseFloat(station_precip_mm)
        }
      ])

      setResult(`${response.data.result.toFixed(2)} casos de dengue\n\n${response.data.interpretation}`)
    } catch (error: any) {
      alert('Error al predecir')
    }
  }

  const handleSendWhatsapp = async () => {
    if (!user) {
      alert('Inicie sesión')
      return
    }

    if (!result) {
      alert('Sin nada que enviar')
      return
    }

    try {
      const response = await sendWhatsapp( user.phone, `RESULTADO DE CASOS DE DENGUE:\n\n${result}`, user.token)
      alert(response.message)
    } catch (error: any) {
      alert('Error al enviar')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 2</Text>
      <Text textStyle='Title1' colorStyle='Primary'>Casos de dengue</Text>
      <View style={{ marginTop: 37, paddingHorizontal: 16 }}>
        <Text textStyle='Footnote' colorStyle='Secondary'>FORMULARIO</Text>
      </View>
      <View style={styles.groupedList}>

        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Año</Text> 
          </View>
          <TextInput style={styles.textField} value={year} onChangeText={setYear} keyboardType='numeric' placeholder='Ingresar 1990-2013' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Semana del año</Text> 
          </View>
          <TextInput style={styles.textField} value={weekofyear} onChangeText={setWeekofyear} keyboardType='numeric' placeholder='Ingresar 1-53' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>NDVI noreste</Text> 
          </View>
          <TextInput style={styles.textField} value={ndvi_ne} onChangeText={setNdviNe} keyboardType='numeric' placeholder='Ingresar -1-1' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>NDVI noroeste</Text> 
          </View>
          <TextInput style={styles.textField} value={ndvi_nw} onChangeText={setNdviNw} keyboardType='numeric' placeholder='Ingresar -1-1' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>NDVI sureste</Text> 
          </View>
          <TextInput style={styles.textField} value={ndvi_se} onChangeText={setNdviSe} keyboardType='numeric' placeholder='Ingresar -1-1' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>NDVI suroeste</Text> 
          </View>
          <TextInput style={styles.textField} value={ndvi_sw} onChangeText={setNdviSw} keyboardType='numeric' placeholder='Ingresar -1-1' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Precipitación (mm)</Text> 
          </View>
          <TextInput style={styles.textField} value={precipitation_amt_mm} onChangeText={setPrecipitationAmtMm} keyboardType='numeric' placeholder='Ingresar 0-200' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Temperatura del aire (K)</Text> 
          </View>
          <TextInput style={styles.textField} value={reanalysis_air_temp_k} onChangeText={setReanalysisAirTempK} keyboardType='numeric' placeholder='Ingresar 295-302' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Temperatura promedio (°C)</Text> 
          </View>
          <TextInput style={styles.textField} value={station_avg_temp_c} onChangeText={setStationAvgTempC} keyboardType='numeric' placeholder='Ingresar 24.2-30.3' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Humedad relativa (%)</Text> 
          </View>
          <TextInput style={styles.textField} value={reanalysis_relative_humidity_percent} onChangeText={setReanalysisRelativeHumidityPercent} keyboardType='numeric' placeholder='Ingresar 64.9-98' placeholderTextColor='#c5c5c7' />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Precipitación en estación (mm)</Text> 
          </View>
          <TextInput style={styles.textField} value={station_precip_mm} onChangeText={setStationPrecipMm} keyboardType='numeric' placeholder='Ingresar 0-212' placeholderTextColor='#c5c5c7' />
        </View>

      </View>
      <View style={{ marginTop: 9,  paddingHorizontal: 16, maxWidth: 640, }}>
        <Text textStyle='Footnote' colorStyle='Secondary'>Modelo de machine learning para predecir casos de dengue, basado en datos ambientales y climáticos como NDVI, precipitación, temperatura, y humedad.</Text>
      </View>
      <Pressable style={styles.tableRow} onPress={handleSubmit}>
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
          <Pressable style={styles.tableRow} onPress={handleSendWhatsapp}>
            <Text textStyle='Body' colorStyle='Tint'>Enviar a WhatsApp</Text>
          </Pressable>
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
    width: 200
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