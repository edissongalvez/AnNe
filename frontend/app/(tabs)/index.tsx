import { Button } from '@/components/Button';
import { DropDown } from '@/components/DropDown';
import { InputField } from '@/components/InputField';
import { Text } from '@/components/Text';
import { StyleSheet, View } from 'react-native';

const places = [
  'Trujillo'
]

const years = [
  '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009',
  '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019',
  '2020', '2021', '2022'
]

const weeks = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
  '41', '42', '43', '44', '45', '46', '47', '48', '49', '50',
  '51', '52'
]

const diagnostics = [
  'A97.0', 'A97.2', 'A97.1'
]

export default function TabOneScreen() {
    return (
    <View style={styles.container}>
      <Text textStyle='Headline' colorStyle='Secondary'>OBJETIVO 1</Text>
      <Text textStyle='Title1' colorStyle='Primary'>Identificar áreas de alto riesgo</Text>
      <DropDown placeholder='Distrito' items={places} />
      <DropDown placeholder='Año' items={years} />
      <DropDown placeholder='Semana' items={weeks} />

      <InputField placeholder='Densidad de población' />
      <InputField placeholder='Temperatura' />

      <DropDown placeholder='Diagnostico' items={diagnostics} />

      <InputField placeholder='Precipitaciones' />
      <InputField placeholder='Humedad' />
      <InputField placeholder='Tasa de urbanización' />
      <DropDown placeholder='Presencia de aguas estancadas' items={['No', 'Si']} />


      <Button />
      <Text textStyle='Body' colorStyle='Tint'>La predicción es: Alto Riesgo</Text>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 16,
    gap: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
