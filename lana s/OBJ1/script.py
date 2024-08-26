import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import pearsonr, ttest_ind, randint
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import roc_auc_score, roc_curve, auc, accuracy_score, confusion_matrix
from sklearn.inspection import permutation_importance
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.pipeline import Pipeline
import xgboost as xgb
import joblib

datos = pd.read_csv('dataset.csv')

columnas = datos.columns

datos_1 = [
    'departamento',
    'provincia',
    'distrito',
    'mes',
    'edad',
    'sexo',
    'temperatura',
    'presencia_aguas_estancadas',
    'enfermedad'
]

datos_prueba = datos[datos_1]

import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import numpy as np

X = datos_prueba[['edad', 'sexo', 'enfermedad', 'mes']].values
y_provincia = datos_prueba['provincia'].values
y_distrito = datos_prueba['distrito'].values
y_departamento = datos_prueba['departamento'].values

X_train_provincia, X_test_provincia, y_train_provincia, y_test_provincia = train_test_split(
    X, y_provincia, test_size=0.3, random_state=42
)

X_train_distrito, X_test_distrito, y_train_distrito, y_test_distrito = train_test_split(
    X, y_distrito, test_size=0.3, random_state=42
)

X_train_departamento, X_test_departamento, y_train_departamento, y_test_departamento = train_test_split(
    X, y_departamento, test_size=0.3, random_state=42
)

all_classes_distrito = np.unique(np.concatenate([y_train_distrito, y_test_distrito]))

for clase in all_classes_distrito:
    if clase not in y_train_distrito:
        X_train_distrito = np.vstack([X_train_distrito, np.zeros((1, X_train_distrito.shape[1]))])
        y_train_distrito = np.append(y_train_distrito, clase)

all_classes_departamento = np.unique(np.concatenate([y_train_departamento, y_test_departamento]))

for clase in all_classes_departamento:
    if clase not in y_train_departamento:
        X_train_departamento = np.vstack([X_train_departamento, np.zeros((1, X_train_departamento.shape[1]))])
        y_train_departamento = np.append(y_train_departamento, clase)
    
modelo_provincia = xgb.XGBClassifier(
    objective='multi:softmax',
    num_class=len(set(y_provincia)),
    random_state=42
)

modelo_distrito = xgb.XGBClassifier(
    objective='multi:softmax',
    num_class=len(set(y_distrito)),
    random_state=42
)

modelo_departamento = xgb.XGBClassifier(
    objective='multi:softmax',
    num_class=len(set(y_departamento)),
    random_state=42
)

modelo_provincia.fit(X_train_provincia, y_train_provincia)

modelo_distrito.fit(X_train_distrito, y_train_distrito)

modelo_departamento.fit(X_train_departamento, y_train_departamento)

y_pred_provincia = modelo_provincia.predict(X_test_provincia)
y_pred_distrito = modelo_distrito.predict(X_test_distrito)
y_pred_departamento = modelo_departamento.predict(X_test_departamento)

import joblib

joblib.dump(modelo_provincia, 'modelo_provincia_xgb.pkl')

joblib.dump(modelo_distrito, 'modelo_distrito_xgb.pkl')

joblib.dump(modelo_departamento, 'modelo_departamento_xgb.pkl')

# Probar modelo

modelo_provincia_cargado = joblib.load('modelo_provincia_xgb.pkl')

modelo_distrito_cargado = joblib.load('modelo_distrito_xgb.pkl')

modelo_departamento_cargado = joblib.load('modelo_departamento_xgb.pkl')

mapa_departamento = {
    0: 'CAJAMARCA',
    1: 'JUNIN',
    2: 'LA LIBERTAD',
    3: 'LORETO',
    4: 'MADRE DE DIOS',
    5: 'PIURA',
    6: 'TUMBES',
    7: 'UCAYALI'
}

mapa_provincia = {
    0: 'ALTO AMAZONAS',
    1: 'CHANCHAMAYO',
    2: 'CORONEL PORTILLO',
    3: 'JAEN',
    4: 'MAYNAS',
    5: 'MORROPON',
    6: 'PIURA',
    7: 'SATIPO',
    8: 'SULLANA',
    9: 'TALARA',
    10: 'TAMBOPATA',
    11: 'TRUJILLO',
    12: 'TUMBES',
    13: 'ZARUMILLA'
}

mapa_distrito = {
    0: 'AGUAS VERDES',
    1: 'BELEN',
    2: 'BELLAVISTA',
    3: 'BUENOS AIRES',
    4: 'CALLERIA',
    5: 'CAMPOVERDE',
    6: 'CASTILLA',
    7: 'CATACAOS',
    8: 'CHANCHAMAYO',
    9: 'CHULUCANAS',
    10: 'CORRALES',
    11: 'CURA MORI',
    12: 'EL PORVENIR',
    13: 'FERNANDO LORES',
    14: 'FLORENCIA DE MORA',
    15: 'HUANCHACO',
    16: 'INAMBARI',
    17: 'IQUITOS',
    18: 'JAEN',
    19: 'LA ARENA',
    20: 'LA CRUZ',
    21: 'LA ESPERANZA',
    22: 'LA MATANZA',
    23: 'LA UNION',
    24: 'LABERINTO',
    25: 'LAREDO',
    26: 'LAS LOMAS',
    27: 'LAS PIEDRAS',
    28: 'LOS ORGANOS',
    29: 'MANANTAY',
    30: 'MANCORA',
    31: 'MARCAVELICA',
    32: 'MAZAMARI',
    33: 'MIGUEL CHECA',
    34: 'MORROPON',
    35: 'PAMPAS DE HOSPITAL',
    36: 'PANGOA',
    37: 'PAPAYAL',
    38: 'PARIÑAS',
    39: 'PERENE',
    40: 'PICHANAQUI',
    41: 'PIURA',
    42: 'PUNCHANA',
    43: 'QUERECOTILLO',
    44: 'RIO NEGRO',
    45: 'SALITRAL',
    46: 'SAN JACINTO',
    47: 'SAN JUAN BAUTISTA',
    48: 'SAN JUAN DE BIGOTE',
    49: 'SAN JUAN DE LA VIRGEN',
    50: 'SAN RAMON',
    51: 'SATIPO',
    52: 'SULLANA',
    53: 'TAMBO GRANDE',
    54: 'TAMBOPATA',
    55: 'TRUJILLO',
    56: 'TUMBES',
    57: 'VEINTISEIS DE OCTUBRE',
    58: 'YARINACOCHA',
    59: 'YURIMAGUAS',
    60: 'ZARUMILLA'
}

nuevos_datos = pd.DataFrame({
    'mes': list(range(1, 13)),  # Meses de 1 a 12
    'edad': [60] * 12,  # Mantener constante la edad en 25 para todos los meses
    'sexo': [1] * 12,  # Mantener constante el sexo en 1 (Mujer) para todos los meses
    'temperatura': [20] * 12,  # Mantener constante la temperatura en 23 para todos los meses
    'enfermedad': [1] * 12  # Mantener constante la enfermedad en 0 (No tiene) para todos los meses
})

X_nuevos_datos = nuevos_datos[['edad', 'sexo', 'enfermedad', 'mes']].values

probabilidades_provincia = modelo_provincia_cargado.predict_proba(X_nuevos_datos) * 100
probabilidades_distrito = modelo_distrito_cargado.predict_proba(X_nuevos_datos) * 100
probabilidades_departamento = modelo_departamento_cargado.predict_proba(X_nuevos_datos) * 100

prediccion_provincia = modelo_provincia_cargado.predict(X_nuevos_datos)
prediccion_distrito = modelo_distrito_cargado.predict(X_nuevos_datos)
prediccion_departamento = modelo_departamento_cargado.predict(X_nuevos_datos)

prediccion_provincia_nombres = [mapa_provincia[p] for p in prediccion_provincia]
prediccion_distrito_nombres = [mapa_distrito[d] for d in prediccion_distrito]
prediccion_departamento_nombres = [mapa_departamento[dp] for dp in prediccion_departamento]

probabilidades_provincia = np.round(probabilidades_provincia, 2)
probabilidades_distrito = np.round(probabilidades_distrito, 2)
probabilidades_departamento = np.round(probabilidades_departamento, 2)

umbral_bajo_riesgo = 30

def recomendar_lugares(probabilidades, nombres, umbral):
    recomendaciones = []
    for i, prob in enumerate(probabilidades):
        if prob.max() < umbral:
            recomendaciones.append(nombres[i])
    return recomendaciones

recomendaciones_provincia = recomendar_lugares(probabilidades_provincia, prediccion_provincia_nombres, umbral_bajo_riesgo)
recomendaciones_distrito = recomendar_lugares(probabilidades_distrito, prediccion_distrito_nombres, umbral_bajo_riesgo)
recomendaciones_departamento = recomendar_lugares(probabilidades_departamento, prediccion_departamento_nombres, umbral_bajo_riesgo)

print("Predicciones para Departamento:", prediccion_departamento_nombres)
print("Predicciones para Provincia:", prediccion_provincia_nombres)
print("Predicciones para Distrito:", prediccion_distrito_nombres)