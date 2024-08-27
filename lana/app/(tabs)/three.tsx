import { Text } from '@/components/Text'
import { AuthContext } from '@/contexts/AuthContext'
import { sendWhatsapp } from '@/services/authService'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'

interface FormData {
  fiebre: boolean
  cefalea: boolean
  dolrretroo: boolean
  malgias: boolean
  artralgia: boolean
  erupcionr: boolean
  dolor_abdo: boolean
  vomito: boolean
  diarrea: boolean
  caida_plaq: boolean
}

export default function TabThreeScreen() {
  const [formData, setFormData] = useState<FormData>({
    fiebre: false,
    cefalea: false,
    dolrretroo: false,
    malgias: false,
    artralgia: false,
    erupcionr: false,
    dolor_abdo: false,
    vomito: false,
    diarrea: false,
    caida_plaq: false
  })
  const [result, setResult] = useState<string>()

  const authContext = useContext(AuthContext)

  if (!authContext) {
    return null
  }

  const { user } = authContext

  const handleToggleSwitch = (field: keyof FormData) => {
    setFormData({ ...formData, [field]: !formData[field] })
  }

  const handleSubmit = () => {

    const data = {
      fiebre: formData.fiebre ? 1 : 0,
      cefalea: formData.cefalea ? 1 : 0,
      dolrretroo: formData.dolrretroo ? 1 : 0,
      malgias: formData.malgias ? 1 : 0,
      artralgia: formData.artralgia ? 1 : 0,
      erupcionr: formData.erupcionr ? 1 : 0,
      dolor_abdo: formData.dolor_abdo ? 1 : 0,
      vomito: formData.vomito ? 1 : 0,
      diarrea: formData.diarrea ? 1 : 0,
      caida_plaq: formData.caida_plaq ? 1 : 0
    }

    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/predict2`, data)
      .then(response =>
        setResult(`Probabilidad de dengue: ${response.data.result} (${response.data.probability_dengue.toFixed(2)})\n\n${response.data.interpretation}`)
      )
      .catch(error => {
        alert(error.message || 'Ocurrió un error')
      })
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
      const response = await sendWhatsapp( user.phone, `RESULTADO DE DIAGNOSTICO DE DENGUE:\n\n${result}`, user.token)
      alert(response.message)
    } catch (error: any) {
      alert('Error al enviar')
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 3</Text>
      <Text textStyle='Title1' colorStyle='Primary'>Diagnóstico de dengue</Text>
      <View style={{ marginTop: 37, paddingHorizontal: 16 }}>
        <Text textStyle='Footnote' colorStyle='Secondary'>FORMULARIO</Text>
      </View>
      <View style={styles.groupedList}>

        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Fiebre</Text> 
          </View>
          <Switch value={formData.fiebre} onValueChange={() => handleToggleSwitch('fiebre')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Cefalea</Text> 
          </View>
          <Switch value={formData.cefalea} onValueChange={() => handleToggleSwitch('cefalea')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Dolor retro-ocular</Text> 
          </View>
          <Switch value={formData.dolrretroo} onValueChange={() => handleToggleSwitch('dolrretroo')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Mialgias</Text> 
          </View>
          <Switch value={formData.malgias} onValueChange={() => handleToggleSwitch('malgias')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Artralgia</Text> 
          </View>
          <Switch value={formData.artralgia} onValueChange={() => handleToggleSwitch('artralgia')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Erupción</Text> 
          </View>
          <Switch value={formData.erupcionr} onValueChange={() => handleToggleSwitch('erupcionr')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Dolor abdominal</Text> 
          </View>
          <Switch value={formData.dolor_abdo} onValueChange={() => handleToggleSwitch('dolor_abdo')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Vómito</Text> 
          </View>
          <Switch value={formData.vomito} onValueChange={() => handleToggleSwitch('vomito')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Diarrea</Text> 
          </View>
          <Switch value={formData.diarrea} onValueChange={() => handleToggleSwitch('diarrea')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.title}>
            <Text textStyle='Body' colorStyle='Primary'>Caída de plaquetas</Text> 
          </View>
          <Switch value={formData.caida_plaq} onValueChange={() => handleToggleSwitch('caida_plaq')} trackColor={{false: 'rgba(120, 120, 128, .16)', true: 'rgba(255, 149, 0, 1)'}} />
        </View>

      </View>

      <View style={{ marginTop: 9,  paddingHorizontal: 16, maxWidth: 640, }}>
        <Text textStyle='Footnote' colorStyle='Secondary'>Modelo predictivo para detectar la presencia de dengue en pacientes, usando síntomas clínicos como fiebre, dolor, erupciones, y caída de plaquetas.</Text>
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
            <Text textStyle='Footnote' colorStyle='Secondary'>Mimi & Gemini</Text>
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
    padding: 20,
    backgroundColor: '#f2f2f7'
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 44,
    alignItems: 'center',
    paddingHorizontal: 16
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
    alignItems: 'center',
    justifyContent: 'space-between',
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