import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import pearsonr
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_auc_score, roc_curve, auc, confusion_matrix
from sklearn.inspection import permutation_importance
import xgboost as xgb
from scipy.stats import ttest_ind
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score, roc_curve, auc
from sklearn.metrics import accuracy_score
import joblib

datos = pd.read_csv('dataset.csv')

columnas = datos.columns

datos_1 = ['fiebre', 'cefalea', 'dolrretroo', 'malgias', 'artralgia', 'erupcionr', 'dolor_abdo', 'vomito', 'diarrea', 'caida_plaq']

respuesta = ['clasfinal']

datos_prueba = datos[datos_1  + respuesta]

datos_relevantes = datos[datos_1 + respuesta]

DENV = pd.DataFrame({
    'model': [None],
    'CImin': [None],
    'AUC': [None],
    'CImax': [None]
})

def pred_fun(X_model, newdata):
    return X_model.predict_proba(newdata)[:, 1]

CI_df = pd.DataFrame(columns=['i', 'CImin', 'AUC', 'CImax'])

CI_df = pd.DataFrame(columns=['i', 'CImin', 'AUC', 'CImax'])

for each in range(10):
    train, test = train_test_split(datos_relevantes, test_size=0.2, random_state=42)

    mod = RandomForestClassifier(n_estimators=200, random_state=42)
    mod.fit(train.drop('clasfinal', axis=1), train['clasfinal'])

    importances = permutation_importance(mod, train.drop('clasfinal', axis=1), train['clasfinal'], n_repeats=10, random_state=42)
    importance_df = pd.DataFrame(importances.importances_mean, index=train.drop('clasfinal', axis=1).columns, columns=['Importance']).sort_values(by='Importance', ascending=False)

    for i in range(2, 21):
        selected_variables = importance_df.head(i).index

        train1 = train[selected_variables.union(['clasfinal'])]
        test1 = test[selected_variables.union(['clasfinal'])]

        mod.fit(train1.drop('clasfinal', axis=1), train1['clasfinal'])

        preds_test = mod.predict_proba(test1.drop('clasfinal', axis=1))[:, 1]

        fpr, tpr, _ = roc_curve(test1['clasfinal'], preds_test)
        roc_auc = auc(fpr, tpr)

        CImin, AUC, CImax = np.percentile([roc_auc], [2.5, 50, 97.5])

        new_row = pd.DataFrame({'i': [i], 'CImin': [CImin], 'AUC': [AUC], 'CImax': [CImax]})

        CI_df = pd.concat([CI_df, new_row], ignore_index=True)

joblib.dump(mod, 'model.pkl')

print("Modelo guardado exitosamente como 'model.pkl'")

# Realizar predicción de prueba

modelo_cargado = joblib.load('model.pkl')

nuevo_paciente = {
    'fiebre': 1,        # 1: Sí, 0: No
    'cefalea': 1,       # 1: Sí, 0: No
    'dolrretroo': 1,    # 1: Sí, 0: No
    'malgias': 1,       # 1: Sí, 0: No
    'artralgia': 1,     # 1: Sí, 0: No
    'erupcionr': 0,     # 1: Sí, 0: No
    'dolor_abdo': 0,    # 1: Sí, 0: No
    'vomito': 0,        # 1: Sí, 0: No
    'diarrea': 0,       # 1: Sí, 0: No
    'caida_plaq': 0     # 1: Sí, 0: No
}

datos_entrada = pd.DataFrame([nuevo_paciente])

columnas_esperadas = modelo_cargado.feature_names_in_

datos_entrada = datos_entrada[columnas_esperadas]

prediccion = modelo_cargado.predict(datos_entrada)

probabilidades = modelo_cargado.predict_proba(datos_entrada)

mapa_clases = {0: 'No Dengue', 1: 'Dengue'}

resultado = mapa_clases.get(prediccion[0], 'Clase desconocida')

print(f"Resultado de la predicción: {resultado}")

# Resultado = Resultado de la predicción: No Dengue